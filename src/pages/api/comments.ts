import { NextApiRequest, NextApiResponse } from 'next';
import { getComments} from '../../../src/app/utils/supabase/comments'; // Assurez-vous du bon chemin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handling API request:', req.method, req.url);

  if (req.method === 'GET') {
    try {
      const comments= await getComments();
      if (comments) {
        const count = comments; 
        console.log('Comment count:', comments);
        res.status(200).json({ comments });
      } else {
        res.status(500).json({ error: 'Failed to get comment count' });
      }
    } catch (error) {
      console.error('Failed to fetch comment count:', error);
      res.status(500).json({ error: 'Failed to fetch comment count' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}