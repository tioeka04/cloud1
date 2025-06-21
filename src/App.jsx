import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DB from './pages/DB'
import Storage from './pages/StorageShow'
import Chat from './pages/Chat'
import ChatSearch from './pages/ChatSearch'

function App() {
  return (
    <BrowserRouter>
      <div style={{marginBottom:20}}>
        <Link to="/">DB</Link> | <Link to="/storage">Storage</Link> | <Link to="/chat">Chat</Link> | <Link to="/chatsearch">Chat Search</Link>
      </div>

      <Routes>
        <Route path="/" element={<DB />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chatsearch" element={<ChatSearch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App