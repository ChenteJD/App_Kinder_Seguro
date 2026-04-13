import { useState } from 'react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: '¡Hola! ¿En qué puedo ayudarte hoy?', isBot: true }]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, isBot: false }]);
    const currentInput = input;
    setInput('');
    
    // Simulate auto-reply
    setTimeout(() => {
      let reply = 'Recibido. Si necesitas asistencia urgente, envíanos un WhatsApp.';
      if (currentInput.toLowerCase().includes('hola')) reply = '¡Hola! Qué gusto saludarte.';
      if (currentInput.toLowerCase().includes('error')) reply = 'Lo revisaré de inmediato. ¿Podrías ser más específico?';
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      {open ? (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, width: 320, height: 400,
          background: 'var(--bg-card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000, border: '1px solid var(--border)'
        }}>
          <div style={{ background: 'var(--primary)', color: 'var(--text)', padding: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🤖 Soporte Kinddo</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.isBot ? 'flex-start' : 'flex-end', background: m.isBot ? 'white' : 'var(--primary-light)', padding: '8px 12px', borderRadius: 12, fontSize: 13, maxWidth: '80%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', padding: 8, borderTop: '1px solid var(--border)', background: 'white' }}>
            <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontSize: 13 }} placeholder="Escribe un mensaje..." />
            <button type="submit" style={{ background: 'var(--primary)', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>Enviar</button>
          </form>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} style={{
          position: 'fixed', bottom: 24, right: 24, width: 60, height: 60,
          background: 'var(--primary)', borderRadius: '50%', border: 'none',
          boxShadow: 'var(--shadow-lg)', cursor: 'pointer', fontSize: 24, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)'
        }}>
          💬
        </button>
      )}
    </>
  );
}
