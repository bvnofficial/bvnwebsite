"use client"

import { useEffect, useRef, useState } from "react"

interface Vector2D {
  x: number
  y: number
}

interface Color {
  r: number
  g: number
  b: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.5
  maxForce = 0.12
  isKilled = false

  startColor: Color = { r: 0, g: 0, b: 0 }
  targetColor: Color = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const proximityMult =
      distance < this.closeEnoughTarget ? distance / this.closeEnoughTarget : 1

    const mag = Math.sqrt(dx * dx + dy * dy)
    const toX = mag > 0 ? (dx / mag) * this.maxSpeed * proximityMult : 0
    const toY = mag > 0 ? (dy / mag) * this.maxSpeed * proximityMult : 0

    const sx = toX - this.vel.x
    const sy = toY - this.vel.y
    const sMag = Math.sqrt(sx * sx + sy * sy)

    if (sMag > 0) {
      this.acc.x += (sx / sMag) * this.maxForce
      this.acc.y += (sy / sMag) * this.maxForce
    }

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0)
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)

    const c = {
      r: Math.round(
        this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight
      ),
      g: Math.round(
        this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight
      ),
      b: Math.round(
        this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight
      ),
    }

    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const cx = width / 2
      const cy = height / 2
      const mag = (width + height) / 2
      const rx = Math.random() * width - cx
      const ry = Math.random() * height - cy
      const m = Math.sqrt(rx * rx + ry * ry)
      this.target.x = cx + (m > 0 ? (rx / m) * mag : 0)
      this.target.y = cy + (m > 0 ? (ry / m) * mag : 0)

      this.startColor = {
        r:
          this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g:
          this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b:
          this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

// BVN brand color palette — cycles through each word
const BRAND_COLORS: Color[] = [
  { r: 232, g: 96, b: 16 },   // BVN Orange     → BVN
  { r: 255, g: 255, b: 255 }, // White           → MARKETING
  { r: 245, g: 166, b: 35 },  // Orange Light    → OPERATIONS
  { r: 180, g: 210, b: 255 }, // Ice Blue        → AUTOMATION
  { r: 232, g: 96, b: 16 },   // BVN Orange      → GROW
]

export const BVN_WORDS = ["BVN", "MARKETING", "OPERATIONS", "AUTOMATION", "GROW"]

interface ParticleTextEffectProps {
  words?: string[]
  onEnter?: () => void
}

export function ParticleTextEffect({
  words = BVN_WORDS,
  onEnter,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef(0)
  const wordIdxRef = useRef(0)
  const colorIdxRef = useRef(0)
  const wordsRef = useRef(words)
  wordsRef.current = words

  const [showHint, setShowHint] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Canvas sizing ────────────────────────────────────────────
    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    // ── Render a word into particles ─────────────────────────────
    function spawnWord(word: string) {
      if (!canvas) return

      const offscreen = document.createElement("canvas")
      offscreen.width = canvas.width
      offscreen.height = canvas.height
      const octx = offscreen.getContext("2d")!

      // Scale font size to word length + canvas width, capped sensibly
      const fontSize = Math.min(
        canvas.width / (word.length * 0.52),
        canvas.height * 0.38,
        200
      )

      octx.fillStyle = "white"
      octx.font = `900 ${Math.max(48, fontSize)}px 'Arial Black', Arial`
      octx.textAlign = "center"
      octx.textBaseline = "middle"
      octx.fillText(word, canvas.width / 2, canvas.height / 2)

      const imgData = octx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imgData.data

      // Step scales with screen width so particle count stays consistent
      const step = Math.max(5, Math.floor(canvas.width / 160))

      const newColor = BRAND_COLORS[colorIdxRef.current % BRAND_COLORS.length]
      colorIdxRef.current++

      const particles = particlesRef.current
      let pIdx = 0

      // Collect lit pixels
      const coords: number[] = []
      for (let i = 0; i < pixels.length; i += step * 4) coords.push(i)

      // Shuffle for fluid swarm appearance
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[coords[i], coords[j]] = [coords[j], coords[i]]
      }

      for (const ci of coords) {
        if (pixels[ci + 3] > 0) {
          const x = (ci / 4) % canvas.width
          const y = Math.floor(ci / 4 / canvas.width)

          let p: Particle

          if (pIdx < particles.length) {
            p = particles[pIdx]
            p.isKilled = false
            pIdx++
          } else {
            p = new Particle()
            const cx = canvas.width / 2
            const cy = canvas.height / 2
            const mag = (canvas.width + canvas.height) / 2
            const rx = Math.random() * canvas.width - cx
            const ry = Math.random() * canvas.height - cy
            const m = Math.sqrt(rx * rx + ry * ry)
            p.pos.x = cx + (m > 0 ? (rx / m) * mag : 0)
            p.pos.y = cy + (m > 0 ? (ry / m) * mag : 0)
            p.maxSpeed = Math.random() * 5 + 3
            p.maxForce = p.maxSpeed * 0.05
            p.colorBlendRate = Math.random() * 0.02 + 0.005
            particles.push(p)
          }

          p.startColor = {
            r:
              p.startColor.r +
              (p.targetColor.r - p.startColor.r) * p.colorWeight,
            g:
              p.startColor.g +
              (p.targetColor.g - p.startColor.g) * p.colorWeight,
            b:
              p.startColor.b +
              (p.targetColor.b - p.startColor.b) * p.colorWeight,
          }
          p.targetColor = newColor
          p.colorWeight = 0
          p.target.x = x
          p.target.y = y
        }
      }

      // Kill leftover particles from previous word
      for (let i = pIdx; i < particles.length; i++)
        particles[i].kill(canvas.width, canvas.height)
    }

    // ── Animation loop ───────────────────────────────────────────
    function animate() {
      if (!canvas) return
      const ctx = canvas.getContext("2d")!
      const particles = particlesRef.current

      // Motion-blur trail
      ctx.fillStyle = "rgba(0,0,0,0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.move()
        p.draw(ctx)

        if (
          p.isKilled &&
          (p.pos.x < 0 ||
            p.pos.x > canvas.width ||
            p.pos.y < 0 ||
            p.pos.y > canvas.height)
        ) {
          particles.splice(i, 1)
        }
      }

      // Advance word every ~220 frames (~3.6 s at 60 fps)
      frameRef.current++
      if (frameRef.current % 220 === 0) {
        wordIdxRef.current =
          (wordIdxRef.current + 1) % wordsRef.current.length
        spawnWord(wordsRef.current[wordIdxRef.current])

        // Show "click to enter" after the second word appears
        if (wordIdxRef.current >= 1) setShowHint(true)
      }

      animRef.current = requestAnimationFrame(animate)
    }

    spawnWord(wordsRef.current[0])
    animate()

    const handleResize = () => {
      setSize()
      spawnWord(wordsRef.current[wordIdxRef.current])
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleClick = () => {
    setVisible(false)
    // Give the fade-out time before calling onEnter
    setTimeout(() => onEnter?.(), 600)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black cursor-pointer select-none
        transition-opacity duration-700 ease-in-out
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle top label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="text-white/25 text-xs tracking-[0.45em] uppercase font-medium">
          BVN Official
        </span>
      </div>

      {/* "Click to enter" — fades in after second word */}
      <div
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10
          transition-opacity duration-1000 ${showHint ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-white/40 text-xs tracking-[0.4em] uppercase animate-pulse">
          Click anywhere to enter
        </p>
      </div>
    </div>
  )
}
