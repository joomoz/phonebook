const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  // const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
  // return maxId + 1
  const newID = Math.floor(Math.random()*100000)
  return newID
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})