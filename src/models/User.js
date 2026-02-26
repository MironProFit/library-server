const mongoose = require('mongoose')

const userShema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Имя обязательно'],
      minlength: [2, 'Имя не может быть короче 2 символов'],
      uppercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Фамилия обязательна'],
      minlength: [2, 'Фамилия не может быть короче 2 символов'],
      uppercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username обязательно'],
      minlength: [5, 'Username не может быть короче 3 символов'],
      unique: true,
    },
    borrowedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', userShema)
