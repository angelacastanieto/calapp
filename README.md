# CalApp
CalApp is a fullstack application with a React frontend and a Rails backend

The React Frontend can be found in the `calfrontend` directory

The Rails backend can be found in the `calapi` directory

<img width="1247" alt="Screenshot 2024-10-26 at 9 45 36 PM" src="https://github.com/user-attachments/assets/b816085b-c231-462c-a7c0-f7ab78615d3f">
<img width="1196" alt="Screenshot 2024-10-26 at 9 45 19 PM" src="https://github.com/user-attachments/assets/197fe2de-c58b-49ae-8e2f-7b4d89103af9">

## Assumptions
* Time slots will only be available from 8-6 local to user’s current timezone
* Time slots will always be exactly 2 hours
* Assume can always derive timezone from client for now (I did include timezone in the user schema if we want to store that later - to handle things like users using the app in non-home timezones)

## Did not have time for
* Adding notes to bookings
* rating bookings
* deleting bookings
* deleting timeslots

## How to run CalApp app locally

### Prerequisites
Before running this app, you will need to ensure ruby and npm are installed

If you get a version # back when running the following, you have ruby installed; if not, then you'll have to install it ([link](https://www.ruby-lang.org/en/documentation/installation/))

`ruby -v` 

If you get version #'s back when running the following, you have node/npm installed; if not, you'll have to install them ([link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

`node -v`

`npm -v`

### Run CalApp locally
#### Run the rails backend
Open a terminal window and cd into the calapp directory, then do the following

`cd calapi`

`bundle install`

`rails s`

#### Run the React frontend app
Open another terminal window and cd into the calapp directory again, then do the following

`cd calfrontend`

`npm install`

`npm start`

Navigate to [http://localhost:3000/](http://localhost:3000/)

## How to add another test user
From calapp root directory
`cd calapi`

`rails console`

Example in the rails console:

user_type can be either 'coach' or 'student'
```
User.create(
    phone_number:'222-000-0000', 
    user_type: 'coach', 
    first_name: 'Bob', 
    last_name: 'Bobson'
)
```



