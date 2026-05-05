// app/explore/loading.tsx

export default function Loading() {
  return (
    <div className="container">
      <h1 className="page-title">Suggestions</h1>
      
      <div className="explore-list">
        {/* On génère 4 fausses cartes pour le squelette */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="user-card">
            <div className="user-card-content" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              
              <div style={{ width: '70%' }}>
                {/* Ligne pour le Nom & Handle */}
                <div style={{ height: '20px', width: '50%', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }} />
                {/* Ligne pour l'Email */}
                <div style={{ height: '16px', width: '60%', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '8px' }} />
                {/* Ligne pour la Ville */}
                <div style={{ height: '14px', width: '40%', backgroundColor: '#f3f4f6', borderRadius: '4px' }} />
              </div>
              
              {/* Bulle pour le bouton Suivre */}
              <div style={{ height: '36px', width: '80px', backgroundColor: '#e5e7eb', borderRadius: '9999px' }} />
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}