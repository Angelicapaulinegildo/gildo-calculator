export default function Instructions({ mode }) {
  return (
    <div className="w-full bg-gradient-to-br from-herb-paper to-herb-paperDark
      border-2 border-herb-jadeDark rounded-2xl px-5 py-4
      shadow-[0_6px_18px_rgba(42,63,31,0.2),0_0_0_3px_rgba(212,175,55,0.25)]">

      {mode === 'basic' ? <BasicGuide /> : <SciGuide />}
    </div>
  )
}

function BasicGuide() {
  return (
    <>
      <h2 className="font-shippori text-base font-bold text-herb-jadeDark mb-2 tracking-wider flex items-center gap-2">
        <span className="text-gold text-sm">❋</span>
        How to Use - BASIC
      </h2>
      <ul className="space-y-1 mb-4">
        <Bullet>Click numbers <b>0–9</b> to enter values.</Bullet>
        <Bullet>Click an operator <b>+ − × ÷</b> to compute.</Bullet>
        <Bullet>Click <b>=</b> to see the result. Or press <b>Enter</b>.</Bullet>
        <Bullet>Click <b>⌫</b> to delete the last digit. Or press <b>Backspace</b>.</Bullet>
        <Bullet>Click <b>AC</b> to clear everything. Or press <b>Esc</b>.</Bullet>
        <Bullet>Use <b>( )</b> to group expressions.</Bullet>
        <Bullet><b>Live preview:</b> sagot agad habang nagta-type!</Bullet>
      </ul>

      <h2 className="font-shippori text-base font-bold text-herb-jadeDark mb-2 tracking-wider flex items-center gap-2">
        <span className="text-gold text-sm">❋</span>
        Supported Operations
      </h2>
      <ul className="space-y-1 mb-4">
        <Bullet>Addition (+), Subtraction (−)</Bullet>
        <Bullet>Multiplication (×), Division (÷)</Bullet>
        <Bullet>Decimals (.), Parentheses ( )</Bullet>
      </ul>

      <ErrorNote>
        🧪 <b>Error Handling:</b> Dividing by zero shows a clear message.
      </ErrorNote>
    </>
  )
}

function SciGuide() {
  return (
    <>
      <h2 className="font-shippori text-base font-bold text-herb-jadeDark mb-2 tracking-wider flex items-center gap-2">
        <span className="text-gold text-sm">❋</span>
        How to Use - SCI
      </h2>
      <ul className="space-y-1 mb-4">
        <Bullet>Type a number, <b>then</b> click a function.</Bullet>
        <Bullet>Powers: <b>2</b> <Tag>xʸ</Tag> <b>10</b> <b>=</b> → 1024</Bullet>
        <Bullet>Factorial: <b>5</b> <Tag>x!</Tag> <b>=</b> → 120</Bullet>
        <Bullet>Reciprocal: <b>4</b> <Tag>1/x</Tag> <b>=</b> → 0.25</Bullet>
        <Bullet>Toggle <Tag>DEG</Tag>/<Tag>RAD</Tag> for trig.</Bullet>
        <Bullet>Use <b>( )</b> to group and nest expressions.</Bullet>
      </ul>

      <h2 className="font-shippori text-base font-bold text-herb-jadeDark mb-2 tracking-wider flex items-center gap-2">
        <span className="text-gold text-sm">❋</span>
        Scientific Functions
      </h2>
      <ul className="space-y-1 mb-4">
        <Bullet><Tag>sin</Tag><Tag>cos</Tag><Tag>tan</Tag> Trigonometry</Bullet>
        <Bullet><Tag>ln</Tag> Natural log (base e)</Bullet>
        <Bullet><Tag>log</Tag> Log base 10</Bullet>
        <Bullet><Tag>√</Tag> Square root</Bullet>
        <Bullet><Tag>x²</Tag> Square, <Tag>xʸ</Tag> Power, <Tag>x!</Tag> Factorial</Bullet>
        <Bullet><Tag>π</Tag> Pi ≈ 3.14159…</Bullet>
        <Bullet><Tag>e</Tag> Euler's number ≈ 2.718…</Bullet>
        <Bullet><Tag>1/x</Tag> Reciprocal, <Tag>±</Tag> Toggle sign</Bullet>
      </ul>

      <ErrorNote>
        🧪 <b>Error Handling:</b> Invalid inputs show <i>"Error"</i>.
      </ErrorNote>
    </>
  )
}

function Bullet({ children }) {
  return (
    <li className="text-sm text-herb-inkSoft font-medium pl-5 relative leading-relaxed
      before:content-['🌿'] before:absolute before:left-0 before:text-[11px]">
      {children}
    </li>
  )
}

function Tag({ children }) {
  return (
    <span className="inline-block bg-herb-sage/35 border border-herb-moss/40 rounded-full px-2.5 py-px
      font-klee font-semibold text-herb-jadeDark text-xs mr-1">
      {children}
    </span>
  )
}

function ErrorNote({ children }) {
  return (
    <div className="bg-spice-cinnamon/10 border border-spice-cinnamonDark/35 rounded-2xl px-3.5 py-2.5
      text-xs text-spice-cinnamonDark leading-relaxed">
      {children}
    </div>
  )
}