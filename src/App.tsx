import { useEffect } from 'react'
import PostFormatter from './components/PostFormatter'
import ConsentBanner, { initializeConsent } from './components/ConsentBanner'
import './App.css'

function App() {
  useEffect(() => {
    // Apply stored consent preference on mount
    initializeConsent();
  }, []);

  return (
    <div className="app">
      <PostFormatter />
      <ConsentBanner />
    </div>
  )
}

export default App
