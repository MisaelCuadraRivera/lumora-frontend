import React from "react"

interface LumoraLogoProps {
  className?: string
  width?: number
  height?: number
}

export function LumoraLogo({ className = "", width = 40, height = 40 }: LumoraLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Splattered Background/Aura */}
      <defs>
        <radialGradient id="splatterGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#1E40AF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.2" />
        </radialGradient>
        
        <radialGradient id="swirlGradient" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="25%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="75%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
        
        <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </radialGradient>
      </defs>

      {/* Splattered Background */}
      <ellipse
        cx="50"
        cy="50"
        rx="45"
        ry="45"
        fill="url(#splatterGradient)"
        opacity="0.8"
      />

      {/* Central Swirling Element */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="url(#swirlGradient)"
        stroke="#1E3A8A"
        strokeWidth="1"
      />

      {/* Swirl Pattern */}
      <path
        d="M 50 20 Q 35 35 50 50 Q 65 35 50 20"
        fill="#3B82F6"
        opacity="0.8"
      />
      <path
        d="M 50 50 Q 35 65 50 80 Q 65 65 50 50"
        fill="#8B5CF6"
        opacity="0.8"
      />

      {/* Stars in the center */}
      <circle cx="50" cy="50" r="2" fill="url(#starGradient)" />
      <circle cx="45" cy="45" r="1" fill="url(#starGradient)" />
      <circle cx="55" cy="45" r="1" fill="url(#starGradient)" />
      <circle cx="45" cy="55" r="1" fill="url(#starGradient)" />
      <circle cx="55" cy="55" r="1" fill="url(#starGradient)" />

      {/* Orbital Rings */}
      <path
        d="M 20 30 Q 50 20 80 30"
        stroke="#3B82F6"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 25 70 Q 50 80 75 70"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Comet Tail */}
      <path
        d="M 20 70 L 40 50"
        stroke="#3B82F6"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />

      {/* Stylized Stars */}
      <g opacity="0.8">
        {/* Top Left Star */}
        <path
          d="M 25 25 L 27 27 L 29 25 L 27 23 Z"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="0.5"
        />
        
        {/* Top Right Star */}
        <path
          d="M 75 25 L 77 27 L 79 25 L 77 23 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="0.5"
        />
        
        {/* Bottom Left Star */}
        <path
          d="M 25 75 L 27 77 L 29 75 L 27 73 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="0.5"
        />
        
        {/* Bottom Right Star */}
        <path
          d="M 75 75 L 77 77 L 79 75 L 77 73 Z"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="0.5"
        />
      </g>

      {/* Planets/Orbs */}
      <circle cx="30" cy="30" r="3" fill="#8B5CF6" opacity="0.8" />
      <circle cx="70" cy="70" r="4" fill="#7C3AED" opacity="0.8" />

      {/* Additional small stars in splatter */}
      <circle cx="35" cy="40" r="0.5" fill="#FFFFFF" opacity="0.6" />
      <circle cx="65" cy="35" r="0.5" fill="#FFFFFF" opacity="0.6" />
      <circle cx="40" cy="65" r="0.5" fill="#FFFFFF" opacity="0.6" />
      <circle cx="60" cy="60" r="0.5" fill="#FFFFFF" opacity="0.6" />
    </svg>
  )
}
