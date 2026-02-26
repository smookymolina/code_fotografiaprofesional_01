import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    // Only on hover-capable devices
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`
      }
    }

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onHoverIn = () => {
      dotRef.current?.classList.add('scale-150')
      ringRef.current?.classList.add('scale-150', 'border-gold')
    }
    const onHoverOut = () => {
      dotRef.current?.classList.remove('scale-150')
      ringRef.current?.classList.remove('scale-150', 'border-gold')
    }

    document.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(animate)

    const interactives = document.querySelectorAll('a, button, [role="button"], .gallery-item')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onHoverIn)
      el.addEventListener('mouseleave', onHoverOut)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-ivory pointer-events-none z-[99999] transition-transform duration-100 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-ivory/30 pointer-events-none z-[99998] transition-transform duration-200"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
