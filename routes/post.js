const mongoose = require('mongoose');

const postSchema =  mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  description: {
    type: String,
    default: "",
  },
  image: String
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});


module.exports = mongoose.model('post', postSchema);
