import { useState, useEffect } from 'react'
import phonebookServices from './services/phonebook'
import './index.css'

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Filter = ( {changeHandler} ) => {
  return(
  <div>
    Filter shown with <input onChange={changeHandler}/>
  </div>
  )
  }

const PersonForm = ( { submitHandler, nameChangeHandler, numberChangeHandler } ) => {
  return(
    <form onSubmit={submitHandler}>
        <div>
          name: <input onChange={nameChangeHandler}/>
        </div>
        <div>
          number: <input onChange={numberChangeHandler}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ( {personsToShow, deleteHandler} ) => {
  return(
    
    personsToShow.map(person => 
      <p key={person.name}>

      {person.name} {person.number}
      <button onClick={() => deleteHandler(person.id)}>Delete</button>

      </p>
    )

  )
}

const App = () => {

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')


  useEffect(() => {
    phonebookServices.getAll()
    .then(serverPersons => setPersons(serverPersons))
  })

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDeletion = (id) => {


    const person = persons.find(p => p.id === id)
    console.log(id)

    if(window.confirm(`Do you really want to delete ${person.name} from the phonebook?`)){

      phonebookServices.remove(id)
      .then(id => {
        const updatedPersons = persons.filter(p => p.id ==! id)
        setPersons(updatedPersons)
        setNotificationType('confirm')
        setNotificationMessage(
          `Person '${person.name}' was removed from the phonebook`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)

      })
      .catch(error => {
        {
          setNotificationType('error')
          setNotificationMessage(
            `'${person.name}' was already removed from server`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNotes(notes.filter(n => n.id !== id))
        }
        const updatedPersons = persons.filter(p => p.id ==! id)
        setPersons(updatedPersons)
      })
    }
  }

  const addName = (event) => {

    event.preventDefault()

    const newPerson = {name: newName, number: newNumber}

    if(persons.some(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook, do you want to update the number?`)){
        const id = persons.find(p => p.name === newName).id
        phonebookServices.update(id, newPerson)
        .then(returnedPerson => {
          const updatedPersons = persons.map(p => p.name === returnedPerson.name ? returnedPerson : p)
          setPersons(updatedPersons)
        })
        .catch(error => {
          setNotificationType('error')
          setNotificationMessage(
            `'${newPerson.name}' was removed from server`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
      }
    }
    else{
      phonebookServices.create(newPerson)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
        setNotificationType('confirm')
        setNotificationMessage(
          `Person '${newPerson.name}' was added to the phonebook`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
    }

  }

const handleFilterChange = (event) => {
  setNewFilter(event.target.value)
}

const personsToShow = persons.filter(person => person.name.toLowerCase().startsWith(newFilter))


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} className={notificationType} />
        <Filter changeHandler={handleFilterChange}/>
      <h3>Add New</h3>
        <PersonForm submitHandler={addName} nameChangeHandler={handleNameChange} numberChangeHandler={handleNumberChange}/>
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} deleteHandler={handleDeletion}/>
 
    </div>
  )
}

export default App