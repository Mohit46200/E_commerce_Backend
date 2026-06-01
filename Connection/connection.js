const mongoose = require("mongoose")

async function connectMongoDb(url) {
    mongoose
            .connect(url)
            .then(() => console.log("Database connected"))
            .catch((err )=> console.log("Error in connection ",err))
}

module.exports = connectMongoDb