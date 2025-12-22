import { useCallback, useEffect, useState, useRef,  } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberallowed, setNumberallowed] = useState(false)
  const [charallowed, setCharallowed] = useState(false)
  const [Password, setPassword] = useState('')

  const passwordRef = useRef(null)

  const PasswordGenerator = useCallback(() => {
    let pass = ''
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
     if (numberallowed) str += '0123456789'
    if (charallowed) str += '!@#$%^&*()_+~`|}{[]:;?><,./-='

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }

    setPassword(pass)


  }, [length, numberallowed, charallowed, setPassword])

  const copyPasswordtoClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(Password)
  }, [Password])

  useEffect(() => {
    PasswordGenerator()
  }, [length, numberallowed, charallowed], PasswordGenerator)
  return (

    <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-8 py-3 my-8 text-orange-500 bg-gray-800 '>
      <h1 className='text-white text-center my-3'>Password Generator</h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={Password}
          className="bg-white outline-none w-full py-1 px-3"
          placeholder="password"
          readOnly
          ref={passwordRef}
        />
        <button 
        onClick={copyPasswordtoClipboard}
        className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 cursor-pointer'>copy</button>

      </div>
      <div className='flex text-sm gap-x-2'>
        <div className='flex items-center gap-x-1'>
          <input 
          type="range"
          min={6}
          max={100}
          value={length}
          className='cursor-pointer'
          onChange={(event) => {
            setLength(event.target.value);
          }} 
          />
          <label>Length: {length}</label>
        </div>
        <div className='flex items-center gap-x-1'>
          <input 
          type="checkbox"
          defaultChecked={numberallowed}
          id='numberInput'
          onChange={() => {
            setNumberallowed((prev) => !prev);
          }} 
          />
          <label htmlFor="characterInput">Numbers</label>
          </div>
        <div className='flex items-center gap-x-1'>
          <input 
          type="checkbox"
          defaultChecked={charallowed}
          id='characterInput'
          onChange={() => {
            setCharallowed((prev) => !prev);
          }} 
          />
          <label htmlFor="characterInput">Characters</label>
        </div>
      </div>
    </div>

  )
}

export default App
