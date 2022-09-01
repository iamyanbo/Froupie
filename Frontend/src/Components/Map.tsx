import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_KEY!,
    })

    const [map, setMap] = React.useState(null)
    const [addresss, setaddresss] = React.useState([""])

    const handleAddAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // max addresss is 20
        if (addresss.length < 20) {
            setaddresss([...addresss, ""])
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // Turn array into string for API call, makes sure to remove empty strings
        const addresssString = "/?origins=" + addresss.filter(address => address !== "").join("|")
        const result = await axios.get('http://localhost:8080' + addresssString)
        console.log(result)
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
                {addresss.map((address, index) => (
                    <div key={index} className="flex flex-col m-4">
                        <input id={index.toString()} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Address" 
                        onChange={(e) => {
                            const newaddresss = [...addresss]
                            newaddresss[index] = e.target.value
                            setaddresss(newaddresss)
                        }}
                        />
                    </div>
                ))}
            <div className= 'flex'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-1/5 bottom-0 absolute" onClick={handleSubmit}>Search</button>
            </div>

            </div>
            <div className= 'w-4/5 h-screen'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    { /* Child components, such as markers, info windows, etc. */ }
                    <></>
                </GoogleMap>
            </div>
        </div>
    ) : <></>
}

export default React.memo(MyComponent)