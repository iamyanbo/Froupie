import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Props {
    center: { lat: number; lng: number };
    zoom: number;
    onLoad: (map: google.maps.Map) => void;
    onUnmount: (map: google.maps.Map) => void;
    data: any
    setMarkerData: React.Dispatch<React.SetStateAction<{}>>;
}

const Map = ({ center, zoom, onLoad, onUnmount, data, setMarkerData }: Props) => {
    return (
        <div className= 'w-3/5 h-screen'>
            {/* map component with preset conditions */}
                <GoogleMap
                    mapContainerStyle={{
                        width: '100%',
                        height: '100%'
                    }}
                    center={center}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    { /* Child components, such as markers, info windows, etc. 
                    first check if data is not null, then map through the data and create a marker for each address */}
                    <>
                        {data.geocode !== undefined? data.geocode.map((data1: any, index: number) => (
                            <Marker key={index} position={data1} 
                            onClick={() => {
                                // set the marker data to the data of the marker that was clicked for display in InfoBox
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
    )
}

export default Map