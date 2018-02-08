const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('data', (req, res) => { 
  return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

const format = (person) => {
  const formattedPerson = { ...person._doc, id: person._id }
  delete formattedPerson._id
  delete formattedPerson.__v

  return formattedPerson
}

app.get('/', (request, response) => {
  response.send('<h1>Phonebook?!</h1>')
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(
        `<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>` 
      )
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(format))
    })
    .catch(error => {
      console.log(error)
      response.status(400).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'Name or number missing.'})
  }

  const person = new Person({
    name: body.name,
    number: body.number 
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      console.log(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person
    .findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})