import { config } from 'dotenv'
import express, { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'
config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response) => {
    // origins needs to be a string of locations seperated by '|', max of 25 origins
    const origins: any = req.query.origins
    if (origins == undefined) {
        res.send('Please provide origins');
        return;
    }
    let geocoded: any = [];
    const originsArray = origins.split('|')
    // for each origin, get the restaurants nearby
    const restaurants: any[] = []
    for (let origin of originsArray) {
        // turn origins into geo coordinates
        const geocode = await axios.get('https://maps.googleapis.com/maps/api/geocode/json'
            + '?address=' + origin
            + '&key=' + process.env.GOOGLE_API_KEY
        )
        const lat = geocode.data.results[0].geometry.location.lat
        const lng = geocode.data.results[0].geometry.location.lng
        // get nearby restaurants for each origin
        const nearbyRestaurants = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json'
            + '?location=' + lat + ',' + lng
            + '&radius=50000'
            + '&type=restaurant'
            + '&key=' + process.env.GOOGLE_API_KEY
        )
        // add each restaurant to the array
        restaurants.push(nearbyRestaurants.data.results)
    }
    // combine all restaurants into one array and delete duplicates
    const allRestaurants = restaurants.flat().filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.place_id === item.place_id
        ))
    )
    // add each restaurant to the geocoded array
    for (let restaurant of allRestaurants) {
        geocoded = [...geocoded, restaurant.geometry.location]
    }
    console.log(allRestaurants[0].geometry.location)
    // split the array into chunks of size 25
    const restaurantChunks = allRestaurants.reduce((acc, cur, i) => {
        const chunkIndex = Math.floor(i / 25)
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = []
        }
        acc[chunkIndex].push(cur)
        return acc
    }
    , [])
    // for each chunk, get the response from distance matrix api
    const temp: any[] = []
    for (let chunk of restaurantChunks) {
        const destinations = chunk.map((restaurant: any) => restaurant.vicinity).join('|')
        //remove special characters from destinations and origins except for '|'
        const originsClean = originsArray.map((origin: any) => origin.replace(/[^\w\s]/gi, '')).join('|')
        const destinationsClean = destinations.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '')
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json'
            + '?origins=' + originsClean
            + '&destinations=' + destinationsClean
            + '&units=' + 'metric'
            + '&key=' + process.env.GOOGLE_API_KEY
        )
        temp.push(response.data)
    }
    // combine all the responses into one dictionary
    const result: any = {}
    for (let response of temp) {
        if (response.destination_addresses != undefined) {
            if (result["destination_addresses"] == undefined) {
                result["destination_addresses"] = []
            }
            result["destination_addresses"].push(response.destination_addresses)
            result["destination_addresses"] = result["destination_addresses"].flat()
        }
        if (response.origin_addresses != undefined) {
            if (result["origin_addresses"] == undefined) {
                result["origin_addresses"] = []
                result["origin_addresses"].push(response.origin_addresses)
                result["origin_addresses"] = result["origin_addresses"].flat()
            }
        }
        if (response.rows != undefined) {
            if (result["rows"] == undefined) {
                result["rows"] = []
            }
            result["rows"].push(response.rows)
            result["rows"] = result["rows"].flat()
        }
    }
    // flatten the duration dictionary (since it is split into multiple rows)
    const tempRows: any[] = []
    for (let i = 0; i < originsArray.length; i++) {
        tempRows.push(result.rows[i])
    }
    for (let i = originsArray.length; i < result.rows.length; i++) {
        tempRows[i % originsArray.length].elements = tempRows[i % originsArray.length].elements.concat(result.rows[i].elements)
        tempRows[i % originsArray.length].elements = tempRows[i % originsArray.length].elements.flat()
    }
    result.rows = tempRows
    //get the restruant's names, ratings, and price_levels
    const restNames: any[] = []
    const restRatings: any[] = []
    const restPriceLevels: any[] = []
    for (let restruant of allRestaurants) {
        restNames.push(restruant.name)
        restRatings.push(restruant.rating)
        restPriceLevels.push(restruant.price_level)
    }
    result.restaurant_names = restNames
    result.restaurant_ratings = restRatings
    result.restaurant_price_levels = restPriceLevels
    result.geocode = geocoded
    res.send(JSON.stringify(result));
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
})