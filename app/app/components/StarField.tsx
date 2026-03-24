'use client'
import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    let mouse = { x: W / 2, y: H / 2 }

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.85
        ? `rgba(20,241,149,`   // solana green
        : Math.random() > 0.7
          ? `rgba(153,69,255,` // solana purple
          : `rgba(255,255,255,` // white
    }))

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)

    let raf: number
    function draw() {
      ctx.clearRect(0, 0, W, H)

      stars.forEach(s => {
        // Drift toward mouse very slightly
        const dx = mouse.x - s.x, dy = mouse.y - s.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) {
          s.vx += dx / dist * 0.012
          s.vy += dy / dist * 0.012
        }
        // Dampen
        s.vx *= 0.98; s.vy *= 0.98
        s.x += s.vx; s.y += s.vy
        // Wrap
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0

        // Draw
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color + s.opacity + ')'
        ctx.fill()
      })

      // Draw connecting lines near mouse
      stars.forEach(s => {
        const dx = mouse.x - s.x, dy = mouse.y - s.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(153,69,255,${0.15 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
