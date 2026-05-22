// src/components/TaskForm.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskForm({ boardId, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les catégories au montage pour remplir le select
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (!error) {
        setCategories(data || []);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }

    setLoading(true);

    // Récupérer l'utilisateur actuellement connecté via Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Erreur d'authentification : impossible de récupérer l'utilisateur.");
      setLoading(false);
      return;
    }

    // Insertion de la tâche dans la table 'tasks'
    const { error: insertError } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description.trim() || null,
          status: status,
          priority: priority,
          board_id: boardId,
          category_id: categoryId || null, // Si vide, passe NULL
          due_date: dueDate || null,       // Si vide, passe NULL
          created_by: user.id
        }
      ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      // Réinitialiser le formulaire après succès
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
      onCreated(); // Déclenche le rafraîchissement de la liste des tâches parent
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
      <h3 style={{ marginTop: 0, color: '#1A8C82' }}>Nouvelle tâche</h3>
      {error && <p style={{ color: '#DC2626', fontWeight: 600 }}>{error}</p>}
      
      <input 
        placeholder='Titre de la tâche' 
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
        required
        style={inputStyle} 
      />
      
      <textarea 
        placeholder='Description (optionnelle)'
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        rows={3} 
        style={{ ...inputStyle, resize: 'vertical' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div>
          <label style={labelStyle}>Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            <option value='todo'>À faire</option>
            <option value='in_progress'>En cours</option>
            <option value='review'>Validation</option>
            <option value='done'>Terminée</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Priorité</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
            <option value='low'>Basse</option>
            <option value='medium'>Moyenne</option>
            <option value='high'>Haute</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Catégorie</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={selectStyle}>
            <option value=''>- Aucune -</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Échéance</label>
          <input type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={selectStyle} />
        </div>
      </div>

      <button type='submit' disabled={loading} style={btnStyle}>
        {loading ? 'Enregistrement...' : 'Créer la tâche'}
      </button>
    </form>
  );
}

const inputStyle = { padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.9rem', width: '100%', marginBottom: '0.75rem', boxSizing: 'border-box' };
const selectStyle = { padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', background: 'white' , color: 'black'};
const labelStyle = { display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: '#647488' };
const btnStyle = { background: '#1A8C82', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 };