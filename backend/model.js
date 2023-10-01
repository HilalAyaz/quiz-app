const mongoose = require('mongoose')

// Define the QuizQuestion schema
const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (options) {
        // Validate that there are at least 2 options
        return options.length >= 2
      },
      message: 'There must be at least 2 options.'
    }
  },
  answer: {
    type: String,
    required: true,
    validate: {
      validator: function (answer) {
        // Validate that the answer is one of the options
        return this.options.includes(answer)
      },
      message: 'The answer must be one of the provided options.'
    }
  }
})

// Create a QuizQuestion model using the schema
const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema)

module.exports = QuizQuestion
