const pgp = require("pg-promise")({ promiseLib: Promise });
const databaseConn = require("./database");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fileType = require("file-type");
const db = pgp(databaseConn);

module.exports.getRestaurants = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
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
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  db
    .many("SELECT dishes.id, dishes.name, dishes.description, dishes.prices, dishes.restaurant_id, restaurants.name AS restaurant_name, restaurants.address AS restaurant_address, restaurants.longitude AS restaurant_longitude, restaurants.latitude AS restaurant_latitude FROM dishes JOIN restaurants ON restaurants.id = dishes.restaurant_id")
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
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  db
    .many("SELECT * FROM users")
    .then(users => {
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
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
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
        statusCode: 200,
        body: JSON.stringify(event)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.addDishToRestaurant = (event, context, callback) => {
  
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const newDish = JSON.parse(event.body);
  const resId = newDish.resId;
  const dishName = newDish.name;
  const description = newDish.description;
  const price = newDish.prices;
  const imageURL = newDish.imageURL
  db
    .one(
      "INSERT INTO dishes (name, description, restaurant_id, prices, dish_image_url) VALUES ($1, $2, $3, $4) RETURNING *;",
      [dishName, description, resId, price, imageURL]
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

module.exports.addCommentToDish = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
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
        statusCode: 200,
        body: JSON.stringify(comment)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getComments = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
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
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const resId = event.pathParameters.id;
  db
    .one("SELECT * FROM restaurants WHERE id = $1", [
      resId
    ])
    .then(restaurant => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(restaurant)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getUserById = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const userId = event.pathParameters.id;
  db
    .one("SELECT * FROM users WHERE id = $1", [userId])
    .then(user => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      };
      callback(null, response);
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getRestaurantsByArea = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
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
    })
    .catch(err => {
      callback(err);
    });
};

module.exports.getDishByRestaurantId = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const resId = event.pathParameters.id;
  db.many("SELECT dishes.id, dishes.name, dishes.description, dishes.prices, dishes.restaurant_id, dishes.dish_image_url, restaurants.name AS restaurant_name, restaurants.address AS restaurant_address, restaurants.phone AS restaurant_phone FROM dishes JOIN restaurants ON restaurants.id = dishes.restaurant_id WHERE restaurant_id = $1", [resId])
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
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const dishId = event.pathParameters.id;
  db.many('SELECT comments.body, comments.created_at, comments.title, comments.user_id, comments.rating, comments.dish_id, comments.id, users.first_name AS users_first_name, users.last_name AS users_last_name FROM comments JOIN users ON users.id = comments.user_id  WHERE dish_id = $1', [dishId])
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
  

module.exports.updateAccount = (event, context, callback) => {};

// module.exports.uploadImage = (event, context, callback) => {
//   const request = event.body;
//   console.log(event.body);
//   // const base64String = request.base64String;
//   const buffer = new Buffer(event.body, "base64");

//   const fileMime = fileType(buffer);
//   if (fileMime === null) {
//     return context.fail("the string supplied is not a file type");
//   }

//   const file = getFile(fileMime, buffer);
//   const params = file.params;

//   s3.putObject(params, function(err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     return console.log("File URL: ", file.full_path);
//   });
// };

module.exports.uploadImage = (event, context, callback) => {
  let buffer = new Buffer(event.body, "base64");

  console.log("Starting File saving!");

  let params = {
    Bucket: "vinder-photos",
    Key: "image1.jpg",
    Body: buffer,
    ContentEncoding: "image/jpeg",
    ACL: "public-read"
  };

  s3.putObject(params, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("succesfully uploaded the image!");
    }
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };

  callback(null, response);
};

// module.exports.uploadImage = (event, context, callback) => {
//   //console.log(event);
//   //var params = JSON.parse(event.body);
//   var params = JSON.parse(event.body);
//   console.log(params);

//   var s3Params = {
//     Bucket: "vinder-photos",
//     Key: params.name,
//     ContentType: params.type,
//     ACL: "public-read"
//   };

//   var uploadURL = s3.getSignedUrl("putObject", s3Params);

//   callback(null, {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "https://www.my-site.com"
//     },
//     body: JSON.stringify({ uploadURL: uploadURL })
//   });
// };
