import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://biciwtpjavbbeqbxcslx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY2l3dHBqYXZiYmVxYnhjc2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTk3MTcsImV4cCI6MjA2MDc3NTcxN30.sdXmQSf4y7ZgQLXNa6byNKzg9980LCpZYuJcCaUB7ic')

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";


export default function Chat() {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false);

  function handleSend(text) {

    //display question
    const questionMessage = {
      message: text,
      direction: "outgoing",
    }
    setMessages(prev => [...prev, questionMessage]);


    //display answer
    setIsTyping(true)
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
            role: "user",
            content: text
          }]
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {

      //display answer from LLM
      const replyMessage = {
        //based on response data structure
        message: data.choices[0].message.content,
        direction: "incoming",
      }
      setMessages(prev => [...prev, replyMessage]);
      setIsTyping(false);
      
    })
  }

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isTyping ? <TypingIndicator content="Waiting for reply..." /> : null
            }
          >
            {messages.map((msg, index) => (
              <Message key={index} model={msg} />
            ))}
          </MessageList>

          <MessageInput 
            placeholder="Type message here" 
            attachButton={false} 
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}
