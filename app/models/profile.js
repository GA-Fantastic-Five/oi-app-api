const mongoose = require('mongoose')

// Profile model
const profileSchema = new mongoose.Schema({
  nickname: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://sanjivcpa.com/upload/photos/avatar.jpg'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Profile', profileSchema)
