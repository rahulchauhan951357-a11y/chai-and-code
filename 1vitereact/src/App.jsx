
import React, { Children, useState } from 'react'

const App = () => {

  const [counter, setCounter] = useState(15)

  //let counter = 15

  const addValue = () => {
    setCounter(prev => Math.min(prev + 1, 20));
    //counter = counter + 1
    // setCounter(prevCounter => prevCounter + 1)

    // setCounter(prevCounter => prevCounter + 1)
    // setCounter(prevCounter => prevCounter + 1)
    // setCounter(prevCounter => prevCounter + 1)

  }

  const removeValue = () => {
    setCounter(prev => Math.max(prev - 1, 0));
  }

  return (
    <div>
      <h1>Chai aur react</h1>
      <h2>Counter value: {counter}</h2>

      <button
        onClick={addValue}
      >Add value {counter}</button>
      <br />
      <button
        onClick={removeValue}
      >remove value {counter}</button>
      <p>footer: {counter}</p>
      <div> <a href="https://google.com" target="_blank">
        Click me to visit Google
      </a>
      </div>
    </div>
  )
}



export default App
