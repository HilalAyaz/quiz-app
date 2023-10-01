const mongoose = require('mongoose')
require('dotenv').config()

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Database Connected'))
  .catch(err => console.error(err))
