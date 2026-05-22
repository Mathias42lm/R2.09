// src/components/TaskList.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList({ boardId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)') // Jointure automatique grâce à la Clé Étrangère
      .eq('board_id', boardId)
      .order('created_at', { ascending: false });
    console.log(data, error)
    if (!error) {
      setTasks(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (boardId) {
      fetchTasks();
    }
  }, [boardId]);

  async function handleDelete(taskId) {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (!error) {
      fetchTasks();
    }
  }

  if (loading) return <p style={{ color: '#64748B' }}>Chargement des tâches...</p>;

  return (
    <div>
      {/* Formulaire d'ajout inclus en haut de la liste */}
      <TaskForm boardId={boardId} onCreated={fetchTasks} />

      {/* Grille responsive de cartes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
          Aucune tâche. Créez-en une ci-dessus !
        </p>
      )}
    </div>
  );
}