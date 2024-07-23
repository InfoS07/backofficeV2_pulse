import { NextApiRequest, NextApiResponse } from 'next';
import { getChallenges, addChallenge } from '../../../src/app/utils/supabase/challenges'; // Assurez-vous du bon chemin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handling API request:', req.method, req.url);

  if (req.method === 'GET') {
    try {
      const challenges= await getChallenges();
      if (challenges) {
        const count = challenges; // Assurez-vous que cette ligne est correcte selon la structure de vos données
        console.log('Challenge count:', challenges);
        res.status(200).json({ challenges });
      } else {
        res.status(500).json({ error: 'Failed to get challenge count' });
      }
    } catch (error) {
      console.error('Failed to fetch challenge count:', error);
      res.status(500).json({ error: 'Failed to fetch challenge count' });
    }
  }  else if (req.method === 'POST') {
    try {
      const { name, description, points, exercice_id , end_at, start_at} = req.body;
      const newChallenge = { name, description, points, exercice_id , end_at, start_at};

      // Assurez-vous que votre fonction addChallenge gère correctement l'insertion et génère un nouvel ID.
      const addedChallenge = await addChallenge(newChallenge);

      res.status(201).json(addedChallenge);
    } catch (error) {
      console.error('Failed to add challenge:', error);
      res.status(500).json({ error: 'Failed to add challenge' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}