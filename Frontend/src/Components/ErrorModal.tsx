interface Props {
    error: boolean;
}

const ErrorModal = ({ error }: Props) => {
    return (
        <div>
            {error ? (
                // display error modal if one of the input addresses is invalid, this usually means the location does not exist/spelling error or the address includes special characters which the API cannot handle
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 h-[5%] w-1/5 absolute bottom-[3%] flex items-center justify-center" role="alert">
                    <strong className="font-bold">Error! One or more input locations are invalid.</strong>
                    <span className="block sm:inline">{error}</span>
                    </div>
            ) : null}
        </div>
    )
}

export default ErrorModal