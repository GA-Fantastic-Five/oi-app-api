const mongoose = require('mongoose')

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
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, profile) => {
      delete profile.owner
      return profile
    }
  }
})

module.exports = mongoose.model('Profile', profileSchema)
