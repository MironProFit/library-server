const mongoose = require('mongoose')


const bookShema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Заголовок обязателен'],
      minlength: [2, 'Заголовок не может быть короче 3 символов'],
      uppercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Автор обязателен'],
      minlength: [2, 'Автор не может быть короче 3 символов'],
      uppercase: true,
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Год обязателен'],
      min: [1000, 'Год не может быть меньше 1000'],
      max: [new Date().getFullYear() + 1, 'Год не может быть больше текущего'],
    },
    description: {
      type: String,
      default: 'Описание отсутствует',
    }
  },
  { timestamps: true },
)

module.exports = mongoose.model('Book', bookShema)
