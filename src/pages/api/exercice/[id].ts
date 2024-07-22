import { NextApiRequest, NextApiResponse } from 'next';
import {  deleteExerciseById } from '../../../../src/app/utils/supabase/exercises'; // Assurez-vous du bon chemin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handling API request:', req.method, req.url);

   if (req.method === 'DELETE') {
    // Endpoint pour supprimer un Exerciceaire par ID
    try {
      const success = await deleteExerciseById(req.query.id as string);
      if (success) {
        console.log('Exerciceaire supprimé avec succès.');
        res.status(200).json({ message: 'Exerciceaire supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Exerciceaire non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du Exerciceaire:', error);
      res.status(500).json({ error: 'Échec de la suppression du Exerciceaire' });
    }

  } else {
    // Méthode non autorisée pour cet endpoint
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}