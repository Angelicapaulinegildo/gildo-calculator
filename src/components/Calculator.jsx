import { useState, useEffect, useCallback } from 'react'
import Display from './Display'
import Button from './Button'

const OPERATORS = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? null : a / b),
}

function buildScope(isDeg) {
  return {
    sin: (x) => (isDeg ? Math.sin((x * Math.PI) / 180) : Math.sin(x)),
    cos: (x) => (isDeg ? Math.cos((x * Math.PI) / 180) : Math.cos(x)),
    tan: (x) => (isDeg ? Math.tan((x * Math.PI) / 180) : Math.tan(x)),
    ln: Math.log,
    log: Math.log10,
    sqrt: Math.sqrt,
    pi: Math.PI,
    e: Math.E,
    factorial: (n) => {
      if (n < 0 || !Number.isInteger(n)) return NaN
      let r = 1
      for (let i = 2; i <= n; i++) r *= i
      return r
    },
  }
}

function evaluateExpression(expr, isDeg) {
  const jsExpr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/x²/g, '**2')
    .replace(/xʸ/g, '**')
    .replace(/(\d+|\))!/g, 'factorial($1)')

  try {
    const scope = buildScope(isDeg)
    const keys = Object.keys(scope)
    const values = Object.values(scope)
    const fn = new Function(...keys, `"use strict"; return (${jsExpr});`)
    const result = fn(...values)

    if (typeof result !== 'number' || Number.isNaN(result)) return null
    if (!isFinite(result)) return result > 0 ? '∞' : '-∞'
    return parseFloat(result.toPrecision(12)).toString()
  } catch {
    return null
  }
}

