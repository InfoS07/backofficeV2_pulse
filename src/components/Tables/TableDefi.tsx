import React, { useState, useEffect } from "react";
import axios from "axios";
import e from "express";

interface Defi {
  id: number;
  name: string;
  end_at: string;
  created_at: string;
  training_id: string;
  description: number;
  type: string;
  participants: string;
  author_id: string;
  invites: string;
}

interface User {
  id: number;
  profile_photo: string;
  last_name: string;
  first_name: string;
  username: string;
  email: string;
  birth_date: string;
  uid: string;
}
interface Training {
    id: number;
    title: string;
    description: string;
    created_at: string;
    repetitions: number;
    author_id: number;
  }



const TableExercice = () => {
  const [defis, setDefis] = useState<Defi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    const fetchDefis = async () => {
      try {
        const response = await axios.get('/api/defis');
        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data.defis)) {
          setDefis(response.data.defis);
        } else {
          setError('Format de réponse invalide');
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        setError('Échec de la récupération des defis');
        console.error('Failed to fetch defis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefis();
  }, []);

  useEffect(() => {
    const fetchUserTrainings = async () => {
     
        try {
          const responsetrain = await axios.get(`/api/trainings`);
          if (responsetrain.data && Array.isArray(responsetrain.data.trainings)) {
            setTrainings(responsetrain.data.trainings);
          } else {
            setError('Formations non trouvées');
          }
        } catch (error) {
          setError('Échec de la récupération des formations');
          console.error('Failed to fetch trainings:', error);
        }
      
    };

    fetchUserTrainings();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        if (response.data && Array.isArray(response.data.users)) {
          const userDict: { [key: string]: string } = {};
          response.data.users.forEach((user: User) => {
            userDict[user.uid] = `${user.first_name} ${user.last_name}`;
          });
          setUserEmails(userDict);
          setUsers(response.data.users);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des utilisateurs');
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getAchieverEmails = (achievers: string) => {
    const uids = achievers.toString().split(',');
    const emails = uids.map(uid => userEmails[uid.trim()] || '').filter(email => email.length > 0);
    return emails.join(', ');
  };

  const getParticipantEmails = (participants: string) => {
    const uids = participants.toString().split(',');
    const emails = uids.map(uid => userEmails[uid.trim()] || '').filter(email => email.length > 0);
    return emails.join(', ');
  };


  const getExerciseTitle = (trainingId: string) => {
    const training = trainings.find(ex => ex.id.toString() === trainingId.toString());
    return training ? training.title : trainingId;
  };



  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex justify-center items-center">
          <p className="font-medium">Nom</p>
        </div>
        <div className="col-span-2 hidden sm:flex justify-center items-center">
          <p className="font-medium">Description</p>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <p className="font-medium">Exercice</p>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <p className="font-medium">Créateur</p>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <p className="font-medium">Participants</p>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <p className="font-medium">Deadline</p>
        </div>
      </div>

      {defis.map((defi, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-2 flex justify-center items-center">
            <p className="text-sm text-black dark:text-white">
              {defi.name}
            </p>
          </div>
          <div className="col-span-2 hidden sm:flex justify-center items-center">
            <p className="text-sm text-black dark:text-white">
              {defi.description}
            </p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="text-sm text-black dark:text-white">
              {getExerciseTitle(defi.training_id)}
            </p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="text-sm text-black dark:text-white">{getParticipantEmails(defi.author_id)}</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="text-sm text-black dark:text-white">
              {getParticipantEmails(defi.invites)}
            </p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="text-sm text-black dark:text-white">
              {new Date(defi.end_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableExercice;
