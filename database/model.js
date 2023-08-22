const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  token: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  expiresat: {
    type: Date,
    default: function () {
      const expire = 1 * 60 * 1000;
      return new Date(Date.now() + expire);
    },
  },
});

DetailsSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    }
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('user', DetailsSchema);
