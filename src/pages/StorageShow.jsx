import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://biciwtpjavbbeqbxcslx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY2l3dHBqYXZiYmVxYnhjc2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTk3MTcsImV4cCI6MjA2MDc3NTcxN30.sdXmQSf4y7ZgQLXNa6byNKzg9980LCpZYuJcCaUB7ic')

export default function Storage() {
  const [imageURL, setImageURL] = useState('')

  async function uploadFile(event) {
      const dataFile = event.target.files[0];

      const { data, error } = await supabase
        .storage
        .from('todos')
        .upload('public/'+dataFile.name, dataFile, {
          cacheControl: '3600',
          upsert: false
        })

      console.log(error)
  }

  async function showFile() {
    const { data } = supabase
                    .storage
                    .from('todos')
                    .getPublicUrl('public/supa.jpeg')

    setImageURL(data.publicUrl)
  }

  return (
    <>
      <input type="file" onChange={uploadFile} />

      <br /><br />
      <button onClick={showFile}>Show File</button>

      <img src={imageURL} />
    </>
  )
}
