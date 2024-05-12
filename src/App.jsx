import { useState, useEffect } from 'react'
import './App.css'

import axios from 'axios';

function App() {
  const [food, setFood] = useState([])

  useEffect(() => {
    async function fetchData() {
      const result = await axios('http://localhost:3000/api/v1/food');
      setFood(result.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <ul>
        {
          food.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))
        }
      </ul>
    </>
  )
}

export default App
