import { useState } from 'react'
import Calculator from './components/Calculator'
import Instructions from './components/Instructions'
import History from './components/History'

export default function App() {
  const [mode, setMode] = useState('basic')
  const [history, setHistory] = useState([])
  const [loadSignal, setLoadSignal] = useState({ value: null, id: 0 })

  const addHistory = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 50))
  }

  const clearHistory = () => setHistory([])

  const handleHistoryLoad = (result) => {
    setLoadSignal({ value: result, id: Date.now() })
  }

  return (
    <div className="min-h-screen bg-herb-bg overflow-x-hidden flex flex-col items-center justify-center p-4 gap-4 relative">

      <div className="fixed top-[5%] left-[8%] text-3xl opacity-25 animate-float-herb pointer-events-none z-0">🌿</div>
      <div className="fixed top-[15%] right-[10%] text-4xl opacity-20 animate-float-herb pointer-events-none z-0" style={{ animationDelay: '1s' }}>🍃</div>
      <div className="fixed bottom-[10%] left-[12%] text-4xl opacity-25 animate-float-herb pointer-events-none z-0" style={{ animationDelay: '2s' }}>🌱</div>
      <div className="fixed bottom-[15%] right-[8%] text-3xl opacity-20 animate-float-herb pointer-events-none z-0" style={{ animationDelay: '3s' }}>🍃</div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-4 items-stretch lg:items-start lg:justify-center">

        <div className="order-2 lg:order-1 w-full lg:w-[380px] lg:flex-shrink-0 flex flex-col gap-4">
          <History
            history={history}
            onClear={clearHistory}
            onLoad={handleHistoryLoad}
          />
          <Instructions mode={mode} />
        </div>

        <div className="order-1 lg:order-2 w-full lg:flex-1 flex justify-center lg:justify-start">
          <Calculator
            mode={mode}
            setMode={setMode}
            onAddHistory={addHistory}
            loadSignal={loadSignal}
          />
        </div>

      </div>

      <footer className="text-center text-xs text-herb-inkSoft relative z-10 pb-2">
        🌿 DCIT 26 · Application Development & Emerging Technologies
      </footer>

    </div>
  )
}