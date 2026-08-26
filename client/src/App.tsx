import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import './App.css'

function App() {
  
  const socketref = useRef<Socket | null>(null);
  useEffect(() => {
    socketref.current = io('http://localhost:3000');
    return () => {
      socketref.current?.disconnect();
    }
  }, [])

  return (
    <>

    </>
  )
}

export default App
