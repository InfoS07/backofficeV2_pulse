import React, { useState, useEffect } from "react";
import axios from "axios";
import userIcon from "../../../public/images/user/user_icon.png"; // Assurez-vous de corriger le chemin vers votre icône
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Report {
    id: number;
    comment_id: string;
    created_at: string;
    user_id: string;
    reason: string;
    content: string;
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

interface Comment {
    id: string;
    training_id: number;
    content: string;
    created_at: string;
    user_id: string;
}

const TableModeration = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});
    const [comments, setComments] = useState<{ [key: string]: Comment }>({});
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    // Fetch reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('/api/reports');
                if (response.data && Array.isArray(response.data.reports)) {
                    setReports(response.data.reports);
                } else {
                    setError('Format de réponse invalide');
                }
            } catch (error) {
                setError('Échec de la récupération des reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // Fetch users
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

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('/api/comments');
                if (response.data && Array.isArray(response.data.comments)) {
                    const commentDict: { [key: string]: Comment } = {};
                    response.data.comments.forEach((comment: Comment) => {
                        commentDict[comment.id] = comment;
                    });
                    setComments(commentDict);
                } else {
                    setError('Format de réponse invalide');
                }
            } catch (error) {
                setError('Échec de la récupération des commentaires');
            }
        };

        fetchComments();
    }, []);

    const handleOpenModal = (report: Report) => {
        setSelectedReport(report);
        setModalOpen(true);
        document.body.classList.add('blurred');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedReport(null);
        document.body.classList.remove('blurred');
    };

    const handleLeave = async () => {
        if (selectedReport) {
            try {
                const response = await axios.delete(`/api/report/${selectedReport.id}`);
                setReports(reports.filter(report => report.id !== selectedReport.id));
                console.log("Supprimé", selectedReport);
            } catch (error) {
                console.error("Erreur lors de la suppression", error);
            }
            handleCloseModal();
        }
    };

    const handleDelete = async () => {
        if (selectedReport) {
            try {
                const response = await axios.delete(`/api/comment/${selectedReport.comment_id}`);
                setReports(reports.filter(report => report.id !== selectedReport.id));
                console.log("Supprimé", selectedReport);
            } catch (error) {
                console.error("Erreur lors de la suppression", error);
            }
            handleLeave();
            handleCloseModal();
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark">
                <div className="flex justify-center items-center">
                    <p className="font-medium">ID Commentaire</p>
                </div>
                <div className="flex justify-center items-center">
                    <p className="font-medium">Crée par</p>
                </div>
                <div className="flex justify-center items-center">
                    <p className="font-medium">Auteur du commentaire</p>
                </div>
                <div className="flex justify-center items-center">
                    <p className="font-medium">Date du signalement</p>
                </div>
                <div className="flex justify-center items-center">
                    <p className="font-medium">Raison</p>
                </div>
                <div className="flex justify-center items-center">
                    <p className="font-medium">Traiter</p>
                </div>
            </div>

            {reports.map((report, key) => (
                <div
                    className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark"
                    key={key}
                >
                    <div className="flex justify-center items-center">
                        <div className="h-12.5 w-15 rounded-md">
                            {report.comment_id}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <p className="text-sm text-black dark:text-white">
                            {userEmails[comments[report.comment_id]?.user_id] || 'Utilisateur non trouvé'}
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <p className="text-sm text-black dark:text-white">
                            {userEmails[report.user_id] || 'Email non trouvé'}
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <p className="text-sm text-black dark:text-white"> {new Date(report.created_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex justify-center items-center">
                        <p className="text-sm text-black dark:text-white">
                            {report.reason}
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            className="hover:text-primary"
                            onClick={() => handleOpenModal(report)}
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                />
                                <path
                                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}

            {isModalOpen && selectedReport && (
                <>
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <h2 className="text-lg font-semibold mb-4">Détails du rapport</h2>
                            <p><strong>Commentaire ID:</strong> {selectedReport.comment_id}</p>
                            <p><strong>Email:</strong> {userEmails[selectedReport.user_id] || 'Email non trouvé'}</p>
                            <p><strong>Contenu:</strong> {comments[selectedReport.comment_id]?.content || 'Contenu non trouvé'}</p>
                            <p><strong>Créé le:</strong> {new Date(selectedReport.created_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong>Raison:</strong> {selectedReport.reason}</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                                    onClick={handleLeave}
                                >
                                    Laisser
                                </button>
                                <button
                                    className="bg-red text-white py-2 px-4 rounded"
                                    onClick={handleDelete}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="blurred" />
                </>
            )}
        </div>
    );
};

export default TableModeration;
