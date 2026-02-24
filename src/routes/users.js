const express = require('express')
const User = require('./models/User')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-___v')
    res.json(users)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Ошибка при получении пользователей' })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-___v')
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    res.json(user)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный ID' })
    }
    res.status(500).json({ message: 'Ошибка при получении пользователей' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updateUser = User.findByIdAndUpdate(req.params.id, req.body, {
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
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: 'Ошибка при обновлении пользователя' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    res.json(user)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Некорректный формат ID' })
    }
    res.status(500).json({ message: 'Ошибка при удалении пользователя' })
  }
})


module.router = router