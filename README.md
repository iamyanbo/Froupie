# Froupie
A Website to find nearby restaurants given multiple starting addresses (Inspired by my friends and I who wanted to find a place close to all of us to eat).

This project was made in Typescript with React for frontend and Express Node.js for backend.
To visit the website, open [https://froupie-frontend.vercel.app/](https://froupie-frontend.vercel.app/) to view it in browser.

To view the project for yourself, clone this repository and get an API key from Google and store it in a .env in both front and backend. For more information on how to get your own API key from Google, visit [https://developers.google.com/maps/documentation/javascript/get-api-key](https://developers.google.com/maps/documentation/javascript/get-api-key).

## Frontend
This was made in Typescript with React. When first visiting the website, you will be prompted with a disclaimer, this includes all the details of the website, what it can do and its limitations. If this was missed for some reason, it is written below. (Note, if you are viewing this on the website, the initial load may take up to a minute since the database may be on pause)

This is a website to find nearby restaurant to eat with friends and family. The max number of addresses you can input is 20 (as more locations are inputted, the longer it will take to compute, so be patient!). This project is made with Google API. Not all restaurants may be displayed as the API by default only returns 20 retaurant locations, while this may be extended to a max of 60, doing so will severly reduce performance. In addition, the max radius for finding restaurants is 50km (30-40mins depending on mode of transportation) around any given location, anything farther than that will not be recorded.

The output locations are limited to 20 per input location, while this is extendable to 60 per, [Google API documentation](https://developers.google.com/maps/documentation/javascript/places#place_searches) states you must wait two seconds after executing a search to get another set of results. With more input locations and accounting for calculations, this will severly reduce performance. 

If you are running this locally, make sure you have a .env file in the frontend folder with your API key labeled as REACT_APP_API_KEY. To start, use npm start. There is a bug in this version where if you input locations far apart, it causes an error, this is fixed in the newest update.

## Backend
This was made in Typescript with Express Node.js, the main purpose I have decided to split this project into front and backend was because of self practice, this project can be written completely as a frontend application given some CORS tweaks. 

Update: Now that authentication and persistance of data is implemented, it makes sense to seperate this project into front and backend. This repository will not include the implementation of signup/in and save because of security risks, but the basics (getting data and sending the data) is there for you to view.

If you are running this locally, make sure you have a .env file in the backend folder with your API key labeled as GOOGLE_API_KEY. To start, use npm run dev.

## Hosting 
This application was hosted by Vercel for frontend and Heroku for backend

## TODOS
- Implement Signup/Login for users (DONE Oct, 10, 2022)
- (Save locations) Implement persistance to MySQL AWS database for output data given a set of input locations (DONE Oct, 20, 2022)
- ("Folder" for saved locations) Implement quick access for data saved in database in frontend (DONE Oct, 22, 2022)
