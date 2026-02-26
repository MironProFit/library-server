const express = require('express')
const router = express.Router()
const path = require('path')
const Book = require(path.join(__dirname, '..', 'models', 'Book'))

// 1. GET /api/books - Получить все книги
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().select('-__v')
    res.json(books)
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при получении списка книг',
      error: error.message,
    })
  }
})

// 2. GET /api/books/:id - Получить книгу по ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select('-__v')
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' })
    }
    res.json(book)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный формат ID' })
    }
    res
      .status(500)
      .json({ message: 'Ошибка получения книги', error: error.message })
  }
})

// 3. POST /api/books - СОЗДАТЬ новую книгу
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body)
    await book.save()
    res.status(201).json(book)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res
        .status(400)
        .json({ message: 'Ошибка валидации', errors: messages })
    }
    res
      .status(500)
      .json({ message: 'Ошибка при создании книги', error: error.message })
  }
})

// 4. PUT /api/books/:id - Обновить книгу
router.put('/:id', async (req, res) => {
  try {
    const bookUpdate = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      select: '-__v',
    })

    if (!bookUpdate) {
      return res.status(404).json({ message: 'Книга не найдена' })
    }
    res.json(bookUpdate)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный формат ID' })
    }
    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .json({ message: 'Ошибка валидации', error: error.message })
    }
    res
      .status(500)
      .json({ message: 'Ошибка при обновлении книги', error: error.message })
  }
})

// 5. DELETE /api/books/:id - Удалить книгу (Добавил для полного CRUD)
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' })
    }
    res.json({ message: 'Книга успешно удалена', id: book._id })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный формат ID' })
    }
    res
      .status(500)
      .json({ message: 'Ошибка при удалении книги', error: error.message })
  }
})

module.exports = router
