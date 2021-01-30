const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')

const Profile = require('../models/profile')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

router.post('/profiles', requireToken, (req, res, next) => {
  const id = req.user.id
  const userProfile = req.body.profile
  userProfile.owner = id

  Profile.create(req.body.profile)
    .then(profile => res.status(201).json({ profile: profile }))
    .catch(next)
})

router.get('/profiles', requireToken, (req, res, next) => {
  Profile.find()
    .then(profiles => {
      return profiles.map(profile => profile)
    })
    .then(profiles => res.status(200).json({ profiles: profiles }))
    .catch(next)
})

router.get('/profiles/:nickname', requireToken, (req, res, next) => {
  Profile.findOne({ nickname: req.params.nickname })
    .then(errors.handle404)
    .then(profile => res.status(200).json({ profile: profile }))
    .catch(next)
})

router.get('/profile', requireToken, (req, res, next) => {
  Profile.findOne({ owner: req.user.id })
    .then(profile => {
      if (profile) {
        return profile
      }

      return Profile.create({ nickname: req.user.email, owner: req.user.id })
    })
    .then(profile => {
      // Requiring the user who made the request to own the document
      // and returning the profile if it exists
      errors.requireOwnership(req, profile)
      return profile
    })
    .then(profile => res.status(200).json({ profile: profile }))
    .catch(next)
})

router.patch('/profile', requireToken, removeBlanks, (req, res, next) => {
  const userProfile = req.body.profile

  Profile.findOne({ owner: req.user.id })
    .then(errors.handle404)
    .then((profile) => {
      errors.requireOwnership(req, profile)
      if (userProfile.nickname) {
        profile.nickname = userProfile.nickname
      }
      if (userProfile.avatar) {
        profile.avatar = userProfile.avatar
      }
      return profile.save()
    })
    .then(profile => res.status(200).json({ profile: profile }))
    .catch(next)
})

router.delete('/profile', requireToken, (req, res, next) => {
  Profile.findOne({ owner: req.user.id })
    .then(errors.handle404)
    .then(profile => {
      // Require the user to be the owner of the profile
      errors.requireOwnership(req, profile)

      // Delete the profile
      profile.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
