import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Challenge {
  id: number;
  name: string;
  description: string;
  photo: string;
  points: string;
  exercice_id: number;
  created_at: string;
  end_at: string;
  start_at: string;
  type: string;
  achievers: string;
  participants: string;
}

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

const TableExercice = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(null);

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

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get("/api/challenges");
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.challenges)) {
          setChallenges(response.data.challenges);
        } else {
          setError("Format de réponse invalide");
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        setError("Échec de la récupération des challenges");
        console.error("Failed to fetch challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        if (response.data && Array.isArray(response.data.users)) {
          const userDict: { [key: string]: string } = {};
          response.data.users.forEach((user: User) => {
            userDict[user.uid] = `${user.first_name} ${user.last_name}`;
          });
          setUserEmails(userDict);
          setUsers(response.data.users);
        } else {
          setError("Format de réponse invalide");
        }
      } catch (error) {
        setError("Échec de la récupération des utilisateurs");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/challenges_user/${id}`);
      setChallenges((prevChallenges) =>
        prevChallenges.filter((challenge) => challenge.id !== id)
      );
      setChallengeToDelete(null);
    } catch (error) {
      setError("Échec de la suppression du challenge");
      console.error("Failed to delete challenge:", error);
    }
  };

  const openDeleteModal = (challenge: Challenge) => {
    setChallengeToDelete(challenge);
  };

  const closeDeleteModal = () => {
    setChallengeToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getExerciseTitle = (trainingId: string) => {
    const training = exercises.find((ex) => ex.id.toString() === trainingId.toString());
    return training ? training.title : trainingId;
  };

  const getAchieverEmails = (achievers: string) => {
    const uids = achievers.toString().split(",");
    const emails = uids.map((uid) => userEmails[uid.trim()] || "").filter((email) => email.length > 0);
    return emails.join(", ");
  };

  const getParticipantEmails = (participants: string) => {
    const uids = participants.toString().split(",");
    const emails = uids.map((uid) => userEmails[uid.trim()] || "").filter((email) => email.length > 0);
    return emails.join(", ");
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Nom</p>
          </div>
          <div className="col-span-2 hidden sm:flex justify-center items-center">
            <p className="font-medium">Description</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Gagnants</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Exercice</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Participants</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Deadline</p>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <p className="font-medium">Action</p>
          </div>
        </div>

        {challenges.map((challenge, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{challenge.name}</p>
            </div>
            <div className="col-span-2 hidden sm:flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{challenge.description}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{getAchieverEmails(challenge.achievers)}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{getExerciseTitle(challenge.exercice_id.toString())}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">{getParticipantEmails(challenge.participants)}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <p className="text-sm text-black dark:text-white">
                {new Date(challenge.end_at).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <button
                onClick={() => openDeleteModal(challenge)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete challenge"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {challengeToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Supprimer le challenge "{challengeToDelete.name}" ?</h2>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Non
              </button>
              <button
                onClick={() => handleDelete(challengeToDelete.id)}
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
