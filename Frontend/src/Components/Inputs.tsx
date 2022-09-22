interface Props {
    address: string[]; // array of addresses
    handleAddAddress: (e: React.MouseEvent<HTMLButtonElement>) => void; // function to add another address to address array
    setAddress: React.Dispatch<React.SetStateAction<string[]>>; // function to set the address array
    handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void; // function to call the api with address array
}

const Inputs = ({ address, handleAddAddress, setAddress, handleSubmit }: Props) => {
    return (
        <div className= 'w-1/5 h-screen'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full" onClick={handleAddAddress}>Add another address</button>
                {/* map through the address array and create an input for each address */}
                {address.map((address1, index) => (
                    <div key={index} className="flex flex-col m-4">
                        <input id={index.toString()} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Address" 
                        onChange={(e) => {
                            // update the address array with the new address
                            const newaddress = [...address]
                            newaddress[index] = e.target.value
                            setAddress(newaddress)
                        }}
                        />
                    </div>
                ))}
                {/* button to call the api */}
                <div className= 'flex'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-1/5 bottom-0 absolute" onClick={handleSubmit}>Search</button>
                </div>
            </div>
    )
}

export default Inputs