'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import userIcon from "../../../public/images/user/user_icon.png"; // Assurez-vous de corriger le chemin vers votre icône
import { useRouter } from 'next/navigation';

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

const TableTwo = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          setError('Format de réponse invalide');
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        setError('Échec de la récupération des users');
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const router = useRouter();

  // Fonction pour naviguer vers /userdetails avec le paramètre 1
  const navigateToUserDetails = (userId: number) => {
    router.push(`/userdetails?id=${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-6 sm:grid-cols-8 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="flex items-center justify-center col-span-1 sm:col-span-2">
          <p className="font-medium">Photo</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium">Nom</p>
        </div>
        <div className="flex items-center justify-center col-span-1 sm:col-span-2">
          <p className="font-medium">Email</p>
        </div>
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium">Points</p>
        </div>
       
        <div className="flex items-center justify-center col-span-1">
          <p className="font-medium">Détail</p>
        </div>
      </div>

      {users.map((user, key) => (
        <div
          className="grid grid-cols-6 sm:grid-cols-8 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="flex items-center justify-center col-span-1 sm:col-span-2">
            <div className="h-12.5 w-15 rounded-md">
              <img
                alt="User"
                loading="lazy"
                width="56"
                height="56"
                decoding="async"
                src={user.profile_photo && user.profile_photo.startsWith('http') ? user.profile_photo : userIcon.src}
                style={{ color: "transparent", width: "auto", height: "auto" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="text-sm text-black dark:text-white">
              {user.first_name + ' ' + user.last_name}
            </p>
          </div>
          <div className="flex items-center justify-center col-span-1 sm:col-span-2">
            <p className="text-sm text-black dark:text-white">
              {user.email}
            </p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="text-sm text-black dark:text-white">{user.points}</p>
          </div>
         
          <div className="flex items-center justify-center col-span-1">
            <button className="hover:text-primary" onClick={() => navigateToUserDetails(user.id)}>
              <svg
                className="fill-current"
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                  fill=""
                />
                <path
                  d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
