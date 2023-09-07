const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    maxlength: [
      30,
      'A username name must have less or equal then 30 characters'
    ],
    minlength: [5, 'A username name must have more or equal then 3 characters']
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
    select: false,
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

userSchema.pre('save', async function(next) {
  //  CHECK IF THE PASSWORD IS MODIFIED OR NOT
  if (!this.isModified('password')) return next();
  //  IF MODIFIED THEN HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12); // 12 IS COST OF THE HASH, MORE HIGH THE VAL, MORE COMPLICATED THE HASH
  //  SET THE UNDEFINED VAL FOR NOT STORE IN DB, JUST FOR VALIDATION ABOVE
  this.passwordConfirm = undefined;
});

userSchema.methods.verifyPassword = async (currPassword, userPassword) => {
  return bcrypt.compare(currPassword, userPassword); // RETURN BOOLEAN
};
const User = mongoose.model('User', userSchema);

module.exports = User;
