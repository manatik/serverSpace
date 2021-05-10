const User = require('../models/User')
let users = []

module.exports = (io, socket) => {
  const getUsers = async () => {
    users = await User.find()
    io.in(socket.roomId).emit('users', users)
  }

  const addUser = async ({ username }) => {
    await User.findOneAndUpdate({name: username}, {online: true})
    await getUsers()
  }

  const removeUser = async (username) => {
    await User.findOneAndUpdate({name: username}, {online: false})
    await getUsers()
  }

  socket.on('user:get', getUsers)
  socket.on('user:add', addUser)
  socket.on('user:leave', removeUser)
}
