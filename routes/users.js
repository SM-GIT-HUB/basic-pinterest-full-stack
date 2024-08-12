const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/dbase");

const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }
  ],
  dp: {
    type: String,
    default: "default.jpg"
  },
  desc: {
    type: String,
    default: "Hey there! Nice to meet you."
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Basic email validation regex
        return /.+\@.+\..+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);
