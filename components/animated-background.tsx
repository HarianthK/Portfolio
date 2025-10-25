"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsVisible(true)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      hue: number
      opacity: number
      pulsePhase: number
    }> = []

    const particleCount = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 10000))
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4.5,
        vy: (Math.random() - 0.5) * 4.5,
        radius: Math.random() * 3 + 1,
        hue: Math.random() * 60 + 280,
        opacity: Math.random() * 0.8 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    let mouseX = 0
    let mouseY = 0
    let mouseInfluence = 0
    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      mouseInfluence = 1
    }

    const handleMouseLeave = () => {
      mouseInfluence = 0
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    function animate() {
      if (!ctx || !canvas) return
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      mouseInfluence *= 0.97

      particles.forEach((particle, i) => {
        if (mouseInfluence > 0.01) {
          const dx = mouseX - particle.x
          const dy = mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 300) {
            const force = (300 - distance) / 300
            particle.vx += (dx / distance) * 0.08 * mouseInfluence * force
            particle.vy += (dy / distance) * 0.08 * mouseInfluence * force
          }
        }

        particle.x += particle.vx * 3.5
        particle.y += particle.vy * 3.5

        particle.vx *= 0.99
        particle.vy *= 0.99

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        particle.pulsePhase += 0.12
        const pulseSize = 1 + Math.sin(particle.pulsePhase) * 0.5

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * pulseSize, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4,
        )
        gradient.addColorStop(0, `hsla(${particle.hue}, 85%, 70%, ${particle.opacity * 0.6})`)
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 80%, 60%, ${particle.opacity * 0.3})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 60%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fill()

        particles.forEach((otherParticle, j) => {
          if (i === j) return
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            
            const opacity = 0.2 * (1 - distance / 200) * particle.opacity
            const lineHue = (particle.hue + otherParticle.hue) / 2
            
            ctx.strokeStyle = `hsla(${lineHue}, 80%, 60%, ${opacity})`
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
      particles.length = 0
      const newParticleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 10000))
      for (let i = 0; i < newParticleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.5) * 4.5,
          radius: Math.random() * 3 + 1,
          hue: Math.random() * 60 + 280,
          opacity: Math.random() * 0.8 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${
        isVisible ? "opacity-40" : "opacity-0"
      }`}
      style={{ 
        background: "radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)"
      }}
    />
  )
}
