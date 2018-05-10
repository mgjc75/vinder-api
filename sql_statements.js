const sql = {
  sqlGetRestaurants:
    "SELECT restaurants.id, restaurants.name, restaurants.address, restaurants.phone, restaurants.url, restaurants.longitude, restaurants.latitude,price, restaurants.image_url FROM restaurants;",
  sqlGetUsers:
    "SELECT users.id, users.first_name, users.last_name, users.email, users.valid FROM users;",
  sqlGetRestaurantById:
    "SELECT restaurants.id, restaurants.name, restaurants.address, restaurants.phone, restaurants.url, restaurants.longitude, restaurants.latitude,price, restaurants.image_url FROM restaurants WHERE id = $1",
  sqlGetUserById:
    "SELECT users.id, users.first_name, users.last_name, users.email, users.valid FROM users WHERE id = $1;",
  sqlGetDishByRestaurantId:
    "SELECT dishes.id, dishes.name, dishes.description, dishes.prices, dishes.restaurant_id, dishes.dish_image_url, restaurants.name AS restaurant_name, restaurants.address AS restaurant_address, restaurants.phone AS restaurant_phone FROM dishes JOIN restaurants ON restaurants.id = dishes.restaurant_id WHERE restaurant_id = $1;",
  sqlGetCommentsByDishId:
    "SELECT comments.body, comments.created_at, comments.title, comments.user_id, comments.rating, comments.dish_id, comments.id, users.first_name AS users_first_name, users.last_name AS users_last_name FROM comments JOIN users ON users.id = comments.user_id  WHERE dish_id = $1;",
  sqlGetComments:
    "SELECT comments.id, comments.title, comments.body, comments.created_at, comments.rating, comments.user_id, comments.dish_id FROM comments;",
  sqlGetDishes:
    "SELECT dishes.id, dishes.name, dishes.description, dishes.prices, dishes.restaurant_id, restaurants.name AS restaurant_name, restaurants.address AS restaurant_address, restaurants.longitude AS restaurant_longitude, restaurants.latitude AS restaurant_latitude FROM dishes JOIN restaurants ON restaurants.id = dishes.restaurant_id;",
  sqlAddCommentToDish:
    "INSERT INTO comments (title, body, rating, user_id, dish_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
  sqlAddDishToRestaurant:
    "INSERT INTO dishes (name, description, restaurant_id, prices, dish_image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
  sqlAddNewUser:
    "INSERT INTO users (first_name, last_name, email, valid) VALUES ($1, $2, $3, $4) RETURNING *;"
};

module.exports = sql;
