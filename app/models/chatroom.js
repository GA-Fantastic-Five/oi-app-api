const mongoose = require('mongoose')

// Chatroom model
const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('ChatRoom', chatSchema)
