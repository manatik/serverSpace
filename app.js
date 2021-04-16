const express = require('express');
const cors = require('cors');
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const authUsers = require('./routes/auth.routes')
const updateDataUsers = require('./routes/updateData.routes')
const lvlLesson = require('./routes/levels.Lessons')

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const PORT = process.env.PORT || config.get('port')

  async function start() {
  try {
    await mongoose.connect(config.get('mongoURL'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT)
    console.log("Сервер работает на", PORT || process.env.PORT)
  } catch (e) {
    console.log('Ошибки сервера', e.message)
    process.exit(1)
  }
}
start()
