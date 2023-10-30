const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    maxlength: [
      130,
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
  photo: {
    type: String,
    default: 'user-default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user'
  },
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
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExp: Date
});

userSchema.pre('save', async function(next) {
  //  CHECK IF THE PASSWORD IS MODIFIED OR NOT
  if (!this.isModified('password')) return next();
  //  IF MODIFIED THEN HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12); // 12 IS COST OF THE HASH, MORE HIGH THE VAL, MORE COMPLICATED THE HASH
  //  SET THE UNDEFINED VAL FOR NOT STORE IN DB, JUST FOR VALIDATION ABOVE
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //  1000 means -1seconds bcs when user change password it may took little bit of time
  next();
});

//  This middleware is for executing logic before find() method to get all user
//  This is for hiding active user shows in body response
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } }); // ne means not equals
  next();
});

userSchema.methods.verifyPassword = async (currPassword, userPassword) => {
  return bcrypt.compare(currPassword, userPassword); // RETURN BOOLEAN
};
userSchema.methods.changedPasswordAfter = function(JWTTimeStamps) {
  // JWTTimeStamps is issued at obj in db user
  //  CHECK IF USER HAVE PasswordChangeAt then
  if (this.passwordChangedAt) {
    const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // PARSEINT THE DATE AND DEVIDE TO 100 TO MAKE IT EQUAL FROM JWTTimeStamps FORMAT
    console.log(timeStamp, JWTTimeStamps);
    //  RETURN THE CHANGE PASSWORD DATE IS GREATER THAN JWT DATE
    return JWTTimeStamps < timeStamp;
  }
  //  IF USER DOESN'T HAVE PasswordChangeAt then RETURN FALSE
  return false;
};
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); //  Generate 32 random hex token
  this.passwordResetToken = crypto
    .createHash('sha256') //  encrypt token using hash based on sha 256 algorithm
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExp = Date.now() + 10 * 60 * 1000; // Set the token valid until 10 minutes
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
