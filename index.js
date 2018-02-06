const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('data', (req, res) => { 
  return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: 'Antti Alitalo',
    number: '050-1234567',
    id: 1
  },
  {
    name: 'Kalle Jokunen',
    number: '+358505185698',
    id: 2
  },
  {
    name: 'Saija Seilaaja',
    number: '0415698758',
    id: 3
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook?!</h1>')
})

app.get('/info', (req, res) => {
  const n = persons.length
  res.send(`
    <p>Puhelinluettelossa ${n} henkilön tiedot</p> 
    <p>${new Date()}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)

  Person
    .findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

const generateId = () => {
  const newID = Math.floor(Math.random()*100000)
  return newID
}

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
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})