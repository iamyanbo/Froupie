import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { useCookies } from 'react-cookie';

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
    const [cookies, setCookie] = useCookies(['remindMe']);
    if (cookies.remindMe === undefined) {
        setCookie('remindMe', true, { path: '/' });
    }
    const [isChecked, setIsChecked] = React.useState(false)
    const [show, setShow] = React.useState(true)
    const [error, setError] = React.useState(false)

    const handleAddAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // max address is 20
        if (address.length < 20) {
            setaddress([...address, ""])
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            // Turn array into string for API call, makes sure to remove empty strings and duplicates
            const addressString = address.filter((item: string) => item !== "").filter((item: string, index: number) => address.indexOf(item) === index).join("|")
            const addressClean = "/?origins=" + addressString.replace(/[&\/\\#+()$~%":*?<>{}]/g, '')
            const result = await axios.get('http://localhost:8080' + addressClean)
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
        setIsChecked(e.target.checked)
    }

    const handleUnderstand = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setCookie('remindMe', !isChecked, { path: '/' })
        setShow(false)
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
            {/*Locations input*/}
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
            {/*Map*/}
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
            {/*Simple restaurant display*/}
            {Object.keys(markerData).length !== 0 ? (
            <div className='w-1/5 absolute h-[350px] left-[20%] bottom-0 bg-white grid grid-rows-4 gap-1'>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant address: {markerData.destination_address}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant name: {markerData.restaurant_name}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant price level: {markerData.restaurant_price_level}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant rating: {markerData.restaurant_rating}</h1>
            </div>
            ): null}
            {/*Restaurant list display*/}
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
                            console.log(data1)
                            return (
                            <div className="flex space-x-4 rounded-xl bg-white p-3 shadow-sm border-2 py-2 px-4 border-gray-400 m-2 cursor-pointer hover:bg-gray-300" key={data1.address + data1.name}
                                onClick={() => {
                                    setCenter(data1.geocode)
                                    setMarkerData({
                                        destination_address: data1.address,
                                        restaurant_name: data1.name,
                                        restaurant_price_level: data1.price,
                                        restaurant_rating: data1.rating,
                                    })
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
                    <h1 className='text-black text-2xl flex justify-center items-center h-full text-center'>
                        Search something to see the results
                    </h1>
                }
            </div>
            {/*Modal*/}
            {cookies.remindMe === 'true' ? (
                <div>
                    {show ? (
                        <div className='w-[50%] absolute h-[30%] left-[25%] top-[25%] overflow-auto bg-white rounded-lg'>
                        {/* Model for basic information */}
                        <div className='flex justify-center items-center'>
                            <p className="text-5xl font-bold text-gray-600 mt-8">Welcome to Froupie's!</p>
                        </div>
                        <div className='flex justify-center items-center h-[50%] overflow-auto'>
                            <p className="justify-center items-center flex w-4/5 flex m-4">This is a website to find nearby restaurant to eat with friends and family. The max number of addresses you can input is 20 (as more locations are inputted, 
                            the longer it will take to compute, so be patient!). This project is made with 
                                Google API. Not all restaurants may be displayed as the API by default only returns 20 retaurant locations, while this may be extended to a max of 60,
                                doing so will severly reduce performance. In addition, the max radius for finding restaurants is 50km (30-40mins depending on mode of transportation) around any given location, anything farther than that
                                will not be recorded. For more information on this project, you can take a look at the github repository at the bottom left.
                            </p>
                        </div>
                        <button className="hover:bg-gray-500 bg-gray-200 inline-block px-8 py-2 text-white font-medium leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out absolute bottom-0 left-0 m-4"
                            onClick={() => { window.open('https://github.com/iamyanbo/Group-Food', '_blank') }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-8 h-8">
                            <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                            </svg>
                        </button>                        
                        <div className="form-check m-4 absolute bottom-2 right-[45%]">
                            <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckChecked" 
                                onChange={handleChange}
                            />
                            <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckChecked">
                                Don't show this again
                            </label>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-2/5 right-0 absolute bottom-0 rounded-lg m-4" onClick={handleUnderstand}>I understand</button>
                    </div>
                    ) : null}
                </div>
            ): null}
            {/*Error modal*/}
            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 h-[5%] w-1/5 absolute bottom-[3%] flex items-center justify-center" role="alert">
                    <strong className="font-bold">Error! One or more input locations are invalid.</strong>
                    <span className="block sm:inline">{error}</span>
                    </div>
            ) : null}
        </div>
    ) : <></>
}

export default React.memo(MyComponent)