const express = require('express');
const bodyParser = require('body-parser');
const { validationResult, body } = require('express-validator');
const cors = require('cors'); 
const QuizQuestion = require('./model');

const app = express();
const port = process.env.PORT || 3000;

require('./db')

app.use(cors());

app.use(bodyParser.json())


// Fetch data from the database
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await QuizQuestion.find(); 
    res.json(questions); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Validation middleware
const validateQuestion = [
  body('question').trim().notEmpty().withMessage('Question cannot be empty'),
  body('options')
    .isArray({ min: 4 })
    .withMessage('There must be at least 4 options')
    .custom(options => options.every(opt => typeof opt === 'string'))
    .withMessage('Options must be an array of strings'),
  body('answer')
    .isString()
    .custom((answer, { req }) => {
      const options = req.body.options
      return options.includes(answer)
    })
    .withMessage('Answer must be one of the provided options')
]

// POST route for creating questions
app.post('/api/questions', validateQuestion, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { question, options, answer } = req.body
    const newQuestion = new QuizQuestion({ question, options, answer })
    const savedQuestion = await newQuestion.save()
    res
      .status(201)
      .json({
        message: 'Question created successfully',
        question: savedQuestion
      })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'An error occurred while creating the question' })
  }
})

//delete a quiz question by ID
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id
    const deletedQuestion = await QuizQuestion.findByIdAndDelete(questionId)
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' })
    }
    res.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Listen to port
app.listen(port, () => {
  console.log(`Express is listening on port ${port}!`)
})
