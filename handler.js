const pgp = require("pg-promise")({ promiseLib: Promise });
const databaseConn = require("./database");
const AWS = require("aws-sdk");
const s3 = new AWS.s3();
const db = pgp(databaseConn);

module.exports.getRestaurants = (event, context, callback) => {
  db
    .many("SELECT * FROM restaurants")
    .then(restaurants => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(restaurants)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getDishes = (event, context, callback) => {
  db
    .many("SELECT * FROM dishes")
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

module.exports.getUsers = (event, context, callback) => {
  db
    .many("SELECT * FROM users")
    .then(users => {
      // console.log(Array.isArray(restaurants), Object.keys(restaurants));
      const response = {
        statusCode: 200,
        body: JSON.stringify(users)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.addNewUser = (event, context, callback) => {
  const newUser = JSON.parse(event.body);
  const firstname = newUser.first_name;
  const lastname = newUser.last_name;
  const useremail = newUser.user_email;
  const uservalid = newUser.user_valid;
  db
    .one(
      "INSERT INTO users (user_first_name, user_last_name, user_email, user_valid) VALUES ($1, $2, $3, $4) RETURNING *;",
      [firstname, lastname, useremail, uservalid]
    )
    .then(user => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(event)
      };
      callback(null, response);
    });
};

module.exports.addDishToRestaurant = (event, context, callback) => {
  const newDish = JSON.parse(event.body);
  const resId = newDish.resId;
  const dishTitle = newDish.title;
  const description = newDish.description;
  const price = newDish.price;
  db
    .one(
      "INSERT INTO dishes (dish_title, dish_description, restaurant_id, dish_prices) VALUES ($1, $2, $3, $4) RETURNING *;",
      [dishTitle, description, resId, price]
    )
    .then(dish => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(dish)
      };
      callback(null, response);
    });
};

module.exports.addCommentToDish = (event, context, callback) => {
  const newComment = JSON.parse(event.body);
  const commentBody = newComment.commentBody;
  const commentRating = newComment.commentRating;
  const userId = newComment.userId;
  const dishId = newComment.dishId;
  db
    .one(
      "INSERT INTO comments (comment_body, comment_rating, user_id, dish_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [commentBody, commentRating, userId, dishId]
    )
    .then(comment => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(comment)
      };
      callback(null, response);
    });
};

module.exports.getComments = (event, context, callback) => {
  db
    .many("SELECT * FROM comments")
    .then(comments => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(comments)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getRestaurantById = (event, context, callback) => {
  const resId = event.pathParameters.id;
  db
    .one("SELECT * FROM restaurants WHERE restaurants.restaurant_id = $1", [
      resId
    ])
    .then(restaurant => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(restaurant)
      };
      callback(null, response);
    });
};

module.exports.getUserById = (event, context, callback) => {
  const userId = event.pathParameters.id;
  db
    .one("SELECT * FROM users WHERE users.user_id = $1", [userId])
    .then(user => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      };
      callback(null, response);
    });
};

module.exports.getRestaurantsByArea = (event, context, callback) => {
  const currentCoordinates = event.pathParameters.area;
  const coordsArray = currentCoordinates.split(",").map(Number);
  console.log(coordsArray);
  db
    .many(
      "SELECT *, ACOS(SIN(latitude) * SIN($1)) + COS(latitude) * COS($1) * COS(longitude) - ($2)) ) * 6380 AS distance FROM restaurants WHERE ACOS( SIN($2) * SIN($1) + COS(latitude) * COS($1) * COS(longitude) - $1 )) * 6380 < 10",
      [coordsArray[0], coordsArray[1]]
    )
    .then(restaurants => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(restaurants)
      };
      callback(null, response);
    });
};

module.exports.getDishByRestaurantId = (event, context, callback) => {
  const resId = event.pathParameters.id;
  db
    .many("SELECT * FROM dishes WHERE restaurant_id = $1", [resId])
    .then(res => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(res)
      };
      callback(null, response);
    });
};

module.exports.getCommentsByDishId = (event, context, callback) => {
  const dishId = event.pathParameters.id;
  db.many("SELECT * FROM comments WHERE dish_id = $1", [dishId]).then(dish => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(dish)
    };
    callback(null, response);
  });
};

module.exports.updateAccount = (event, context, callback) => {};

module.exports.uploadImage = (event, context, callback) => {};
