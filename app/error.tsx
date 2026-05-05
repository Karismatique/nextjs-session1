// app/error.tsx
"use client"; // Obligatoire pour error.tsx

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container">
      <h1 className="page-title">Oups ! Quelque chose s&apos;est mal passé</h1>
      
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        {error.message}
      </p>
      
      <button 
        onClick={() => reset()} 
        style={{
          padding: '0.5rem 1.25rem', 
          borderRadius: '8px',
          border: '1px solid #6d28d9', 
          color: '#6d28d9',
          background: 'transparent', 
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Réessayer
      </button>
    </div>
  );
}