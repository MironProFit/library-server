require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const userRoutes = require('./routes/users')
const bookRoutes = require('./routes/books')

const app = express()
const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

if (!MONGODB_URL) {
  console.error('MONGODB_URL не найден')
  process.exit(1)
}

app.use(cors())
app.use(express.json())

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('✅ MongoDB подключена успешно! База: library_db')
  })
  .catch((e) => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message)
    process.exit(1)
  })

app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'Сервер библиотеки работает!',
    endpoints: {
      users: 'http://127.0.0.1:3005/api/users',
      books: 'http://127.0.0.1:3005/api/books',
    },
  })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' })
})

app.use((err, req, res, next) => {
  console.error('Внутренняя ошибка:', err.stack)
  res
    .status(500)
    .json({ message: 'Внутренняя ошибка сервера', error: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://127.0.0.1:${PORT}`)
})
