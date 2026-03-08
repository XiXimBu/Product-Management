const mongoose = require('mongoose');
const generate= require('../helper/generate');

const accountSchema = new mongoose.Schema(
{
  fullName: String,
  email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20) // Generate a random token of length 20
    },
    phone : String,
    about: String,
    avatar : String,
        role_id: String,
        permissions: [String],
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },

    deletedAt: Date
},

 { timestamps: true });


const Account = mongoose.model('Account', accountSchema, 'accounts');// (Model name, Schema, Collection name)
module.exports = Account; 