import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../students/apis';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Button, Loader, SelectElement } from '../../components';
import { getStudentReport } from './api';
import ReactApexChart from 'react-apexcharts';

export const StudentReport = () => {
  const [student, setStudent] = useState();
  const [attendanceSeries, setReportSeries] = useState();
  const [categories, setCategories] = useState();
  const { data: allStudents, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        const data = await getStudents();

        return data.data.reverse();
      } catch (err) {
        toast.error(err.message);
      }
    },
  });

  const { isLoading: generating, refetch } = useQuery({
    enabled: false,
    queryKey: ['report data', student],
    queryFn: async () => {
      try {
        const data = await getStudentReport(student);
        const attendanceSeries = [
          {
            name: 'Attendance',
            type: 'column',
            data: data.data.map((d) => d.attendance),
          },
          {
            name: 'Marks',
            type: 'column',
            data: data.data.map((d) => d.mark),
            goals: [
              {
                name: 'Pass',
                value: 85,
                strokeColor: '#775DD0',
              },
            ],
          },
          {
            name: 'Class Average',
            type: 'line',
            data: data.data.map((d) => d.moduleAverageMark),
          },
        ];

        const categories = data.data.map((d) => d.moduleName);
        setCategories(categories);
        setReportSeries(attendanceSeries);
        return data.data.reverse();
      } catch (err) {
        toast.error(err.message);
      }
    },
  });

  var options = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#99C2A2', '#C5EDAC', '#66C7F4'],
    stroke: {
      width: [4, 4, 4, 4, 4, 4],
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
      },
    },
    xaxis: {
      categories,
    },
    yaxis: [
      {
        seriesName: 'Marks',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Scores',
        },
      },
      {
        seriesName: 'Attendance',
        show: false,
      },
      {
        opposite: true,
        seriesName: 'Class Average',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Class Average (marks)',
        },
      },
    ],
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  const getSelectData = (data) => {
    const list = [];
    if (data?.length == 0) return [];
    data?.map((item) =>
      list.push({ value: item['ID number'], label: item['Full name'] })
    );
    return list;
  };

  // Chart series

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <div className='w-full flex flex-col gap-y-2 mt-6'>
        <h1 className='text-3xl'>Student Report</h1>
        <p className='text-slate-800 text-lg font-semibold mt-#'>
          Please select a student to generate a report for
        </p>
      </div>
      <div className='flex flex-col mt-8 max-w-[400px] w-full '>
        <SelectElement
          placeholder={'select student'}
          label='Student'
          options={getSelectData(allStudents)}
          name='student'
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        />
        <Button disabled={!student} label='Generate Report' effect={refetch} />
      </div>

      <div id='chart'>
        <div>{generating && <Loader big />}</div>
        {attendanceSeries && (
          <div className='w-full flex flex-col shadow-md border rounded-md pt-10 mt-10'>
            <h3 className='text-xl text-center font-semibold'>Student Marks</h3>
            <ReactApexChart
              options={options}
              series={attendanceSeries}
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};
