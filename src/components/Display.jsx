export default function Display({ value, error, flashKey }) {
  const isError = value === 'Error' || value === '∞' || value === '-∞'

  const fontSize =
    value.length > 16 ? 'text-base md:text-xl' :
    value.length > 12 ? 'text-lg md:text-2xl' :
    value.length > 8  ? 'text-xl md:text-3xl' :
    'text-2xl md:text-4xl'

  return (
    <div
      key={flashKey}
      className={`relative rounded-2xl px-4 py-3 mb-3 min-h-[80px] md:min-h-[110px]
        flex flex-col justify-end overflow-hidden cursor-text
        border-[3px] border-herb-jadeDark
        bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,224,184,0.15)_0%,transparent_50%),linear-gradient(135deg,#1f3a22_0%,#2d5a3d_50%,#3a5a3a_100%)]
        shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(122,184,122,0.15),0_3px_0_#2d5a3d,0_0_0_2px_rgba(212,175,55,0.25)]
        ${flashKey > 0 ? 'animate-display-flash' : ''}`}
    >
      <span className="absolute top-0 left-[8%] right-[8%] h-0.5
        bg-gradient-to-r from-transparent via-gold-light to-transparent blur-[0.5px]" />

      <span className="absolute top-1.5 left-2.5 text-xl md:text-2xl z-10 animate-frog-bop
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        🐸
      </span>

      <span className="absolute top-2.5 left-1/2 -translate-x-1/2 font-shippori text-[10px] tracking-[4px]
        text-chamomile opacity-75 [text-shadow:0_0_8px_rgba(212,175,55,0.5)]">
        *****
      </span>

      <span className="absolute bottom-1 right-3 text-chamomile text-[10px] tracking-[4px] opacity-65">
        · · ·
      </span>

      <div
        className={`${fontSize} font-bold text-right tracking-wide whitespace-nowrap overflow-hidden text-ellipsis
          ${isError
            ? 'text-red-300 [text-shadow:0_0_12px_rgba(255,100,100,0.6)]'
            : 'text-chamomile [text-shadow:0_0_12px_rgba(212,175,55,0.5),0_0_4px_rgba(240,216,156,0.8)]'
          }`}
      >
        {value}
      </div>

      <div className="text-red-300 text-[11px] text-right min-h-[1em] font-semibold tracking-wide">
        {error}
      </div>
    </div>
  )
}