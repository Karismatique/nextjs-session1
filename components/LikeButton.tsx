"use client"; // Indique à Next.js que ce composant s'exécute côté client

import { useState } from "react";

type LikeButtonProps = { 
  initialLikes: number;
};

export default function LikeButton({ initialLikes }: LikeButtonProps) {
  // Initialisation des états locaux
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  // Fonction de bascule (toggle)
  function handleLike() {
    setCount(liked ? count - 1 : count + 1);
    setLiked(!liked);
  }

  return (
    <button 
      onClick={handleLike}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '9999px', // Arrondi type "pilule"
        border: liked ? '1px solid #ec4899' : '1px solid transparent',
        backgroundColor: liked ? '#fce7f3' : 'transparent',
        color: liked ? '#ec4899' : '#6b7280',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s ease', // Animation douce lors du changement d'état
        fontSize: '0.9rem',
        fontFamily: 'inherit'
      }}
    >
      {liked ? '❤️' : '🤍'} {count} j'aime
    </button>
  );
}