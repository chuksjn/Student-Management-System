import { useQuery } from '@tanstack/react-query';
import { getModuleDetails, getModules } from '../modules/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Loader, SelectElement } from '../../components';
import ReactApexChart from 'react-apexcharts';

export const AttendanceReport = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const [attendanceData, setAttendanceData] = useState();
  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      try {
        const data = await getModules();
        return data.data.reverse();
      } catch (err) {
        console.error(err.message);
      }
    },
  });
  const { isLoading: generating, refetch } = useQuery({
    enabled: false,
    queryKey: ['assessments', selectedModule],
    queryFn: async () => {
      try {
        const data = await getModuleDetails(selectedModule);
        const toPush = [];
        if (data.data.length == 0) throw { message: 'No chart data available' };
        data.data.map((d) => {
          toPush.push({
            x: d['Student Name'],
            y: d['Attendance'],
            goals: [
              {
                name: 'Required Attendance',
                value: 20,
                strokeColor: '#775DD0',
              },
            ],
          });
        });

        setAttendanceData([{ data: toPush }]);
        return data.data.reverse();
      } catch (err) {
        toast.error(err.message);
      }
    },
  });

  const chartOptions = {
    chart: {
      height: 380,
      width: '100%',
      type: 'bar',
    },
  };

  const getSelectData = (data) => {
    const list = [];
    if (data?.length == 0) return [];
    data?.map((item) =>
      list.push({ value: item['Module Code'], label: item['Module Name'] })
    );
    return list;
  };

  // Chart series

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <div className='w-full flex flex-col gap-y-2 mt-6'>
        <h1 className='text-3xl'>Attendance Report</h1>
        <p className='text-slate-800 text-lg font-semibold mt-#'>
          Please select a module to generate a report for
        </p>
      </div>
      <div className='flex flex-col mt-8 max-w-[400px] w-full '>
        <SelectElement
          placeholder={'select module'}
          label='Module'
          options={getSelectData(modules)}
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        />
        <Button
          disabled={!selectedModule}
          label='Generate Report'
          effect={refetch}
        />
      </div>

      <div id='chart'>
        <div>{generating && <Loader big />}</div>
        {attendanceData && (
          <div className='w-full flex flex-col shadow-md border rounded-md pt-10 mt-10'>
            <h3 className='text-xl text-center font-semibold'>
              Student Attendance
            </h3>
            <ReactApexChart
              options={chartOptions}
              series={attendanceData}
              type='bar'
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};
