const mongoose = require('mongoose');
const constant = require("../utilities/constantMessage")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage:{
      type: String,
      default:""
    },
    role: {
      type: String,
      enum: [constant?.Enums?.user, constant?.Enums?.admin],   
      default: constant?.Enums?.user,           
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);