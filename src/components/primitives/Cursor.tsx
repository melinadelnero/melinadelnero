'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tx = 0, ty = 0, x = 0, y = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = tx + 'px'
        dotRef.current.style.top = ty + 'px'
      }
    }

    const onOver = (e: MouseEvent) => {
      if (!ringRef.current) return
      const target = e.target as Element
      const interactive = target.closest('a,button,.event-row,.gallery-item,.set-card,input,textarea,select')
      ringRef.current.classList.toggle('hover', !!interactive)
    }

    const loop = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.left = x + 'px'
        ringRef.current.style.top = y + 'px'
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
