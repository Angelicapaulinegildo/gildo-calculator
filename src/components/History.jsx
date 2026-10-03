import { useState } from 'react'

export default function History({ history, onClear, onLoad }) {
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className="w-full bg-gradient-to-br from-herb-paper to-herb-paperDark
        border-2 border-herb-jadeDark rounded-2xl overflow-hidden
        shadow-[0_6px_18px_rgba(42,63,31,0.2),0_0_0_3px_rgba(212,175,55,0.25)]">

        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex justify-between items-center px-4 py-3 cursor-pointer select-none
            bg-herb-moss/10 hover:bg-herb-moss/15 transition-colors"
        >
          <div className="font-shippori text-sm font-bold text-herb-jadeDark tracking-widest flex items-center gap-2">
            📜 History
            <span className="bg-gold text-spice-cinnamonDark text-xs font-bold px-2.5 py-0.5 rounded-full
              shadow-[0_0_0_1.5px_#8b6f1a]">
              {history.length}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="text-herb-mossDark text-xs font-bold cursor-pointer px-2.5 py-0.5 rounded-full
                hover:bg-herb-moss/20 transition-colors"
            >
              Clear
            </button>
            <span className={`text-herb-inkSoft text-sm transition-transform duration-300
              ${collapsed ? '-rotate-90' : ''}`}>
              ▼
            </span>
          </div>
        </div>

        <div className={`transition-all duration-300
          ${collapsed ? 'h-0 opacity-0' : 'h-52 opacity-100'}`}>
          <div className="h-full overflow-y-auto px-4 pb-2 pt-1.5">
            {history.length === 0 ? (
              <div className="text-center text-herb-inkSoft text-sm py-2 italic opacity-70">
                No History 🌿
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onLoad(item.result)}
                  title="Click to use this result again"
                  className="flex justify-between items-center px-3 py-1.5 rounded-full cursor-pointer
                    border-b border-dashed border-herb-moss/20 last:border-b-0
                    hover:bg-herb-sage/30 hover:translate-x-1 transition-all gap-2"
                >
                  <span className="text-xs text-herb-inkSoft font-medium truncate">
                    {item.expr}
                  </span>
                  <span className="text-base text-herb-jadeDark font-bold font-shippori flex-shrink-0">
                    <span className="text-gold font-bold mr-1">=</span>
                    {item.result}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {history.length > 0 && !collapsed && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full text-xs font-bold text-herb-mossDark py-2 cursor-pointer
              border-t-2 border-dashed border-herb-moss/30
              hover:bg-herb-sage/25 transition-colors"
          >
            ⤢ View Full History ({history.length})
          </button>
        )}
      </div>

      {expanded && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="bg-gradient-to-br from-herb-paper to-herb-paperDark
              border-[3px] border-herb-jadeDark rounded-3xl w-full max-w-2xl
              max-h-[85vh] flex flex-col overflow-hidden
              shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_4px_rgba(212,175,55,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4
              bg-herb-moss/10 border-b-2 border-herb-jadeDark/30">
              <div className="font-shippori text-lg font-bold text-herb-jadeDark tracking-widest flex items-center gap-2">
                📜 Full History
                <span className="bg-gold text-spice-cinnamonDark text-sm font-bold px-3 py-0.5 rounded-full
                  shadow-[0_0_0_1.5px_#8b6f1a]">
                  {history.length}
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-herb-jadeDark text-2xl font-bold cursor-pointer
                  w-9 h-9 flex items-center justify-center rounded-full
                  hover:bg-herb-moss/20 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => { onLoad(item.result); setExpanded(false) }}
                  className="flex justify-between items-center px-4 py-3 rounded-2xl cursor-pointer
                    border-b border-dashed border-herb-moss/25 last:border-b-0
                    hover:bg-herb-sage/30 transition-all gap-3"
                >
                  <span className="text-sm text-herb-inkSoft font-medium">
                    {item.expr}
                  </span>
                  <span className="text-xl text-herb-jadeDark font-bold font-shippori flex-shrink-0">
                    <span className="text-gold font-bold mr-2">=</span>
                    {item.result}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-herb-moss/10 border-t-2 border-dashed border-herb-moss/30
              flex justify-between items-center">
              <span className="text-xs text-herb-inkSoft italic">
                Click any item to load the result 🌿
              </span>
              <button
                onClick={() => { onClear(); setExpanded(false) }}
                className="text-xs font-bold text-spice-cinnamonDark px-3 py-1 rounded-full
                  bg-spice-cinnamon/15 hover:bg-spice-cinnamon/25 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}