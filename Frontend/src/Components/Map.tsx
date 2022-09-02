import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
    width: '100%',
    height: '100%'
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_KEY!,
    })

    const [map, setMap] = React.useState(null)
    const [address, setaddress] = React.useState([""])
    const [data, setData] = React.useState<any>({})
    const [center, setCenter] = React.useState({ lat: 40.730610, lng: -73.935242 })
    const [zoom, setZoom] = React.useState(12)
    const [markerData, setMarkerData] = React.useState<any>({})
    const [displayData, setDisplayData] = React.useState<any>([])

    const handleAddAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // max address is 20
        if (address.length < 20) {
            setaddress([...address, ""])
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // Turn array into string for API call, makes sure to remove empty strings
        const addressString = address.filter(address => address !== "").join("|")
        const addressClean = "/?origins=" + addressString.replace(/[&\/\\#+()$~%":*?<>{}]/g, '')
        const result = await axios.get('http://localhost:8080' + addressClean)
        setData(result.data)
        setCenter(result.data.geocode[0])
        console.log(result.data)
        //clear display data
        setDisplayData([])
        console.log(result.data.destination_addresses.length)
        let temp = []
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
        setDisplayData(temp)
    }

    const handleSort = (e: any) => {
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
        console.log(displayData)
    }

    const onLoad = React.useCallback(function callback(map: any) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <div className='flex'>
            <div className= 'w-1/5 h-screen'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full" onClick={handleAddAddress}>Add another address</button>
                {address.map((address1, index) => (
                    <div key={index} className="flex flex-col m-4">
                        <input id={index.toString()} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Address" 
                        onChange={(e) => {
                            const newaddress = [...address]
                            newaddress[index] = e.target.value
                            setaddress(newaddress)
                        }}
                        />
                    </div>
                ))}
            <div className= 'flex'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-1/5 bottom-0 absolute" onClick={handleSubmit}>Search</button>
            </div>

            </div>
            <div className= 'w-3/5 h-screen'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    { /* Child components, such as markers, info windows, etc. */ }
                    <>
                        {data.geocode !== undefined? data.geocode.map((data1: any, index: number) => (
                            <Marker key={index} position={data1} 
                            onClick={() => {
                                const newMarkerData = {
                                    destination_address: data.destination_addresses[index],
                                    restaurant_name: data.restaurant_names[index],
                                    restaurant_price_level: data.restaurant_price_levels[index],
                                    restaurant_rating: data.restaurant_ratings[index],
                                }
                                setMarkerData(newMarkerData)
                            }}
                            />
                        )): null}
                    </>
                </GoogleMap>
            </div>
            {Object.keys(markerData).length !== 0 ? (
            <div className='w-1/5 absolute h-[200px] left-[20%] bottom-0 bg-white grid grid-rows-4 gap-1'>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant address: {markerData.destination_address}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant name: {markerData.restaurant_name}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant price level: {markerData.restaurant_price_level}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant rating: {markerData.restaurant_rating}</h1>
            </div>
            ): null}
            <div className='w-1/5 right-0 absolute h-full overflow-auto'>
                {Object.keys(data).length !== 0 ? (
                    <div className='w-full bg-white'>
                        <div className="flex justify-center h-[10%] sticky top-0 bg-gray-100">
                            <div className="form-check m-4">
                                <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="name"
                                    onChange={handleSort}
                                />
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
                                    Sort alphabetically
                                </label>
                            </div>
                            <div className="form-check m-4">
                                <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="distance"
                                    onChange={handleSort}
                                />
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault1">
                                    Sort by distance
                                </label>
                            </div>
                            <div className="form-check m-4">
                                <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="rating"
                                    onChange={handleSort}
                                />
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
                                    Sort by rating
                                </label>
                            </div>
                            <div className="form-check m-4">
                                <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="price"
                                    onChange={handleSort}
                                />
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
                                    Sort by price
                                </label>
                            </div>
                        </div>
                        <div>
                        {displayData.map((data1: any, index: number) => {
                            return (
                            <div className="flex space-x-4 rounded-xl bg-white p-3 shadow-sm border-2 py-2 px-4 border-gray-400 m-2 cursor-pointer hover:bg-gray-300" key={data1.address + data1.name}
                                onClick={() => {
                                    setCenter(data1.geocode)
                                }}>
                                <div className='rounded-xl p-3'>
                                    <h4 className="font-semibold text-gray-600">{data1.name}</h4>
                                    <p className="text-sm text-slate-400">Address: {data1.address}</p>
                                    <p className="text-sm text-slate-400">Rating: {data1.rating}</p>
                                    <p className="text-sm text-slate-400">Price level: {data1.price}</p>
                                    {data1.distance.map((data2: any, index: number) => {
                                        return (
                                            // Don't use index as key
                                            <p className="text-sm text-slate-400" key={data2.distance.text + data2.duration.text + index}>From address {index + 1}: {data2.distance.text}, {data2.duration.text}</p>
                                        )
                                    }
                                    )}
                                        
                                </div>
                            </div>
                            )
                        })}
                        </div>
                    </div>
                    ): 
                    <h1 className='text-black text-2xl flex justify-center items-center h-full'>
                        Search something to see the results
                    </h1>
                }
            </div>
        </div>
    ) : <></>
}

export default React.memo(MyComponent)