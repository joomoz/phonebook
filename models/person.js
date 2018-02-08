const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new Schema({
  name: {type: String, unique: true},
  number: String
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person