import { NextApiRequest, NextApiResponse } from 'next';
import { getChallengesByUserId , deleteChallengeById} from '../../../../src/app/utils/supabase/challenges'; // Assurez-vous du bon chemin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handling API request:', req.method, req.url);

  if (req.method === 'GET') {
    try {
      const challenges= await getChallengesByUserId(req.query.id as string);
      if (challenges) {
        const count = challenges; 
        console.log('Challenge count:', challenges);
        res.status(200).json({ challenges });
      } else {
        res.status(500).json({ error: 'Failed to get challenge count' });
      }
    } catch (error) {
      console.error('Failed to fetch challenge count:', error);
      res.status(500).json({ error: 'Failed to fetch challenge count' });
    } 
  } else if (req.method === 'DELETE'){
    try {
      const success = await deleteChallengeById(req.query.id as string);
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
  }else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}