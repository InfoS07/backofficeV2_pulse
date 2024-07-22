import { NextApiRequest, NextApiResponse } from 'next';
import { getDefis } from '../../../src/app/utils/supabase/defis'; // Assurez-vous du bon chemin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handling API request:', req.method, req.url);

  if (req.method === 'GET') {
    try {
      const defis= await getDefis();
      if (defis) {
        const count = defis; // Assurez-vous que cette ligne est correcte selon la structure de vos données
        console.log('Defi count:', defis);
        res.status(200).json({ defis });
      } else {
        res.status(500).json({ error: 'Failed to get defi count' });
      }
    } catch (error) {
      console.error('Failed to fetch defi count:', error);
      res.status(500).json({ error: 'Failed to fetch defi count' });
    }
  }   else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}