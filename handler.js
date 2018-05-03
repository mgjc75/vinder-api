const pgp = require("pg-promise")({ promiseLib: Promise });
const databaseConn = require("./database");

const db = pgp(databaseConn);

module.exports.getRestaurants = (event, context, callback) => {
  db
    .many("SELECT * FROM restaurants LIMIT 10")
    .then(restaurants => {
      // console.log(Array.isArray(restaurants), Object.keys(restaurants));
      const response = {
        statusCode: 200,
        body: JSON.stringify(restaurants)
      };
      callback(null, response);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
