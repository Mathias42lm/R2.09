// api/send-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Accepter uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Récupérer les données envoyées par le client React
  const { to, subject, html } = req.body;

  // Validation basique
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Champs manquants : to, subject, html' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'KanbanRT <onboarding@resend.dev>', // Utilise l'adresse de test si domaine non vérifié
      to: Array.isArray(to) ? to : [to], // Resend attend un tableau ou une string
      subject,
      html,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}