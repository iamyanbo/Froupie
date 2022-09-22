interface Props {
    data: any;
    handleSort: (e: any) => void;
    displayData: any;
    setCenter: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; }>>;
    setMarkerData: React.Dispatch<React.SetStateAction<{}>>;
}

const RestaurantList = ({ data, handleSort, displayData, setCenter, setMarkerData }: Props) => {
    return (
        <div className='w-1/5 right-0 absolute h-full overflow-auto'>
            {Object.keys(data).length !== 0 ? (
                // if data is not empty, display the filter options
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
                        // map through the data and display the restaurant name, rating, price, and distance
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
                                    // display the distance from each input location to the restaurant
                                    return (
                                        // Don't use index as key
                                        <p className="text-sm text-slate-400" key={data2.distance.text + data2.duration.text + index}>From address {index + 1}: {data2.distance.text}, {data2.duration.text}</p>
                                    )
                                })}
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
    )
}

export default RestaurantList