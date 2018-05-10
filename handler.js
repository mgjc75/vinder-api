const pgp = require("pg-promise")({ promiseLib: Promise });
const databaseConn = require("./database");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fileType = require("file-type");
const db = pgp(databaseConn);

module.exports.getRestaurants = (event, context, callback) => {
  db
    .many(
      "SELECT restaurants.id, restaurants.name, restaurants.address, restaurants.phone, restaurants.url, restaurants.longitude, restaurants.latitude,price, restaurants.image_url FROM restaurants"
    )
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
    .one(
      "INSERT INTO users (first_name, last_name, email, valid) VALUES ($1, $2, $3, $4) RETURNING *;",
      [firstName, lastName, userEmail, userValid]
    )
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
  const resId = newDish.resId;
  const dishName = newDish.name;
  const description = newDish.description;
  const price = newDish.price;
  const imageURL = newDish.imageURL;
  db
    .one(
      "INSERT INTO dishes (name, description, restaurant_id, prices, dish_image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [dishName, description, resId, price, imageURL]
    )
    .then(dish => {
      const response = {
        statusCode: 201,
        body: JSON.stringify(dish)
      };
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
    .one(
      "INSERT INTO comments (title, body, rating, user_id, dish_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [commentTitle, commentBody, commentRating, userId, dishId]
    )
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
    .many(
      "SELECT users.id, users.first_name, users.last_name, users.email, users.valid FROM users"
    )
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
    .one(
      "SELECT restaurants.id, restaurants.name, restaurants.address, restaurants.phone, restaurants.url, restaurants.longitude, restaurants.latitude,price, restaurants.image_url FROM restaurants WHERE id = $1",
      [resId]
    )
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
    .one(
      "SELECT users.id, users.first_name, users.last_name, users.email, users.valid FROM users WHERE id = $1",
      [userId]
    )
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
    .many(
      "SELECT dishes.id, dishes.name, dishes.description, dishes.prices, dishes.restaurant_id, dishes.dish_image_url, restaurants.name AS restaurant_name, restaurants.address AS restaurant_address, restaurants.phone AS restaurant_phone FROM dishes JOIN restaurants ON restaurants.id = dishes.restaurant_id WHERE restaurant_id = $1",
      [resId]
    )
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
    .many(
      "SELECT comments.body, comments.created_at, comments.title, comments.user_id, comments.rating, comments.dish_id, comments.id, users.first_name AS users_first_name, users.last_name AS users_last_name FROM comments JOIN users ON users.id = comments.user_id  WHERE dish_id = $1",
      [dishId]
    )
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
    .many(
      "SELECT comments.id, comments.title, comments.body, comments.created_at, comments.rating, comments.user_id, comments.dish_id FROM comments"
    )
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
    .many(
      "SELECT dishes.id, dishes.name, dishes.description, dishes.prices, dishes.restaurant_id, restaurants.name AS restaurant_name, restaurants.address AS restaurant_address, restaurants.longitude AS restaurant_longitude, restaurants.latitude AS restaurant_latitude FROM dishes JOIN restaurants ON restaurants.id = dishes.restaurant_id"
    )
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
