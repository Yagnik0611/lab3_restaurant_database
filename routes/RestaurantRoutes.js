const express = require('express');
const RestaurantModel = require('../models/Restaurant');
const app = express();



// to add data 
//http://localhost:3000/restaurants
app.post("/restaurants", async (req, res) => {
    try {
      const restaurants = req.body;
      await RestaurantModel.insertMany(restaurants);
      res.send("Data saved successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  });


//http://localhost:3000/restaurants

app.get('/restaurants', async (req, res) => {
  const restaurants = await RestaurantModel.find();

  try {
    
    res.status(200).send(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});



// http://localhost:3000/restaurants/cuisine/Japanese
// http://localhost:3000/restaurants/cuisine/Bakery
// http://localhost:3000/restaurants/cuisine/Italian


app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  const name = req.params.cuisine
  const restaurant = await RestaurantModel.find({cuisine : name});
  
  
  
  try {
    if(restaurant.length != 0){
      res.send(restaurant);
    }else{
      res.send(JSON.stringify({status:false, message: "No data found"}))
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//http://localhost:3000/restaurants?sortBy=ASC
//http://localhost:3000/restaurants?sortBy=DESC

//
app.get("/restaurants", async (req, res) => {
    const sortBy = req.query.sortBy;
  
    try {
      let sort;
      if (sortBy === "ASC") {
        sort = { restaurant_id: 1 };
      } else if (sortBy === "DESC") {
        sort = { restaurant_id: -1 };
      } else {
        sort = {};
      }
  
      const restaurants = await RestaurantModel.find({}, "cuisine name city restaurant_id")
        .sort(sort)
        .exec();
  
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  //http://localhost:3000/restaurants/Delicatessen
app.get("/restaurants/:cuisine", async (req, res) => {
    const cuisine = req.params.cuisine;
    const city = "Brooklyn";
    const restaurants = await RestaurantModel
        .find({ cuisine: cuisine })
        .where("city")
        .ne(city)
        .select("cuisine name city")
        .sort({ name: "asc" });
    try {
        res.send(restaurants);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = app

