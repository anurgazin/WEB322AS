var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

var bnbSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  services: {
    type: Array,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  fileName: {
    default: '',
    type: String,
    // required: true
  },
});

module.exports = mongoose.model("bnbs", bnbSchema);
