import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-label="EcoGrass Logo"
  >
    {/* 
      Compound path: The outer loop creates the "A" shape, 
      and the inner coordinates trace the tree silhouette to cut it out (negative space).
    */}
    <path 
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 95 L38 5 L62 5 L90 95 L54 95 V82 L70 82 L58 62 L66 62 L56 44 L62 44 L50 22 L38 44 L44 44 L34 62 L42 62 L30 82 L46 82 V95 L10 95 Z" 
    />
  </svg>
);