# Good Tunes API

## Requirements

1. NVM to manage multiple versions of Node
2. MongoDB (I am using version 3 and installed with Homebrew)

Paul's Docker branch could be merged in which will make this easier to work on between us.

## Get up and running

1. `npm install`
2. Start MongoDb you may need to run the following command specifying the DBPath: `mongod --dbpath /usr/local/var/mongodb` replacing the path to your database
3. Copy the emailed `.develop.env` and `.production.env` into ./config/
4. Run the command `npm run dev`

## URLs baby

The API: [http://localhost:3010](http://localhost:3010)
The WWW: [http://localhost:7080](http://localhost:7080)
