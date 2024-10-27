# CalApp

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
Open a terminal window and cd into the calapp directory, then do the following

`cd calapi`

`bundle install`

`rails s`

Open another terminal window and cd into the calapp directory again, then do the following

`cd calfrontend`

`npm install`

`npm start`

Navigate to [http://localhost:3000/](http://localhost:3000/)

## How to another test user
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



