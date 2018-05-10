const pgp = require("pg-promise")({ promiseLib: Promise });
const databaseConn = require("./database");
const AWS = require("aws-sdk");
const fileType = require("file-type");
const sql = require("./sql_statements");
const db = pgp(databaseConn);
const s3 = new AWS.S3();

module.exports.getRestaurants = (event, context, callback) => {
  db
    .many(sql.sqlGetRestaurants)
    .then(restaurants => {
      const response = { statusCode: 200, body: JSON.stringify(restaurants) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.addNewUser = (event, context, callback) => {
  const newUser = JSON.parse(event.body);
  const firstName = newUser.firstName;
  const lastName = newUser.lastName;
  const userEmail = newUser.email;
  const userValid = newUser.valid;
  db
    .one(sql.sqlAddNewUser, [firstName, lastName, userEmail, userValid])
    .then(user => {
      const response = {
        statusCode: 201,
        body: JSON.stringify(event)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.addDishToRestaurant = (event, context, callback) => {
  const newDish = JSON.parse(event.body);
  console.log(`newDish: ${newDish}`);
  const resId = newDish.resId;
  const dishName = newDish.dishName;
  const description = newDish.description;
  const price = newDish.price;
  const imageURL = newDish.imageURL;
  db
    .one(sql.sqlAddDishToRestaurant, [
      dishName,
      description,
      resId,
      price,
      imageURL
    ])
    .then(dish => {
      const response = { statusCode: 201, body: JSON.stringify(dish) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.addCommentToDish = (event, context, callback) => {
  const newComment = JSON.parse(event.body);
  const commentTitle = newComment.commentTitle;
  const commentBody = newComment.commentBody;
  const commentRating = newComment.commentRating;
  const userId = newComment.userId;
  const dishId = newComment.dishId;
  db
    .one(sql.sqlAddCommentToDish, [
      commentTitle,
      commentBody,
      commentRating,
      userId,
      dishId
    ])
    .then(comment => {
      const response = {
        statusCode: 201,
        body: JSON.stringify(comment)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getUsers = (event, context, callback) => {
  db
    .many(sql.sqlGetUsers)
    .then(users => {
      const response = { statusCode: 200, body: JSON.stringify(users) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getRestaurantById = (event, context, callback) => {
  const resId = event.pathParameters.id;
  db
    .one(sql.sqlGetRestaurantById, [resId])
    .then(restaurant => {
      const response = { statusCode: 200, body: JSON.stringify(restaurant) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getUserById = (event, context, callback) => {
  const userId = event.pathParameters.id;
  db
    .one(sql.sqlGetUserById, [userId])
    .then(user => {
      const response = { statusCode: 200, body: JSON.stringify(user) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getUserByEmail = (event, context, callback) => {
  const email = event.pathParameters.email;
  db
    .one(sql.sqlGetUserByEmail, [email])
    .then(user => {
      const response = { statusCode: 200, body: JSON.stringify(user) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getDishByRestaurantId = (event, context, callback) => {
  const resId = event.pathParameters.id;
  db
    .many(sql.sqlGetDishByRestaurantId, [resId])
    .then(res => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(res)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getCommentsByDishId = (event, context, callback) => {
  const dishId = event.pathParameters.id;
  db
    .many(sql.sqlGetCommentsByDishId, [dishId])
    .then(dish => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(dish)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getComments = (event, context, callback) => {
  db
    .many(sql.sqlGetComments)
    .then(comments => {
      const response = { statusCode: 200, body: JSON.stringify(comments) };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getDishes = (event, context, callback) => {
  db
    .many(sql.sqlGetDishes)
    .then(dishes => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(dishes)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};
