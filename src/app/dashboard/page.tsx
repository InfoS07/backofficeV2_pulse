"use client";
import dynamic from "next/dynamic";
import ChartOne from "../../components/Charts/ChartOne";
import ChartTwo from "../../components/Charts/ChartTwo";
import ChatCard from "../../components/Chat/ChatCard";
import TableOne from "../../components/Tables/TableOne";
import CardDataStats from "../../components/CardDataStats";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});




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

interface Training {
  id: number;
  title: string;
  description: string;
  created_at: string;
  repetitions: number;
  author_id: number;
}


interface Report {
  id: number;
  comment_id: string;
  created_at: string;
  user_id: string;
  reason: string;
  content:string
}


const ECommerce: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchTraingins = async () => {
      try {
        const response = await axios.get('/api/trainings');
        if (response.data && Array.isArray(response.data.trainings)) {
          setTrainings(response.data.trainings);
        } else {
          setError('Format de réponse invalide');
        }
      } catch (error) {
        setError('Échec de la récupération des trainings');
      } finally {
        setLoading(false);
      }
    };

    fetchTraingins();
  }, []);


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
        setError('Échec de la récupération des rapports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getTodayTrainingsCount = () => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    return trainings.filter(training => training.created_at.split('T')[0] === today).length;
  };
  return (
    <DefaultLayout>

    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Nombre total d'entrainements" total={trainings.length.toString()} rate="" >
       
        <svg fill="#FFFFFF" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" width="30" height="30"
	 viewBox="0 0 32 32" >
<g>
	<path d="M23,11c2.2,0,4-1.8,4-4s-1.8-4-4-4s-4,1.8-4,4S20.8,11,23,11z"/>
	<path d="M30.8,12.4c-0.3-0.4-1-0.5-1.4-0.2l-2.9,2.3c-0.8,0.7-2,0.6-2.7-0.2l-7.9-7.9c-1.6-1.6-4.1-1.6-5.7,0L7.3,9.3
		c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l2.8-2.8c0.8-0.8,2.1-0.8,2.9,0l1.6,1.6L11.6,14c-1,1-1.4,2.3-1.1,3.7c0.2,1.1,0.9,2,1.8,2.6
		l-1.6,1.6c-0.4,0.4-1,0.4-1.4,0l-3.6-3.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l3.6,3.6c0.6,0.6,1.3,0.9,2.1,0.9s1.6-0.3,2.1-0.9
		l2.1-2.1l2.5,1c0.7,0.3,1.2,1,1.2,1.8v6c0,0.6,0.4,1,1,1s1-0.4,1-1v-6c0-1.6-1-3.1-2.5-3.7l-1.7-0.7l5.2-5.2l1.4,1.4
		c0.8,0.8,1.8,1.2,2.9,1.2c0.9,0,1.8-0.3,2.5-0.9l2.9-2.3C31.1,13.4,31.1,12.8,30.8,12.4z"/>
</g>
</svg>

        </CardDataStats>
        <CardDataStats title="Nombre de reports" total={reports.length.toString()} rate="" >
        <svg fill="#FFFFFF" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16,2 C16.2652165,2 16.5195704,2.10535684 16.7071068,2.29289322 L21.7071068,7.29289322 C21.8946432,7.4804296 22,7.73478351 22,8 L22,15 C22,15.2339365 21.9179838,15.4604694 21.7682213,15.6401844 L16.7682213,21.6401844 C16.5782275,21.868177 16.2967798,22 16,22 L8,22 C7.73478351,22 7.4804296,21.8946432 7.29289322,21.7071068 L2.29289322,16.7071068 C2.10535684,16.5195704 2,16.2652165 2,16 L2,8 C2,7.73478351 2.10535684,7.4804296 2.29289322,7.29289322 L7.29289322,2.29289322 C7.4804296,2.10535684 7.73478351,2 8,2 L16,2 Z M15.5857864,4 L8.41421356,4 L4,8.41421356 L4,15.5857864 L8.41421356,20 L15.5316251,20 L20,14.6379501 L20,8.41421356 L15.5857864,4 Z M12,16 C12.5522847,16 13,16.4477153 13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 C11,16.4477153 11.4477153,16 12,16 Z M12,6 C12.5522847,6 13,6.44771525 13,7 L13,13 C13,13.5522847 12.5522847,14 12,14 C11.4477153,14 11,13.5522847 11,13 L11,7 C11,6.44771525 11.4477153,6 12,6 Z"/>
</svg>
        </CardDataStats>
        <CardDataStats title="Nombre d'entraînements aujourd'hui" total={getTodayTrainingsCount().toString()} rate="" >
        <svg fill="#FFFFFF" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" width="30" height="30"
	 viewBox="0 0 32 32" >
<g>
	<path d="M23,11c2.2,0,4-1.8,4-4s-1.8-4-4-4s-4,1.8-4,4S20.8,11,23,11z"/>
	<path d="M30.8,12.4c-0.3-0.4-1-0.5-1.4-0.2l-2.9,2.3c-0.8,0.7-2,0.6-2.7-0.2l-7.9-7.9c-1.6-1.6-4.1-1.6-5.7,0L7.3,9.3
		c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l2.8-2.8c0.8-0.8,2.1-0.8,2.9,0l1.6,1.6L11.6,14c-1,1-1.4,2.3-1.1,3.7c0.2,1.1,0.9,2,1.8,2.6
		l-1.6,1.6c-0.4,0.4-1,0.4-1.4,0l-3.6-3.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l3.6,3.6c0.6,0.6,1.3,0.9,2.1,0.9s1.6-0.3,2.1-0.9
		l2.1-2.1l2.5,1c0.7,0.3,1.2,1,1.2,1.8v6c0,0.6,0.4,1,1,1s1-0.4,1-1v-6c0-1.6-1-3.1-2.5-3.7l-1.7-0.7l5.2-5.2l1.4,1.4
		c0.8,0.8,1.8,1.2,2.9,1.2c0.9,0,1.8-0.3,2.5-0.9l2.9-2.3C31.1,13.4,31.1,12.8,30.8,12.4z"/>
</g>
</svg>
        </CardDataStats>
        <CardDataStats title="Nombre d'utilisateurs" total={users.length.toString()} rate="" >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7. 2xl:gap-7.5">
        <ChartOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
     
      </div>
    </>
    </DefaultLayout>

  );
};

export default ECommerce;
