import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Inputs from './Inputs';
import GMap from './GMap';
import InfoBox from './InfoBox';
import RestaurantList from './RestaurantList';
import StartDisclaimer from './StartDisclaimer';
import ErrorModal from './ErrorModal';

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_KEY!,
    })
    // create states 
    const [map, setMap] = React.useState(null)
    const [address, setAddress] = React.useState([""])
    const [data, setData] = React.useState<any>({})
    const [center, setCenter] = React.useState({ lat: 40.730610, lng: -73.935242 })
    const [zoom, setZoom] = React.useState(12)
    const [markerData, setMarkerData] = React.useState<any>({}) // this is the data that will be displayed on the bottom left of the map for quick reference
    const [displayData, setDisplayData] = React.useState<any>([]) // this is the data that will be displayed on the right side of the screen
    const [cookies, setCookie] = useCookies(['remindMe']);
    if (cookies.remindMe === undefined) {
        setCookie('remindMe', true, { path: '/' });
    }
    const [isChecked, setIsChecked] = React.useState(false)
    const [show, setShow] = React.useState(true)
    const [error, setError] = React.useState(false)

    const handleAddAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
        // function to add another input field
        e.preventDefault()
        // max address is 20
        if (address.length < 20) {
            setAddress([...address, ""])
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            // remove duplicate address from array
            const uniqueAddress = address.filter((v, i, a) => a.indexOf(v) === i);
            // remove empty address from array
            const filteredAddress = uniqueAddress.filter(function (el) {
                return el !== "";
            });
            // join address with "|" for api
            const addressString = filteredAddress.join("|")
            console.log("hewre",addressString)
            const addressClean = "/?origins=" + addressString.replace(/[&\\#+()$~%":*?<>{}]/g, '')
            const result = await axios.get('https://froupie-backend.onrender.com' + addressClean)
            setData(result.data)
            setCenter(result.data.geocode[0])
            //clear display data
            let temp: any[] = []
            // add destination address, price, ratings, and distance to displayData
            for (let i = 0; i < result.data.destination_addresses.length; i++) {
                let distance: any[] = []
                for (let j = 0; j < result.data.rows.length; j++) {
                    distance.push(result.data.rows[j].elements[i])
                }
                temp.push({
                    address: result.data.destination_addresses[i],
                    price: result.data.restaurant_price_levels[i],
                    rating: result.data.restaurant_ratings[i],
                    distance: distance,
                    name: result.data.restaurant_names[i],
                    geocode: result.data.geocode[i]
                })
            }
            //get rid of duplicates
            temp = temp.filter((item: any, index: number) => temp.indexOf(item) === index)
            setDisplayData(temp)
            setError(false)
        } catch (err) {
            setError(true)
        }
    }

    const handleSort = (e: any) => {
        // sort displayData by price, rating, distance, or name
        let temp = [...displayData]
        if (e.target.id === "price") {
            temp.sort((a: any, b: any) => a.price - b.price)
        } else if (e.target.id === "rating") {
            temp.sort((a: any, b: any) => b.rating - a.rating)
        } else if (e.target.id === "distance") {
            // sort by distance from all addresses
            temp.sort((a: any, b: any) => {
                let totalDistance = 0
                for (let i = 0; i < a.distance.length; i++) {
                    totalDistance += a.distance[i].distance.value
                }
                let totalDistance2 = 0
                for (let i = 0; i < b.distance.length; i++) {
                    totalDistance2 += b.distance[i].distance.value
                }
                return totalDistance - totalDistance2
            })
        } else if (e.target.id === "name") {
            temp.sort((a: any, b: any) => a.name.localeCompare(b.name))
        }
        setDisplayData(temp)
    }

    const handleChange = (e: any) => {
        // for not showing disclaimer
        setIsChecked(e.target.checked)
    }

    const handleUnderstand = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // clear popup disclaimer
        e.preventDefault()
        setCookie('remindMe', !isChecked, { path: '/' })
        setShow(false)
    }

    const onLoad = React.useCallback(function callback(map: any) {
        // create map
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <div className='flex'>
            {/*Locations input*/}
            <Inputs address={address} setAddress={setAddress} handleAddAddress={handleAddAddress} handleSubmit={handleSubmit} />
            {/*Map*/}
            <GMap center={center} zoom={zoom} onLoad={onLoad} onUnmount={onUnmount} data={data} setMarkerData={setMarkerData} />
            {/*Simple restaurant display*/}
            <InfoBox markerData={markerData} />
            {/*Restaurant list display*/}
            <RestaurantList data={data} handleSort={handleSort} displayData={displayData} setCenter={setCenter} setMarkerData={setMarkerData} />
            {/*Modal/disclaimer*/}
            <StartDisclaimer cookies={cookies} show={show} handleUnderstand={handleUnderstand} handleChange={handleChange} />
            {/*Error modal*/}
            <ErrorModal error={error} />
        </div>
    ) : <></>
}

export default React.memo(MyComponent)