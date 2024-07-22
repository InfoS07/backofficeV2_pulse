"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTwo from "@/components/Tables/TableTwo";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Icônes +
import { useRouter } from 'next/router';


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

const TablesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    last_name: '',
    first_name: '',
    profile_photo: '',
    email: ''
  });



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

   

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      last_name: formValues.last_name,
      first_name: formValues.first_name,
      profile_photo: formValues.profile_photo || null,
      email: formValues.email,
    };

    try {
      const response = await axios.post('/api/users', newUser);
      const responseget = await axios.get('/api/users');
        if (responseget.data && Array.isArray(responseget.data.users)) {
          setUsers(responseget.data.users);
        } else {
          setError('Format de réponse invalide');
        }
      setModalOpen(false);
      setFormValues({
        last_name: '',
        first_name: '',
        profile_photo: '',
        email: '',

      });
      // Réinitialiser les valeurs du formulaire
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center">Erreur : {error}</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Utilisateurs" pageGo="/calendar" />
      <div className="relative flex flex-col gap-10">
        {/* Bouton + */}
        <button
          className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          aria-label="Add New"
          onClick={
            handleAddClick
          }
        >
          <PlusIcon className="w-6 h-6" />
        </button>

        <TableTwo  /> {/* Passez les utilisateurs filtrés à TableTwo */}

        {/* ModalForm */}
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 "
              aria-hidden="true"
            ></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 ml-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Ajouter Utilisateur</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label htmlFor="last_name" className="block text-gray-700">Nom</label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formValues.last_name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="first_name" className="block text-gray-700">Prénom</label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formValues.first_name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
             
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    Enregistrer
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
