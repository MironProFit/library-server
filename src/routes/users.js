const express = require('express')
const path = require('path')
const User = require(path.join(__dirname, '..', 'models', 'User'))

const router = express.Router()

// 1. GET /api/users - Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    // Исправлено: __v (два подчеркивания)
    const users = await User.find().select('-__v')
    res.json(users)
  } catch (error) {
    return res
      .status(500)
      .json({
        message: 'Ошибка при получении пользователей',
        error: error.message,
      })
  }
})

// 2. GET /api/users/:id - Получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v')
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    res.json(user)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный ID' })
    }
    res
      .status(500)
      .json({
        message: 'Ошибка при получении пользователя',
        error: error.message,
      })
  }
})

// 3. POST /api/users - СОЗДАТЬ пользователя (ЭТОГО НЕ ХВАТАЛО!)
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save() // Сохраняем в базу
    res.status(201).json(user) // 201 - Created
  } catch (error) {
    // Обработка ошибок валидации (например, короткое имя)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res
        .status(400)
        .json({ message: 'Ошибка валидации', errors: messages })
    }
    // Обработка дубликатов (email или username уже есть)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: 'Пользователь с таким email или username уже существует',
        })
    }
    res
      .status(500)
      .json({
        message: 'Ошибка при создании пользователя',
        error: error.message,
      })
  }
})

// 4. PUT /api/users/:id - Обновить пользователя
router.put('/:id', async (req, res) => {
  try {
    // Добавлено await! И исправлен select
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      select: '-__v',
    })

    if (!updateUser) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    res.json(updateUser)
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
      .json({
        message: 'Ошибка при обновлении пользователя',
        error: error.message,
      })
  }
})

// 5. DELETE /api/users/:id - Удалить пользователя

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    res.json({ message: 'Пользователь удален', id: user._id })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный формат ID' })
    }
    res
      .status(500)
      .json({
        message: 'Ошибка при удалении пользователя',
        error: error.message,
      })
  }
})

module.exports = router
