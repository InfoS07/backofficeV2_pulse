"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import axios from "axios";
import React, { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
  },
};

interface Training {
  id: number;
  title: string;
  description: string;
  created_at: string;
  repetitions: number;
  author_id: number;
}

const ChartOne = () => {
  const [series, setSeries] = useState([{ name: 'Nombre d\'entrainements', data: [] as { x: string; y: number }[] }]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get('/api/trainings');
        if (response.data && Array.isArray(response.data.trainings)) {
          const trainings = response.data.trainings;
          const trainingsByDate: { [key: string]: number } = {};

          trainings.forEach((training: Training) => {
            const date = new Date(training.created_at).toISOString().split('T')[0];
            if (trainingsByDate[date]) {
              trainingsByDate[date]++;
            } else {
              trainingsByDate[date] = 1;
            }
          });

          const dates = Object.keys(trainingsByDate).sort();
          const startDate = new Date(dates[0]);
          const endDate = new Date(dates[dates.length - 1]);

          const seriesData: { x: string; y: number }[] = [];
          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dateString = date.toISOString().split('T')[0];
            seriesData.push({
              x: dateString,
              y: trainingsByDate[dateString] || 0
            });
          }

          setSeries([{ name: 'Total Trainings', data: seriesData }]);
        } else {
          console.error('Trainings non trouvés');
        }
      } catch (error) {
        console.error('Échec de la récupération des trainings');
        console.error('Failed to fetch trainings:', error);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-300">
              <p className="font-semibold text-primary">Entrainements</p>
              <p className="text-sm font-medium">Par date</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
         
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
