import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import './App.css'

function App() {
  
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
      socketRef.current = io('http://localhost:3000');
  
  // Test: connect hote hi turant create_room bhejo
      socketRef.current.emit('create_room', { username: 'Rahul' });
  
  // Response sunno
      socketRef.current.on('room_created', (data) => {
        console.log('Room created:', data);
      });
  
    return () => {
      socketRef.current?.disconnect();
    }
  }, [])

  return (
    <>

    </>
  )
}

export default App
