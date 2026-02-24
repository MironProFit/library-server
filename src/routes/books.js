const express = require('express')
const Book = require('./src/models/Book')

router.get('/', async (req, res) => {
  try {
    const books = Book.find().select('-__v')
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка книг' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const book = Book.findById(req.params.id).select('-__v')
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' })
    }
    res.json(book)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный формат ID' })
    }
    res.status(500).json({ message: 'Ошибка получения книги' })
  }
})

roter.put('/:id', async (req, res) => {
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
      return res.status(404).json({ message: error.message })
    }
  }
})

module.router = router