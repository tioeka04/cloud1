import { useState,useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://biciwtpjavbbeqbxcslx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY2l3dHBqYXZiYmVxYnhjc2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTk3MTcsImV4cCI6MjA2MDc3NTcxN30.sdXmQSf4y7ZgQLXNa6byNKzg9980LCpZYuJcCaUB7ic')

export default function DB() {
  const [dataAPI, setDataAPI] = useState([])

  //dataAPI : state name
  //setDataAPI : how to fill data into dataAPI

  // useEffect(() => {
  //   API()
  // }, []);

  async function API() {
    const { data, error } = await supabase
          .from('cloud_todos')
          .select('id,task')
    setDataAPI(data)
  }

  function APIManual() {
    fetch("https://biciwtpjavbbeqbxcslx.supabase.co/rest/v1/todos", {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY2l3dHBqYXZiYmVxYnhjc2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTk3MTcsImV4cCI6MjA2MDc3NTcxN30.sdXmQSf4y7ZgQLXNa6byNKzg9980LCpZYuJcCaUB7ic',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY2l3dHBqYXZiYmVxYnhjc2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTk3MTcsImV4cCI6MjA2MDc3NTcxN30.sdXmQSf4y7ZgQLXNa6byNKzg9980LCpZYuJcCaUB7ic',
      }
    })
    .then(response => {
      return response.json();
    })
    .then(data => setDataAPI(data))
    .catch(error => console.error(error));
  }

  return (
    <>
      <button onClick={API}>Get API Data</button>
      
      <ul>
      {dataAPI.map((item, index) => 
        <li key={index}>{item.task}</li>
      )}
      </ul>
    </>
  )
}
