const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    email:{
        type:String
    },
    product_id:[
        {
            type:Number
        }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("CartData", cartSchema);