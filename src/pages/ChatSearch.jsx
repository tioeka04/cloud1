import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";

// Supabase client
const supabaseUrl = 'https://sncqxgnabsfpciexwpqy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY3F4Z25hYnNmcGNpZXh3cHF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODIyODU3NSwiZXhwIjoyMDYzODA0NTc1fQ.oqbgymA2HWssacX_WfO-Y7054aMKtnT3SfOiyvKUxhE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Booking code generator
function generateBookingNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BOOK-${dateStr}-${random}`;
}

export default function ChatFutsal() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from("futsal_chat")
      .select("*")
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function handleSend(text) {
    const userMessage = { message: text, direction: "outgoing" };
    setMessages(prev => [...prev, userMessage]);
    await supabase.from("futsal_chat").insert(userMessage);
    setIsTyping(true);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
        messages: [{ role: "user", content: text }]
      })
    });

    const result = await response.json();
    const replyText = await processBotResponse(result.choices[0].message.content, text);

    const botMessage = { message: replyText, direction: "incoming" };
    setMessages(prev => [...prev, botMessage]);
    await supabase.from("futsal_chat").insert(botMessage);
    setIsTyping(false);
  }

  async function processBotResponse(responseText, originalText) {
    const lower = originalText.toLowerCase();

    const kodeMatch = originalText.match(/BOOK-\d{8}-\d{4}/i);
    const nameMatch = originalText.match(/nama\s+([a-zA-Z]+)/i);
    const dateMatch = originalText.match(/tanggal\s+(\d{4}-\d{2}-\d{2})/i);
    const timeMatch = originalText.match(/jam\s+(\d{2}:\d{2})/i);
    const lapanganMatch = originalText.match(/lapangan\s+([a-zA-Z0-9]+)/i);
    const keteranganMatch = originalText.match(/keterangan[:\s]+(.+)/i);

    // 1. Cek booking by kode
    if (lower.includes("cek") && lower.includes("booking") && kodeMatch) {
      const { data } = await supabase
        .from("futsal_booking")
        .select("*")
        .eq("booking_number", kodeMatch[0]);

      if (!data || data.length === 0) return "Booking tidak ditemukan.";
      const b = data[0];
      return `📋 Booking Ditemukan:\nNama: ${b.name}\nTanggal: ${b.date} jam ${b.time}\nLapangan: ${b.lapangan}\nCatatan: ${b.keterangan || "-"}\nKode: ${b.booking_number}`;
    }

    // 2. Lihat semua jadwal
    if (lower.includes("jadwal")) {
      const { data } = await supabase
        .from("futsal_booking")
        .select("*")
        .order("date", { ascending: true });
      return data.length > 0
        ? data.map(b =>
            `Nomor: ${b.booking_number}\n${b.name} - ${b.date} jam ${b.time} (${b.lapangan})\nCatatan: ${b.keterangan || '-'}`).join("\n\n")
        : "Belum ada jadwal booking.";
    }

    // 3. Booking baru
    if (lower.includes("booking")) {
      if (nameMatch && dateMatch && timeMatch && lapanganMatch) {
        const bookingNumber = kodeMatch ? kodeMatch[0] : generateBookingNumber();
        const keterangan = keteranganMatch ? keteranganMatch[1] : null;

        // Cek tumpang tindih
        const { data: existing } = await supabase
          .from("futsal_booking")
          .select("*")
          .eq("date", dateMatch[1])
          .eq("time", timeMatch[1])
          .eq("lapangan", lapanganMatch[1]);

        if (existing && existing.length > 0) {
          return `❌ Lapangan ${lapanganMatch[1]} sudah dibooking pada ${dateMatch[1]} jam ${timeMatch[1]}.`;
        }

        const { error } = await supabase.from("futsal_booking").insert({
          name: nameMatch[1],
          date: dateMatch[1],
          time: timeMatch[1],
          lapangan: lapanganMatch[1],
          booking_number: bookingNumber,
          keterangan
        });

        if (error) {
          console.error("Insert Error:", error.message);
          return "⚠️ Gagal menyimpan booking. Pastikan semua data valid.";
        }

        return `✅ Booking berhasil!\nNama: ${nameMatch[1]}\nTanggal: ${dateMatch[1]} jam ${timeMatch[1]}\nLapangan: ${lapanganMatch[1]}\nKode Booking: ${bookingNumber}`;
      } else {
        return "⚠️ Format booking tidak lengkap. Tulis: nama, tanggal, jam, lapangan, dan (opsional) keterangan.";
      }
    }

    // 4. Balasan dari LLM biasa
    return responseText;
  }

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={isTyping ? <TypingIndicator content="Mengetik..." /> : null}>
            {messages.map((msg, i) => (
              <Message key={i} model={msg} />
            ))}
          </MessageList>
          <MessageInput placeholder="Ketik pesan..." attachButton={false} onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
