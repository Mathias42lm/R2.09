// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserTable from '../components/UserTable';
import TaskList from '../components/TaskList';

export default function DashboardPage({ session }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [tab, setTab] = useState('tasks'); // Gestion de l'onglet actif : 'tasks' ou 'users'
  const [boardId, setBoardId] = useState(null);

  // Charger les profils d'utilisateurs
  async function fetchUsers() {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setUsers(data || []);
    setLoadingUsers(false);
  }

  // Charger le premier board de l'utilisateur au démarrage
  useEffect(() => {
    fetchUsers();

    async function fetchUserBoard() {
      const { data, error } = await supabase
        .from('boards')
        .select('id')
        .limit(1);

      if (!error && data && data.length > 0) {
        setBoardId(data[0].id);
      }
    }
    fetchUserBoard();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header */}
      <header style={{ background: '#1A8C82', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>KanbanRT Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{session.user.email}</span>
          <button 
            onClick={handleLogout}
            style={{ background: 'white', color: '#1A8C82', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        
        {/* Navigation par Onglets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'tasks', label: 'Tâches' },
            { key: 'users', label: 'Utilisateurs' }
          ].map((item) => {
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? '#1A8C82' : '#E2E8F0',
                  color: isActive ? 'white' : '#64748B',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.2s'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Rendu conditionnel selon l'onglet actif */}
        {tab === 'tasks' && (
          boardId ? (
            <TaskList boardId={boardId} />
          ) : (
            <p style={{ color: '#94A3B8' }}>
              Aucun tableau trouvé. Assure-toi d'avoir exécuté le script SQL de test.
            </p>
          )
        )}

        {tab === 'users' && (
          loadingUsers ? (
            <p style={{ color: '#64748B' }}>Chargement des utilisateurs...</p>
          ) : (
            <div>
              <h2>Utilisateurs inscrits</h2>
              <UserTable users={users} onRefresh={fetchUsers} />
            </div>
          )
        )}

      </main>
    </div>
  );
}