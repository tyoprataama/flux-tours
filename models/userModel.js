const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    maxlength: [
      15,
      'A username name must have less or equal then 15 characters'
    ],
    minlength: [3, 'A username name must have more or equal then 3 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must have a password'],
    min: [8, 'Password must be contain min 8 character'],
    max: [25, 'Password must be contain max 25 character']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Confirm your password!'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
