const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

const morganLogBody = (morgan.token('body', request => (JSON.stringify(request.body))))


app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {

  Person.find({})
    .then(persons => {
      const resp = `The phonebook has info for ${persons.length} people<br/> ${new Date()}`
      response.send(resp)
    })


})

app.put('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)
  const { name, number } = request.body

  Person.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response) => {
  const id = String(request.params.id)
  Person.findById(id)
    .then(updatedPerson => {
      if(updatedPerson){
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    }
    )
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)

  Person.findByIdAndDelete(id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))

  response.status(204).end()

})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if(persons.some(person => (person.name === body.name))){
  //     return response.status(403).json({
  //         error: "name already in the phonebook"
  //     })
  // }else{if(!(body.number && body.name)){
  //     return response.status(400).json({
  //         error: "name or number not specified"
  //     })
  // }}

  console.log(body)

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
  morganLogBody()
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})