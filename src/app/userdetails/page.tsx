"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

interface User {
    user: any;
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

interface Challenge {
    id: number;
    name: string;
    photo: string | null;
    end_at: string;
    created_at: string;
    training_id: number;
    description: string;
    type: string;
    participants: object;
    author_id: string;
    invites: string[];
}

const UserDetailsPage = () => {
    const [id, setId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [createdChallenges, setCreatedChallenges] = useState<Challenge[]>([]);
    const [joinedChallenges, setJoinedChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const idFromQuery = queryParams.get('id');
        setId(idFromQuery);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/users/${id}`);
                if (response.data) {
                    setUser(response.data);
                } else {
                    setError('Utilisateur non trouvé');
                }
            } catch (error) {
                setError('Échec de la récupération de l\'utilisateur');
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    useEffect(() => {
        const fetchUserTrainings = async () => {
            if (user) {
                try {
                    const responsetrain = await axios.get(`/api/user_training/${user.user.uid}`);
                    if (responsetrain.data && Array.isArray(responsetrain.data.trainings)) {
                        setTrainings(responsetrain.data.trainings);
                    } else {
                        setError('Formations non trouvées');
                    }
                } catch (error) {
                    setError('Échec de la récupération des formations');
                    console.error('Failed to fetch trainings:', error);
                }
            }
        };

        fetchUserTrainings();
    }, [user]);

    useEffect(() => {
        const fetchUserCreatedChallenges = async () => {
            if (user) {
                try {
                    const response = await axios.get(`/api/challenges_user/${user.user.uid}`);
                    if (response.data && Array.isArray(response.data.challenges)) {
                        setCreatedChallenges(response.data.challenges);
                    } else {
                        setError('Défis non trouvés');
                    }
                } catch (error) {
                    setError('Échec de la récupération des défis');
                    console.error('Failed to fetch challenges:', error);
                }
            }
        };

        fetchUserCreatedChallenges();
    }, [user]);

    useEffect(() => {
        const fetchUserJoinedChallenges = async () => {
            if (user) {
                try {
                    const response = await axios.get(`/api/defis/${user.user.uid}`);
                    if (response.data && Array.isArray(response.data.challenges)) {
                        setJoinedChallenges(response.data.challenges);
                    } else {
                        setError('Défis non trouvés');
                    }
                } catch (error) {
                    setError('Échec de la récupération des défis');
                    console.error('Failed to fetch challenges:', error);
                }
            }
        };

        fetchUserJoinedChallenges();
    }, [user]);

    const renderUserTable = () => (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-2 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Email</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Nom</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Prénom</p>
                </div>
            </div>
            <div className="grid grid-cols-2 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-4 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p>{user?.user.id}</p>
                </div>
                <div className="col-span-1 flex items-center">
                <p>{user?.user.email}</p>

                </div>
                <div className="col-span-1 flex items-center">
                    <p>{user?.user.last_name}</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p>{user?.user.first_name}</p>
                </div>
            </div>
        </div>
    );

    const renderTrainingsTable = () => (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-5 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Titre</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Date</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Durée</p>
                </div>
            </div>
            {trainings.map(training => (
                <div className="grid grid-cols-5 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5" key={training.id}>
                    <div className="col-span-1 flex items-center">
                        <p>{training.id}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p>{training.title}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p>{training.created_at}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p>{training.repetitions} minutes</p>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderChallengesTable = (challenges: Challenge[]) => (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-6 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Nom</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Description</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Date de fin</p>
                </div>
            </div>
            {challenges.map(challenge => (
                <div className="grid grid-cols-6 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5" key={challenge.id}>
                    <div className="col-span-1 flex items-center">
                        <p>{challenge.id}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p>{challenge.name}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p>{challenge.description}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p>{challenge.end_at}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <DefaultLayout>
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Détails de l'utilisateur</h1>
            {loading && <p>Chargement en cours...</p>}
            {error && <p>Erreur: {error}</p>}
            
            {user && renderUserTable()}
            {!loading && !user && <p>Aucun utilisateur à afficher pour l'ID sélectionné.</p>}
            
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Trainings</h2>
                {trainings.length > 0 ? renderTrainingsTable() : <p>Aucune formation à afficher.</p>}
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Défis créés</h2>
                {createdChallenges.length > 0 ? renderChallengesTable(createdChallenges) : <p>Aucun défi à afficher.</p>}
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Défis auxquels il participe</h2>
                {joinedChallenges.length > 0 ? renderChallengesTable(joinedChallenges) : <p>Il ne participe à aucun défi.</p>}
            </div>
            <div className="bg-gray-100 p-4 mt-6 rounded-sm shadow-md">
            </div>
        </div>
        </DefaultLayout>
    );
};

export default UserDetailsPage;
