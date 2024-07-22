import { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, createUser } from '../../../src/app/utils/supabase/users'; // Assurez-vous du bon chemin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handling API request:', req.method, req.url);

  if (req.method === 'GET') {
    try {
      const users = await getUsers();
      if (users) {
        console.log('Users:', users);
        res.status(200).json({ users });
      } else {
        res.status(500).json({ error: 'Failed to get users' });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    try {
      console.log('Creating user:', req.body);
      const last_name = req.body.last_name;
      const profile_photo = req.body.profile_photo;
      const email = req.body.email;
      const first_name = req.body.first_name;
      const newUser = await createUser({ last_name, first_name, profile_photo, email });
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
