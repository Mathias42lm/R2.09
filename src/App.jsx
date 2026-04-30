function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      {/* Modification exacte exigée par l'étape 5.2 du TD */}
      <h1>🚀 Déploiement automatique opérationnel</h1>
      
      <p>Projet réalisé par <strong>Mathias Mellier</strong></p>
      <p>Future application : gestion de tâches Kanban</p>
      
      {/* Optimisation : Lien cliquable sécurisé */}
      <p>
        Github :{' '}
        <a 
          href="https://github.com/Mathias42lm/R2.09" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#0366d6', textDecoration: 'none' }}
        >
          https://github.com/Mathias42lm/R2.09
        </a>
      </p>
    </div>
  );
}

export default App;