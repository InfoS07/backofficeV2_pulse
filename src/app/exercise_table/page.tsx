"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableExercice from "@/components/Tables/TableExercice";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import { useEffect, useState } from "react";

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

const ExerciseTablePage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    pod_count: '',
    difficulty: '',
    photo: '',
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('/api/exercises');
        if (response.data && Array.isArray(response.data.exercises)) {
          setExercises(response.data.exercises);
          setFilteredExercises(response.data.exercises);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des exercices');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const results = exercises.filter(exercise =>
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(results);
  }, [searchTerm, exercises]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newExercise = {
      title: formValues.title,
      description: formValues.description,
      pod_count: formValues.pod_count.toString(),
      difficulty: formValues.difficulty,
      photo: formValues.photo,
    };

    try {
      const response = await axios.post('/api/exercises', newExercise);
      setExercises([...exercises, response.data]);
      setFilteredExercises([...filteredExercises, response.data]);
      setShowForm(false);
      setFormValues({
        title: '',
        description: '',
        pod_count: '',
        difficulty: '',
        photo: '',
      });
    } catch (error) {
      console.error('Failed to add exercise:', error);
    }
    closeModal()
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Exercices" pageGo="report_table"/>
      <div className="relative flex flex-col gap-10">
        <button
          className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          aria-label="Add New"
          onClick={openModal}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
        <TableExercice/>
        <div className="mt-100"></div>
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              aria-hidden="true"
            ></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 ml-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/4">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Ajouter Un Exercice</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700">Titre</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formValues.title}
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
                    <label htmlFor="pod_count" className="block text-gray-700">Nombre de pods</label>
                    <select
                      id="pod_count"
                      name="pod_count"
                      value={formValues.pod_count}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="difficulty" className="block text-gray-700">Difficulté</label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formValues.difficulty}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Facile">Facile</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Difficile">Difficile</option>
                    </select>
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

export default ExerciseTablePage;
