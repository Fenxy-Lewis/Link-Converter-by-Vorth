import React, { useState, useEffect, useRef } from 'react'
import {
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Sun,
  Moon,
  Globe
} from 'lucide-react'

// --- TRANSLATIONS ---
const dict = {
  en: {
    title: "Google URL Cleaner",
    desc: "Transform lengthy, cluttered Google Drive or Share links into neat, readable URLs instantly.",
    inputLabel: "Target URL or ID",
    inputPlaceholder: "Enter your messy link here...",
    btnOptimize: "Optimize Link",
    divider: "Output",
    outputPlaceholder: "Your generated link...",
    btnCopy: "Copy Optimized Link",
    copied: "Copied to clipboard!",
    promoTitle: "Join our Developer Discord",
    promoBtn: "Join Server"
  },
  km: {
    title: "កម្មវិធីបំប្លែងតំណភ្ជាប់ Google",
    desc: "បំប្លែងតំណភ្ជាប់ Google Drive ឬ Share ដែលវែង ឱ្យទៅជាទម្រង់ខ្លីនិងងាយស្រួលមើល។",
    inputLabel: "តំណភ្ជាប់ ឬ ID ដើម",
    inputPlaceholder: "បញ្ចូលតំណភ្ជាប់នៅទីនេះ...",
    btnOptimize: "បំប្លែងតំណភ្ជាប់",
    divider: "លទ្ធផល",
    outputPlaceholder: "តំណភ្ជាប់ថ្មីរបស់អ្នក...",
    btnCopy: "ចម្លងតំណភ្ជាប់",
    copied: "បានចម្លងដោយជោគជ័យ!",
    promoTitle: "ចូលរួមសហគមន៍ Discord របស់យើង",
    promoBtn: "ចូលរួមឥឡូវនេះ"
  }
}

function extractGoogleId(raw) {
  const text = (raw || '').trim()
  if (!text) return null

  try {
    const url = new URL(text)

    const driveMatch = url.pathname.match(/\/d\/([A-Za-z0-9_-]+)/)
    if (driveMatch) return driveMatch[1]

    const params = url.searchParams
    if (params.has('id')) return params.get('id')
    if (params.has('q')) return params.get('q')

    const fileMatch = url.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/)
    if (fileMatch) return fileMatch[1]
    const folderMatch = url.pathname.match(/\/folders\/([A-Za-z0-9_-]+)/)
    if (folderMatch) return folderMatch[1]

    const openMatch = url.pathname.match(/\/open/)
    if (openMatch && params.has('id')) return params.get('id')
    
  } catch {
    if (/^[A-Za-z0-9_-]{10,}$/.test(text)) return text
  }

  const idFallback = text.match(/[A-Za-z0-9_-]{15,}/)
  if (idFallback) return idFallback[0]

  return null
}

