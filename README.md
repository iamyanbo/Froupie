# Froupie
Website to find a nearby restaurant for a group of friends or family

This project was made in Typescript with React for frontend and Express Node.js for backend.
To visit the website, open [https://froupie-frontend.vercel.app/](https://froupie-frontend.vercel.app/) to view it in browser
To view the project for yourself, clone this repository and get an API key from google and store it in a .env in both front and backend

## Frontend
This was made in Typescript with React. When first visiting the website, you will be prompted with a disclaimer, this includes all the details of the website, what it can do and its limitations. If this was missed for some reason, it is written below.

This is a website to find nearby restaurant to eat with friends and family. The max number of addresses you can input is 20 (as more locations are inputted, the longer it will take to compute, so be patient!). This project is made with Google API. Not all restaurants may be displayed as the API by default only returns 20 retaurant locations, while this may be extended to a max of 60, doing so will severly reduce performance. In addition, the max radius for finding restaurants is 50km (30-40mins depending on mode of transportation) around any given location, anything farther than that will not be recorded.

If you are running this locally, make sure you have a .env file in the frontend folder with your API key labeled as REACT_APP_API_KEY. To start, use npm start.

## Backend
This was made in Typescript with Express Node.js, the main purpose I have decided to split this project into front and backend was because of self practice, this project can be written completely as a frontend application given some CORS tweaks. 

If you are running this locally, make sure you have a .env file in the backend folder with your API key labeled as GOOGLE_API_KEY. To start, use ### npm run dev.
