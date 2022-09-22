interface Props {
    cookies: any;
    show: boolean;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleUnderstand: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const StartDisclaimer = ({ cookies, show, handleChange, handleUnderstand }: Props) => {
    return (
        <div>
            {cookies.remindMe === 'true' ? (
                <div>
                    {show ? (
                        <div className='w-[50%] absolute h-[30%] left-[25%] top-[25%] overflow-auto bg-white rounded-lg'>
                        {/* Model for basic information */}
                        <div className='flex justify-center items-center'>
                            <p className="text-5xl font-bold text-gray-600 mt-8">Welcome to Froupie!</p>
                        </div>
                        <div className='flex justify-center items-center h-[50%] overflow-auto'>
                            <p className="justify-center items-center flex w-4/5 flex m-4">This is a website to find nearby restaurant to eat with friends and family. The max number of addresses you can input is 20 (as more locations are inputted, 
                            the longer it will take to compute, so be patient!). This project is made with 
                                Google API. Not all restaurants may be displayed as the API by default only returns 20 retaurant locations, while this may be extended to a max of 60,
                                doing so will severly reduce performance. In addition, the max radius for finding restaurants is 50km (30-40mins depending on mode of transportation) around any given location, anything farther than that
                                will not be recorded.  For more information on this project, you can take a look at the github repository at the bottom left.
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
        </div>
    )
}

export default StartDisclaimer