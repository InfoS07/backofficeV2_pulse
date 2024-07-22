import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

const TableExercice = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("/api/exercises");
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.exercises)) {
          setExercises(response.data.exercises);
        } else {
          setError("Format de réponse invalide");
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        setError("Échec de la récupération des exercices");
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/exercice/${id}`);
      setExercises((prevExercises) =>
        prevExercises.filter((exercise) => exercise.id !== id)
      );
      setExerciseToDelete(null);
    } catch (error) {
      setError("Échec de la suppression de l'exercice");
      console.error("Failed to delete exercise:", error);
    }
  };

  const openDeleteModal = (exercise: Exercise) => {
    setExerciseToDelete(exercise);
  };

  const closeDeleteModal = () => {
    setExerciseToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Nom</p>
          </div>
          <div className="col-span-2 hidden justify-center items-center sm:flex">
            <p className="font-medium">Description</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Nombre de pods</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Nombre de répétitions</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Points rapportés</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Difficulté</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Action</p>
          </div>
        </div>

        {exercises.map((exercice) => (
          <div
            className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={exercice.id}
          >
            <div className="col-span-1 hidden justify-center items-center sm:flex">
              <p className="text-sm text-black dark:text-white">{exercice.title}</p>
            </div>
            <div className="col-span-2 hidden justify-center items-center sm:flex">
              <p className="text-sm text-black dark:text-white">{exercice.description}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{exercice.pod_count}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{exercice.repetitions}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{exercice.points}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{exercice.difficulty}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <button
                onClick={() => openDeleteModal(exercice)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete exercise"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {exerciseToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Supprimer l'exercice "{exerciseToDelete.title}" ?</h2>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Non
              </button>
              <button
                onClick={() => handleDelete(exerciseToDelete.id)}
                className="px-4 py-2 bg-red hover:bg-red-700 text-white rounded"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableExercice;
