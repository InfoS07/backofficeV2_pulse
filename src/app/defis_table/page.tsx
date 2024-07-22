"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDefi from "@/components/Tables/TableDefi";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import axios from "axios";

// Définir l'interface pour le challenge
interface Defi {
  id: number;
  name: string;
  description: string;
  points: number;
  exercice_id: number;
  start_at: string;
  end_at: string;
}

// Définir l'interface pour l'exercice (pour le sélecteur)

interface Exercise {
  id: number;
  title: string;
  description: string;
  sequence: string;
  repetitions: string;
  pod_count: string;
  player_count: string;
  calories_burned: string;
  points: string;
  difficulty: string;
  categories: string;
  type: string;
  hit_type: string;
}

const DefiTablePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // State pour les valeurs du formulaire
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    points: '',
    exercice_id: '',
    start_at: '',
    end_at: '',
  });

  // State pour gérer les erreurs et l'état de chargement
  const [challenges, setDefis] = useState<Defi[]>([]);
  const [loadingDefis, setLoadingDefis] = useState(true);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('/api/exercises');
        if (response.data && Array.isArray(response.data.exercises)) {
          setExercises(response.data.exercises);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des exercices');
      } finally {
        setLoading(false);
      }
    };

    const fetchDefis = async () => {
      try {
        const response = await axios.get('/api/challenges');
        if (response.data && Array.isArray(response.data.challenges)) {
          setDefis(response.data.challenges);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des challenges');
      } finally {
        setLoadingDefis(false);
      }
    };

    fetchExercises();
    fetchDefis();
  }, []);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDefi = {
      name: formValues.name,
      description: formValues.description,
      points: parseInt(formValues.points),
      exercice_id: parseInt(formValues.exercice_id),
      start_at: formValues.start_at,
      end_at: formValues.end_at,
    };

    try {
      const response = await axios.post('/api/challenges', newDefi);
      setDefis([...challenges, response.data]);
      setFormValues({
        name: '',
        description: '',
        points: '',
        exercice_id: '',
        start_at: '',
        end_at: '',
      });
      closeModal();
    } catch (error) {
      console.error('Failed to add challenge:', error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Defis" pageGo="/" />
      <div className="relative flex flex-col gap-10">
        
        <TableDefi/>
        <div className="mt-100"></div>

        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              aria-hidden="true"
            ></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 ml-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/5">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Ajouter un challenge</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">Titre</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700">Description</label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      value={formValues.description}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="points" className="block text-gray-700">Points</label>
                    <input
                      id="points"
                      name="points"
                      type="number"
                      value={formValues.points}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="exercise" className="block text-gray-700">Exercice</label>
                    <select
                      id="exercise"
                      name="exercice_id"
                      value={formValues.exercice_id}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      {loading && <option>Chargement...</option>}
                      {error && <option>Erreur: {error}</option>}
                      {!loading && !error && exercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="start-date" className="block text-gray-700">Date de début</label>
                    <input
                      id="start-date"
                      name="start_at"
                      type="date"
                      value={formValues.start_at}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="end_at" className="block text-gray-700">Date de fin</label>
                    <input
                      id="end_at"
                      name="end_at"
                      type="date"
                      value={formValues.end_at}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

export default DefiTablePage;
