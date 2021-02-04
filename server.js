// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Profile = require('./app/models/profile')

// Import socket.io packages
// HTTP server that runs Express & Socket together
const http = require('http')
// Importing our socket.io package after doing an 'npm install socket.io'
const socket = require('socket.io')

// require route files
const exampleRoutes = require('./app/routes/example_routes')
const userRoutes = require('./app/routes/user_routes')
const profileRoutes = require('./app/routes/profile_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 4741
const clientDevPort = 7165

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

// instantiate express application object
const app = express()
// createServer is a node.js method that creates an http server which takes app (holds our req and res)
const server = http.createServer(app)
// connecting socket.io to HTTP, giving CORS permission, methods: any get or post request sent to our server from origin
// will be allowed (crud is just for socket server)
const io = socket(server, {
  cors: {
    origin: 'http://localhost:7165',
    methods: ['GET', 'POST']
  }
})

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))

// define port for API to run on
const port = process.env.PORT || serverDevPort

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(exampleRoutes)
app.use(userRoutes)
app.use(profileRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// Create an array to keep track of all conncected users
let connectedUsers = []

// socket.io middleware to check if the user has a profile
io.use((socket, next) => {
  let userId = socket.handshake.query['token']

  Profile.findOne({owner: userId})
    .then(profile => {
      if (profile) {
        socket.profile = profile
        return next()
      }

      return next(new Error('authentication error'))
    })
    .catch(console.error)
})

// Handle socket.io connections
io.on('connection', socket => {
  // destructuring profile from socket
  const { profile } = socket

  // Logging users that join
  console.log(`${profile.nickname} has joined`)

  // push the new user to the connected users array
  connectedUsers.push({ nickname: profile.nickname, avatar: profile.avatar, owner: profile.owner })

  // Update user list for every user connected
  io.emit('user update', connectedUsers)

  // The server is listening and waiting for a user to emit a message event.
  // .on sets up socket event listener
  socket.on('message', message => {
    // Every time the server receives a message from a connected user, it will
    // send (emit) that message back to all the connected users.
    // io.emit will show our messages to all users in our chat room.
    // io.emit will send an event 'newMessage' and will send data 'message'.
    // io.emit('newMessage', message)
    io.emit('newMessage', { message: message, sender: socket.profile.nickname, avatar: socket.profile.avatar, time: new Date() })
  })
  // .on sets up socket event listener
  // disconnect - anytime a user disconnects (handshake is lost), it will trigger event below
  socket.on('disconnect', () => {
    console.log('user disconnected')

    connectedUsers = connectedUsers.filter(user => {
      return user.owner !== profile.owner
    })

    io.emit('user update', connectedUsers)
  })
})

// run API on designated port (4741 in this case)
server.listen(port, () => {
  console.log('listening on port ' + port)
})

// needed for testing
module.exports = app
