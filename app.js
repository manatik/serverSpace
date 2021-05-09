const express = require('express');
const cors = require('cors');
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const authUsers = require('./routes/auth.routes')
const updateDataUsers = require('./routes/updateData.routes')
const lvlLesson = require('./routes/levels.Lessons')

const PORT = process.env.PORT || config.get('port')

const app = express();
const server = app.listen(PORT)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const registerMessageHandlers = require('./handlers/messageHandlers')
const registerUserHandlers = require('./handlers/userHandlers')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/auth', authUsers)
app.use('/api/profile', updateDataUsers)
app.use('/api', lvlLesson)
app.options(cors());

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

async function start() {
  try {
    await mongoose.connect(config.get('mongoURL'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("Сервер работает на", PORT || process.env.PORT)
  } catch (e) {
    console.log('Ошибки сервера', e.message)
    process.exit(1)
  }
}

start().then()

const onConnection = (socket) => {
  console.log('User connected')

  const { roomId } = socket.handshake.query
  socket.roomId = roomId

  socket.join(roomId)

  registerMessageHandlers(io, socket)
  registerUserHandlers(io, socket)

  socket.on('disconnect', () => {
    console.log('User disconnected')
    socket.leave(roomId)
  })
}

io.on('connection', onConnection)