export default function Calculator({ mode, setMode, onAddHistory, loadSignal }) {
  const [expression, setExpression] = useState('0')
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [isDeg, setIsDeg] = useState(true)
  const [justEvaluated, setJustEvaluated] = useState(false)
  const [flashKey, setFlashKey] = useState(0)

  useEffect(() => {
    if (loadSignal && loadSignal.id !== 0) {
      setExpression(loadSignal.value)
      setJustEvaluated(false)
      setError('')
    }
  }, [loadSignal?.id])

  useEffect(() => {
    const expr = expression
    const hasOperator = /[+\-×÷^]/.test(expr.replace(/^-/, ''))
    if (
      hasOperator &&
      expr !== 'Error' &&
      expr !== '∞' &&
      expr !== '-∞' &&
      !expr.endsWith('+') &&
      !expr.endsWith('−') &&
      !expr.endsWith('×') &&
      !expr.endsWith('÷') &&
      !expr.endsWith('^')
    ) {
      const result = evaluateExpression(expr, isDeg)
      if (result && result !== expr) {
        setPreview(result)
        return
      }
    }
    setPreview('')
  }, [expression, isDeg])

  const inputDigit = useCallback(
    (digit) => {
      setError('')
      if (justEvaluated || ['Error', '∞', '-∞'].includes(expression)) {
        setExpression(digit)
        setJustEvaluated(false)
      } else if (expression === '0') {
        setExpression(digit)
      } else {
        setExpression(expression + digit)
      }
    },
    [expression, justEvaluated]
  )

  const inputDot = useCallback(() => {
    setError('')
    if (justEvaluated || ['Error', '∞', '-∞'].includes(expression)) {
      setExpression('0.')
      setJustEvaluated(false)
    } else {
      const parts = expression.split(/[+\-×÷^()]/)
      const lastPart = parts[parts.length - 1]
      if (!lastPart.includes('.')) setExpression(expression + '.')
    }
  }, [expression, justEvaluated])

  const inputOperator = useCallback(
    (op) => {
      if (justEvaluated) setJustEvaluated(false)
      if (['Error', '∞', '-∞'].includes(expression)) return

      const lastChar = expression.slice(-1)
      if (/[+\-×÷^]/.test(lastChar)) {
        setExpression(expression.slice(0, -1) + op)
      } else if (lastChar === '(') {
        if (op === '−') setExpression(expression + op)
      } else if (/[\d)πe!]/.test(lastChar)) {
        setExpression(expression + op)
      }
    },
    [expression, justEvaluated]
  )

  const inputFunction = useCallback(
    (fnName) => {
      let expr = expression
      if (justEvaluated) {
        expr = ''
        setJustEvaluated(false)
      }
      if (['Error', '∞', '-∞'].includes(expr)) expr = ''
      if (expr === '0') expr = ''

      const funcMap = {
        sin: 'sin(', cos: 'cos(', tan: 'tan(',
        ln: 'ln(', log: 'log(', sqrt: '√(',
        pi: 'π', e: 'e', pow: '^', fact: '!',
        inv: '1/(', sqr: '^2',
      }

      const insert = funcMap[fnName] || ''
      if ((fnName === 'pi' || fnName === 'e') && /[\d)πe!]/.test(expr.slice(-1))) {
        setExpression(expr + '×' + insert)
      } else {
        setExpression(expr + insert)
      }
    },
    [expression, justEvaluated]
  )

  const handleClear = useCallback(() => {
    setExpression('0')
    setJustEvaluated(false)
    setError('')
  }, [])

  const handleDelete = useCallback(() => {
    if (justEvaluated || ['Error', '∞', '-∞'].includes(expression)) {
      setExpression('0')
      setJustEvaluated(false)
    } else if (expression.length <= 1) {
      setExpression('0')
    } else {
      const next = expression.slice(0, -1)
      setExpression(next === '' ? '0' : next)
    }
  }, [expression, justEvaluated])

  const handleEquals = useCallback(() => {
    if (expression === 'Error') return

    if (/÷0(?!\d)|÷0\.0*$/.test(expression)) {
      setError('Cannot divide by zero')
      setExpression('Error')
      setJustEvaluated(true)
      return
    }

    const exprBefore = expression
    const result = evaluateExpression(expression, isDeg)

    if (result === null) {
      setError('Invalid expression')
      setExpression('Error')
      setJustEvaluated(true)
      return
    }
    if (result === '∞' || result === '-∞') {
      setError('Value too large')
      setExpression(result)
      setJustEvaluated(true)
      return
    }

    if (onAddHistory) onAddHistory({ expr: exprBefore, result })
    setFlashKey((k) => k + 1)
    setExpression(result)
    setJustEvaluated(true)
  }, [expression, isDeg, onAddHistory])

  const toggleSign = useCallback(() => {
    if (justEvaluated) {
      setExpression(expression.startsWith('-') ? expression.slice(1) : '-' + expression)
      setJustEvaluated(false)
    } else {
      const match = expression.match(/(\d+\.?\d*)$/)
      if (match) {
        const num = match[0]
        const before = expression.slice(0, -num.length)
        if (before.endsWith('-') || before.endsWith('−')) {
          setExpression(before.slice(0, -1) + num)
        } else {
          setExpression(before + '(-' + num + ')')
        }
      }
    }
  }, [expression, justEvaluated])

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key
      if (key >= '0' && key <= '9') inputDigit(key)
      else if (key === '.') inputDot()
      else if (key === '+') inputOperator('+')
      else if (key === '-') inputOperator('−')
      else if (key === '*') inputOperator('×')
      else if (key === '/') inputOperator('÷')
      else if (key === '^') inputOperator('^')
      else if (key === 'Enter' || key === '=') handleEquals()
      else if (key === 'Backspace') handleDelete()
      else if (key === 'Escape') handleClear()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inputDigit, inputDot, inputOperator, handleEquals, handleDelete, handleClear])

  const openParen = () => {
    if (expression === '0') setExpression('(')
    else if (/[\d)πe!]/.test(expression.slice(-1))) setExpression(expression + '×(')
    else setExpression(expression + '(')
  }

  const closeParen = () => {
    const open = (expression.match(/\(/g) || []).length
    const close = (expression.match(/\)/g) || []).length
    if (open > close && /[\d)πe!]/.test(expression.slice(-1))) {
      setExpression(expression + ')')
    }
  }

  return (
    <div className={`w-full transition-all duration-300
      ${mode === 'basic' ? 'max-w-md' : 'max-w-3xl'}
      bg-gradient-to-br from-herb-paper via-[#f5efd8] to-herb-paperDark
      border-[3px] border-herb-jadeDark rounded-3xl p-4 md:p-5
      shadow-[0_10px_28px_rgba(42,63,31,0.3),0_0_0_4px_rgba(212,175,55,0.3),inset_0_0_40px_rgba(122,143,106,0.08)]`}>

      <div className="text-center mb-3">
        <div className="font-shippori text-base md:text-xl font-bold text-herb-jadeDark tracking-wider
          flex items-center justify-center gap-1.5
          [text-shadow:1px_1px_0_rgba(212,175,55,0.4)]">
          <span className="text-sm md:text-lg animate-leaf-sway inline-block">🌿</span>
           Calculator
          <span className="text-sm md:text-lg animate-leaf-sway inline-block">🌿</span>
        </div>
        <div className="font-klee text-xs md:text-sm text-herb-inkSoft font-semibold tracking-widest mt-0.5">
          ......
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 mb-3 p-1 rounded-full
        bg-herb-moss/10 border-2 border-herb-jadeDark">
        <button
          onClick={() => setMode('basic')}
          className={`py-2 rounded-full font-klee font-semibold text-xs tracking-widest cursor-pointer transition-all
            ${mode === 'basic'
              ? 'bg-gradient-to-br from-chamomile to-gold text-spice-cinnamonDark -translate-y-0.5 shadow-[0_2px_0_#2d5a3d]'
              : 'bg-transparent text-herb-inkSoft hover:bg-herb-sage/40'
            }`}
        >
          🌱 BASIC
        </button>
        <button
          onClick={() => setMode('sci')}
          className={`py-2 rounded-full font-klee font-semibold text-xs tracking-widest cursor-pointer transition-all
            ${mode === 'sci'
              ? 'bg-gradient-to-br from-chamomile to-gold text-spice-cinnamonDark -translate-y-0.5 shadow-[0_2px_0_#2d5a3d]'
              : 'bg-transparent text-herb-inkSoft hover:bg-herb-sage/40'
            }`}
        >
          🧪 SCI
        </button>
      </div>

      <Display value={expression} error={error} flashKey={flashKey} />

      {preview && (
        <div className="text-right text-sm md:text-base font-semibold text-bottle-glassLight
          -mt-1 mb-2 px-4 opacity-90">
          ❋ {preview}
        </div>
      )}

      {mode === 'basic' && (
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          <Button label="AC" onClick={handleClear} variant="clear" />
          <Button label="⌫" onClick={handleDelete} variant="clear" />
          <Button label="(" onClick={openParen} variant="func" />
          <Button label=")" onClick={closeParen} variant="func" />

          <Button label="7" onClick={() => inputDigit('7')} />
          <Button label="8" onClick={() => inputDigit('8')} />
          <Button label="9" onClick={() => inputDigit('9')} />
          <Button label="÷" onClick={() => inputOperator('÷')} variant="op" />

          <Button label="4" onClick={() => inputDigit('4')} />
          <Button label="5" onClick={() => inputDigit('5')} />
          <Button label="6" onClick={() => inputDigit('6')} />
          <Button label="×" onClick={() => inputOperator('×')} variant="op" />

          <Button label="1" onClick={() => inputDigit('1')} />
          <Button label="2" onClick={() => inputDigit('2')} />
          <Button label="3" onClick={() => inputDigit('3')} />
          <Button label="−" onClick={() => inputOperator('−')} variant="op" />

          <Button label="0" onClick={() => inputDigit('0')} />
          <Button label="." onClick={inputDot} />
          <Button label="+" onClick={() => inputOperator('+')} variant="op" />
          <Button label="=" onClick={handleEquals} variant="equal" />
        </div>
      )}

      {mode === 'sci' && (
        <div className="grid grid-cols-8 gap-1.5 md:gap-2">
          <Button label="sin" onClick={() => inputFunction('sin')} variant="sci" />
          <Button label="cos" onClick={() => inputFunction('cos')} variant="sci" />
          <Button label="tan" onClick={() => inputFunction('tan')} variant="sci" />
          <Button label={isDeg ? 'DEG' : 'RAD'} onClick={() => setIsDeg(!isDeg)} variant="sci" />
          <Button label="AC" onClick={handleClear} variant="clear" />
          <Button label="⌫" onClick={handleDelete} variant="clear" />
          <Button label="(" onClick={openParen} variant="func" />
          <Button label=")" onClick={closeParen} variant="func" />

          <Button label="ln" onClick={() => inputFunction('ln')} variant="sci" />
          <Button label="log" onClick={() => inputFunction('log')} variant="sci" />
          <Button label="√" onClick={() => inputFunction('sqrt')} variant="sci" />
          <Button label="x²" onClick={() => inputFunction('sqr')} variant="sci" />
          <Button label="7" onClick={() => inputDigit('7')} />
          <Button label="8" onClick={() => inputDigit('8')} />
          <Button label="9" onClick={() => inputDigit('9')} />
          <Button label="÷" onClick={() => inputOperator('÷')} variant="op" />

          <Button label="π" onClick={() => inputFunction('pi')} variant="sci" />
          <Button label="e" onClick={() => inputFunction('e')} variant="sci" />
          <Button label="xʸ" onClick={() => inputFunction('pow')} variant="sci" />
          <Button label="x!" onClick={() => inputFunction('fact')} variant="sci" />
          <Button label="4" onClick={() => inputDigit('4')} />
          <Button label="5" onClick={() => inputDigit('5')} />
          <Button label="6" onClick={() => inputDigit('6')} />
          <Button label="×" onClick={() => inputOperator('×')} variant="op" />

          <Button label="(" onClick={openParen} variant="sci" />
          <Button label=")" onClick={closeParen} variant="sci" />
          <Button label="1/x" onClick={() => inputFunction('inv')} variant="sci" />
          <Button label="±" onClick={toggleSign} variant="sci" />
          <Button label="1" onClick={() => inputDigit('1')} />
          <Button label="2" onClick={() => inputDigit('2')} />
          <Button label="3" onClick={() => inputDigit('3')} />
          <Button label="−" onClick={() => inputOperator('−')} variant="op" />

          <div className="invisible aspect-square" />
          <div className="invisible aspect-square" />
          <div className="invisible aspect-square" />
          <div className="invisible aspect-square" />
          <Button label="0" onClick={() => inputDigit('0')} />
          <Button label="." onClick={inputDot} />
          <Button label="+" onClick={() => inputOperator('+')} variant="op" />
          <Button label="=" onClick={handleEquals} variant="equal" />
        </div>
      )}
    </div>
  )
}