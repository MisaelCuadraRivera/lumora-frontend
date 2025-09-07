'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: 'small' | 'medium' | 'large'
  delay: number
}

export function SpaceBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generar menos estrellas aleatorias (solo 50 en lugar de 150)
    const generateStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < 40; i++) {
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large']
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)]
        
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: randomSize,
          delay: Math.random() * 10  // Aumentado de 3 a 8 segundos
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Fondo base más oscuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#000211] to-[#0D0B22]" />
      
      {/* Estrellas parpadeantes - menos cantidad y que desaparezcan completamente */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star star-${star.size}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  )
}