// Convert hex to rgb helper
function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [lang, setLang] = useState('en')
  
  const [inputUrl, setInputUrl] = useState('')
  const [outputUrl, setOutputUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const canvasRef = useRef(null)
  const t = dict[lang]

  // Dedicated Constellation / Particle Network Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const colors = [
      '#10b981', // Vibrant Emerald Green
      '#22c55e', // Green accent
      '#ef4444', // Bright Coral Red
      '#f43f5e', // Rose / Red accent
      '#f59e0b', // Warm Golden Amber
      '#fbbf24', // Amber accent
      '#06b6d4', // Soft Cyan
      '#14b8a6'  // Teal accent
    ]

    const colorRgbMap = colors.map(hexToRgb)

    // Calculate sparse particle count based on screen area
    const particleCount = Math.max(35, Math.min(65, Math.floor((width * height) / 32000)))
    const maxDistance = 140
    const mouse = { x: -1000, y: -1000, radius: 160 }

    // Initialize particles
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35, // ultra-slow peaceful speed
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 0.7 + 1.4, // 1.4px - 2.1px pinpoint size
        color: colors[colorIndex],
        rgb: colorRgbMap[colorIndex],
        originalRadius: Math.random() * 0.7 + 1.4
      })
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    const render = () => {
      // Clear canvas with base background color
      const bgColor = isDarkMode ? '#0f172a' : '#f8fafc'
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy

        // Wrap around borders gently
        if (p.x < 0) p.x = width
        else if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        else if (p.y > height) p.y = 0

        // Subtle gentle mouse reaction
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const distToMouse = Math.sqrt(dx * dx + dy * dy)
        if (distToMouse < mouse.radius && distToMouse > 0) {
          const force = (mouse.radius - distToMouse) / mouse.radius
          p.x += (dx / distToMouse) * force * 0.6
          p.y += (dy / distToMouse) * force * 0.6
        }
      }

      // Draw delicate constellation lines with gradient blending
      ctx.lineWidth = 0.8
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDarkMode ? 0.22 : 0.18)
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            gradient.addColorStop(0, `rgba(${p1.rgb.r}, ${p1.rgb.g}, ${p1.rgb.b}, ${alpha})`)
            gradient.addColorStop(1, `rgba(${p2.rgb.r}, ${p2.rgb.g}, ${p2.rgb.b}, ${alpha})`)

            ctx.strokeStyle = gradient
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }

        // Draw connections to mouse if nearby
        const dmx = p1.x - mouse.x
        const dmy = p1.y - mouse.y
        const distM = Math.sqrt(dmx * dmx + dmy * dmy)
        if (distM < mouse.radius) {
          const alphaM = (1 - distM / mouse.radius) * 0.25
          ctx.strokeStyle = isDarkMode 
            ? `rgba(${p1.rgb.r}, ${p1.rgb.g}, ${p1.rgb.b}, ${alphaM})`
            : `rgba(100, 116, 139, ${alphaM})`
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      // Draw pinpoint nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDarkMode])

  // Handlers
  const handleOptimize = () => {
    setError('')
    setOutputUrl('')
    setCopied(false)

    if (!inputUrl.trim()) {
      setError(lang === 'en' ? 'Please enter a URL or ID.' : 'សូមបញ្ចូលតំណភ្ជាប់ ឬ ID។')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const id = extractGoogleId(inputUrl)
      if (id) {
        setOutputUrl(`https://google.com/share.google?q=${id}`)
      } else {
        setError(lang === 'en' ? 'Could not extract a valid ID. Check your link.' : 'មិនអាចទាញយក ID បានទេ។ សូមពិនិត្យតំណភ្ជាប់របស់អ្នកម្តងទៀត។')
      }
      setIsProcessing(false)
    }, 400)
  }

  const handleCopy = async () => {
    if (!outputUrl) return
    try {
      await navigator.clipboard.writeText(outputUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = outputUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Adaptive Styling
  const cardBg = isDarkMode ? 'bg-slate-900/75' : 'bg-white/75'
  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900'
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const inputBg = isDarkMode ? 'bg-slate-800/80' : 'bg-white/80'
  const inputBorder = isDarkMode ? 'border-slate-700' : 'border-slate-300'
  const btnBg = 'bg-blue-600 hover:bg-blue-700 text-white' 
  const dividerBorder = isDarkMode ? 'border-slate-700' : 'border-slate-300'
  const promoBg = isDarkMode ? 'bg-slate-800/90' : 'bg-slate-100/90'
  const headerBtnStyle = `flex items-center gap-2 px-3 py-1.5 border rounded-sm transition-colors text-sm font-semibold shadow-sm ${
    isDarkMode 
      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
  }`

  return (
    <div 
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden ${textColor} ${
        lang === 'km' ? "font-['Kantumruy_Pro',sans-serif]" : "font-sans"
      }`}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap');
        `}
      </style>

      {/* Full-screen Constellation Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
      />

      {/* ── Content wrapper ── */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-stretch">
        
        {/* Top Controls (Theme & Lang) */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'km' : 'en')}
            className={headerBtnStyle}
          >
            <Globe size={16} />
            EN / ខ្មែរ
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={headerBtnStyle}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* ── Main Glass Card ── */}
        <div className={`${cardBg} backdrop-blur-md rounded-sm p-8 shadow-2xl border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-blue-600 shadow-md">
              <span className="text-lg font-bold text-white tracking-tight">FX</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">FenxyLink</h1>
              <p className={`text-xs font-bold ${textMuted} uppercase`}>Developer Tools</p>
            </div>
          </div>

          <div className={`h-px w-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'} mb-6`} />

          {/* ── Title Section ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={18} className="text-blue-500" />
              <h2 className="text-lg font-bold">{t.title}</h2>
            </div>
            <p className={`text-sm ${textMuted} leading-relaxed`}>
              {t.desc}
            </p>
          </div>

          {/* ── Input Section ── */}
          <div className="space-y-3 mb-6">
            <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider`}>
              {t.inputLabel}
            </label>

            <div className={`flex items-center gap-2 rounded-sm border ${inputBorder} ${inputBg} px-4 py-3 focus-within:border-blue-500 transition-colors`}>
              <ExternalLink size={16} className={textMuted} />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleOptimize()}
                placeholder={t.inputPlaceholder}
                className="w-full bg-transparent text-sm placeholder-slate-400 outline-none"
              />
              {inputUrl && (
                <button
                  onClick={() => {
                    setInputUrl('')
                    setOutputUrl('')
                    setError('')
                  }}
                  className={`${textMuted} hover:text-red-500 transition-colors shrink-0`}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold pl-1">
                {error}
              </p>
            )}

            <button
              onClick={handleOptimize}
              disabled={isProcessing}
              className={`group flex w-full items-center justify-center gap-2 rounded-sm ${btnBg} px-5 py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <Zap size={16} />
                  {t.btnOptimize}
                </>
              )}
            </button>
          </div>

          {/* ── Divider: Output ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-px flex-1 border-t border-dashed ${dividerBorder}`} />
            <span className={`text-[11px] font-bold ${textMuted} uppercase tracking-widest`}>
              {t.divider}
            </span>
            <div className={`h-px flex-1 border-t border-dashed ${dividerBorder}`} />
          </div>

          {/* ── Output Section ── */}
          <div className="space-y-3 mb-8">
            <div className={`flex items-center gap-2 rounded-sm border ${inputBorder} ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} px-4 py-3`}>
              <Copy size={16} className={textMuted} />
              <input
                type="text"
                readOnly
                value={outputUrl}
                placeholder={t.outputPlaceholder}
                className={`w-full bg-transparent text-sm placeholder-slate-400 outline-none cursor-default ${!outputUrl && 'opacity-60'}`}
              />
            </div>

            <button
              onClick={handleCopy}
              disabled={!outputUrl}
              className={`flex w-full items-center justify-center gap-2 rounded-sm px-5 py-3.5 text-sm font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
                copied
                  ? 'bg-green-600 text-white'
                  : `border ${inputBorder} ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy size={16} />
                  {t.btnCopy}
                </>
              )}
            </button>
          </div>

          {/* ── Footer Promo Card ── */}
          <div className={`rounded-sm ${promoBg} p-5 flex items-center justify-between gap-4 border ${inputBorder}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-indigo-600/20">
                <MessageCircle size={18} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-bold">{t.promoTitle}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]">
              {t.promoBtn}
              <ArrowRight size={12} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}
