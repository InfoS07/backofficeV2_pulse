import { useEffect, useState } from 'react';
import axios from 'axios';

// Définition de l'interface User
interface User {
  id: number;
  last_name: string;
  first_name: string;
  profile_photo: string | null;
  created_at: string;
  username: string;
  email: string;
  birth_date: string;
  uid: string;
  points: number;
}

// Définition de l'interface Training
interface Training {
  id: number;
  title: string;
  description: string;
  created_at: string;
  repetitions: number;
  author_id: number;
}

const TableOne = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        if (response.data && Array.isArray(response.data.users)) {
          // Trier les utilisateurs par nombre de points décroissant
          const sortedUsers = response.data.users.sort((a: User, b: User) => b.points - a.points);
          setUsers(sortedUsers);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des utilisateurs');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get('/api/trainings');
        if (response.data && Array.isArray(response.data.trainings)) {
          setTrainings(response.data.trainings);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des entraînements');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  // Fonction pour compter le nombre d'entraînements pour un utilisateur
  const getTrainingCountForUser = (userUid: string) => {
    return trainings.filter(training => training.author_id.toString() == userUid).length;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Les meilleurs pulseurs
      </h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Classement
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nom
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mail
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nombre d&apos;entrainements
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nombre de points
            </h5>
          </div>
        </div>

        {users.map((user, index) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              index === users.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={user.id}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{index + 1}</p> {/* Classement */}
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.first_name} {user.last_name}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{user.email}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{getTrainingCountForUser(user.uid)}</p> {/* Nombre d'entrainements */}
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{user.points}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
