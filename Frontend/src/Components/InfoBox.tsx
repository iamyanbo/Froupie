interface Props {
    markerData: any
}

const InfoBox = ({ markerData }: Props) => {
    return (
        <div>
            {Object.keys(markerData).length !== 0 ? (
            <div className='w-1/5 absolute h-[350px] left-[20%] bottom-0 bg-white grid grid-rows-4 gap-1'>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant address: {markerData.destination_address}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant name: {markerData.restaurant_name}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant price level: {markerData.restaurant_price_level}</h1>
                <h1 className='border-2 py-2 px-4 border-gray-400 h-full overflow-auto'>Resturant rating: {markerData.restaurant_rating}</h1>
            </div>
            ): null}
        </div>
    )
}

export default InfoBox