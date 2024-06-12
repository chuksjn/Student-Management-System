import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button, Loader, SelectElement } from '../../components';
import { useQuery } from '@tanstack/react-query';
import { getModuleAssessments, getModules } from '../modules/api';
import toast from 'react-hot-toast';

export const AssessmentReport = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const [assessmentData, setAssessmentData] = useState();
  const [assessmentPieData, setAssessmentPieData] = useState();
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
        const data = await getModuleAssessments(selectedModule);
        const toPush = [];
        if (data.data.length == 0) throw { message: 'No chart data available' };
        data.data.map((d) => {
          if (d['Marking workflow state'] !== 'Released') return;
          toPush.push({
            x: d['Student Name'],
            y: d['Mark'],
            goals: [
              {
                name: 'Pass mark',
                value: 85,
                strokeColor: '#775DD0',
              },
            ],
          });
        });
        const countMarks = data.data.reduce(
          (acc, item) => {
            if (item['Marking workflow state'] === 'Released') {
              acc.released++;
            } else {
              acc.unreleased++;
            }
            return acc;
          },
          { released: 0, unreleased: 0 }
        );
        setAssessmentPieData([countMarks.released, countMarks.unreleased]);
        setAssessmentData([{ data: toPush }]);
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

  // Chart options
  const options = {
    chart: {
      id: 'pie-chart',
    },
    labels: ['Released', 'Unreleased'],
    colors: ['#4CAF50', '#F44336'],
  };

  // Chart series

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <div className='w-full flex flex-col gap-y-2 mt-6'>
        <h1 className='text-3xl'>Assessment Report</h1>
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
        {assessmentData && (
          <div className='w-full flex flex-col shadow-md border rounded-md pt-10 mt-10'>
            <h3 className='text-xl text-center font-semibold'>
              Student Marks(released)
            </h3>
            <ReactApexChart
              options={chartOptions}
              series={assessmentData}
              type='bar'
              height={350}
            />
          </div>
        )}
        {assessmentData && (
          <div className='w-full flex flex-col gap-y-5 shadow-md border rounded-md pt-10 mt-10'>
            <h3 className='text-xl text-center font-semibold'>
              Release/Unreleased Marks
            </h3>
            <ReactApexChart
              options={options}
              series={assessmentPieData}
              type='pie'
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};
