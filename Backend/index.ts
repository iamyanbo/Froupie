import { config } from 'dotenv'
import express, { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'
import e from 'express';
config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    const origins = req.query.origins
    const destinations = req.query.destinations
    const units = req.query.units

    axios.get('https://maps.googleapis.com/maps/api/distancematrix/json'
        + '?origins=' + origins
        + '&destinations=' + destinations
        + '&units=' + units
        + '&key=' + process.env.GOOGLE_API_KEY
    ).then(response => {
        console.log(response.data.rows)
        res.send(JSON.stringify(response.data));
    }).catch(error => {
        res.send(error);
    })
})

app.get('/restaurant', async (req: Request, res: Response) => {
    // gets user's preferred travel time, assuming mode of transportation is driving
    const travelDuration = req.query.travelDuration
    // origins is a string of locations seperated by '|'
    const origins: any = req.query.origins
    if (origins == undefined) {
        res.send('Please provide origins');
        return;
    }
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
    const restaurantDistances: any[] = []
    for (let chunk of restaurantChunks) {
        const destinations = chunk.map((restaurant: any) => restaurant.vicinity).join('|')
        //remove special characters from destinations and origins except for '|'
        const originsClean = originsArray.map((origin: any) => origin.replace(/[^\w\s]/gi, '')).join('|')
        const destinationsClean = destinations.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '')
        console.log(destinationsClean)
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json'
            + '?origins=' + originsClean
            + '&destinations=' + destinationsClean
            + '&units=' + 'metric'
            + '&key=' + process.env.GOOGLE_API_KEY
        )
        console.log(response.data.rows)
        restaurantDistances.push(response.data.rows)
    }
    res.send(JSON.stringify(restaurantDistances));
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
})