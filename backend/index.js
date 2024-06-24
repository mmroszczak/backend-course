const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const morganLogBody = (morgan.token('body', request => (JSON.stringify(request.body))))


app.get('/api/persons', (request, response) => {
    Person.find({})
    .then(persons => {
        response.json(persons)
    })
    morganLogBody()
})

app.get('/info', (request, response) => {
    const resp = `The phonebook has info for ${persons.length} people<br/> ${new Date()}`
    response.send(resp)
    morganLogBody()

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
    morganLogBody()

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => (Number(person.id) !== id))
    console.log(persons)
    response.status(204).end()
    morganLogBody()

})

app.post('/api/persons', (request, response) => {
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
    morganLogBody()
})


const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })