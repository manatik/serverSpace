const User = require('../models/User')
let users = []

module.exports = async (io, socket) => {
  const getUsers = async () => {
    users = await User.find()
    await io.in(socket.roomId).emit('users', users)
  }

  const addUser = async ({ username }) => {
    await User.findOneAndUpdate({name: username}, {online: true})
    await getUsers()
  }

  const removeUser = async (userId) => {
    users[userId].online = false
    await getUsers()
  }

  socket.on('user:get', getUsers)
  socket.on('user:add', addUser)
  socket.on('user:leave', removeUser)
}
