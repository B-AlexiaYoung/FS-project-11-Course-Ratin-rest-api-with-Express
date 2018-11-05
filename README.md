# FS-project-11-Course-Ratin-rest-api-with-Express

## Seed your MongoDB database with data.
* If you haven't already done so, open a Command Prompt (on Windows) or Terminal (on Mac OS X) instance and run the command mongod (or sudo mongod) to start the MongoDB daemon.
* Open a second Command Prompt (on Windows) or Terminal (on Mac OS X) instance.
* Browse to the seed-data folder located in the root of the project.
* Run the following commands:
```
mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json

mongoimport --db course-api --collection users --type=json --jsonArray --file users.json

mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json
```

## Tests
* run tests by typing npm test
