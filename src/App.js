import React from 'react'
import './variables.css'
import './App.css'
import Select from './components/Select'

function App() {
  return (
    <div className="App">
      <div className="select-box">
        <Select values={['Uganda', 'Canada', 'Greece', 'USA', 'England', 'Germany']} />
        <br/>
        <Select values={['Uganda2', 'Canada2', 'Greece2', 'USA2', 'England2', 'Germany2']} />
      </div>
    </div>
  )
}

export default App
