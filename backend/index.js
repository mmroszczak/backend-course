const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const morganLogBody = (morgan.token('body', request => (JSON.stringify(request.body))))


app.get('/api/persons', (request, response) => {
    response.json(persons)
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

    if(persons.some(person => (person.name === body.name))){
        return response.status(403).json({
            error: "name already in the phonebook"
        })
    }else{if(!(body.number && body.name)){
        return response.status(400).json({
            error: "name or number not specified"
        })
    }}

    const id = Math.floor(Math.random() * 10000000)
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    console.log(person)
    persons = persons.concat(person)
    console.log(persons)
    response.json(person)
    morganLogBody()
})


const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })