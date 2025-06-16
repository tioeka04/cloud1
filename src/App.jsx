import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DB from './pages/DB'
import Storage from './pages/Storage'
import Chat from './pages/Chat'

function App() {
  return (
    <BrowserRouter>
      <div style={{marginBottom:20}}>
        <Link to="/">DB</Link> | <Link to="/storage">Storage</Link> | <Link to="/chat">Chat</Link>
      </div>

      <Routes>
        <Route path="/" element={<DB />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App