import axios from 'axios';

const Map = () => {

    const handleClick = (e: any) => {
        axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=' + process.env.REACT_APP_API_KEY
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="map">
            <button className="map-button" onClick={handleClick}/>
        </div>
    );
}
export default Map;