const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length>5){
  console.log('too many arguments. give password, name and number.')
  process.exit(1)
} else if(process.argv.length===4){
  console.log('invalid number of arguments. give password, name and number.')
  process.exit(1)
} else if(process.argv.length===3){
  console.log('read mode')
  var readMode = 1
} else{
  console.log('add mode')
  var readMode = 0
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://nick:${password}@nickslearningsserver.naqeo9m.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=NicksLearningSserver`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(readMode){

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

} else{

  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then( () => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()})
}