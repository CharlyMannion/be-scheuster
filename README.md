# Scheuster - API

View the website [here](https://goldenshoe.netlify.app/)

Find the hosted back end [here](https://be-scheuster.herokuapp.com/api)

View the front end repository [here](https://github.com/CharlyMannion/fe-scheuster)

Check out the presentation slides [here](https://docs.google.com/presentation/d/1CiV3ls1eskvFRgxnzb3ImigvVxlpMBCXm5KJqQg78ao/edit#slide=id.p)

View the trello board [here](https://trello.com/b/DpW95zmA/scheuster)

## Running the backend App locally
* Clone the repo [here](https://github.com/CharlyMannion/be-scheuster): 
```
git clone git@github.com:CharlyMannion/be-scheuster.git
```
* Go into the project directory:
```
cd be-scheuster
```
* Open the app in your favourite text editor to view the code (We like VSCode):
```
code .
```
* To install all dependencies, in your terminal type:
```
npm i
```

## Setting up the Database
```
npm run setup-dbs
```

## Seeding the Data
```
npm run seed
```

## Running Tests
```
npm run test-app
```

## Background

I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimick the building of a real world backend service, which should provide this information to the front end architecture.

My database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).

I will complete setup and seeding phase of this project, then build the server up! 


## Possible Endpoints

```
GET /api

GET /api/shoes

GET /api/shoes/?name=Bovver+Boot

POST /api/shoes


GET /api/shoes/:shoe_id

PATCH /api/shoes/:shoe_id -> .send {reduce_stock: 1}

DELETE /api/shoes/:shoe_id


GET /api/users

GET /api/users/?name=Arthur

GET /api/users/?username=Atty

GET /api/users/?email=arthur@gmail.com

POST /api/users


GET /api/users/:user_id

PATCH /api/users/:user_id .send {username: newName}

DELETE /api/users/:user_id


GET /api/orders (default sorts orders by order_date in descending order)

GET /api/orders/?username=Atty

GET /api/orders/?shoe=Bovver+Boot

POST /api/orders


GET /api/orders/:user_id

PATCH /api/orders/:user_id .send {shipped_date: "2017-12-10T12:56:33.798Z", returned_date: "2017-12-10T12:56:33.798Z", refund_date: "2017-12-10T12:56:33.798Z"}
```