//To verify DataBase connection 
const mongodb = require("mongodb");
//const MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose'); 

let _db;

const mongoConnect = (cb) => {
	mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then((client) => {
			if (client) console.log("Connected to DB");
			cb();
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const getDb = () => {
	if (_db) return _db;
	throw "DB not Connected";
};



module.exports = { mongoConnect, getDb };
