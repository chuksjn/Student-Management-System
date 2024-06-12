import { Loader } from '../../components';
import { getModule } from './api';
import { getStudents } from '../students/apis';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

export const ViewModule = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  const { data: module, isLoading } = useQuery({
    queryKey: ['modules', id],
    queryFn: async () => {
      try {
        const data = await getModule(id);
        setStudents(data.data['Students'].split(','));
        return data.data;
      } catch (err) {
        console.error(err.message);
      }
    },
  });
  const { data: allStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        const data = await getStudents();
        return data.data.reverse();
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  const getSelectedStudents = () => {
    const selected = [];
    allStudents?.map((as) => {
      if (students.includes(as['ID number'])) {
        selected.push(as);
      }
    });
    return selected;
  };

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='w-full flex flex-col p-8'>
      <Link className='text-xs underline' to='/modules'>
        Back
      </Link>
      <h1 className='text-2xl mt-6 font-semibold'>{module['Module Name']} </h1>
      <h2 className='text-xl mt-6 uppercase'>{module['Module Code']} </h2>

      <div className='flex items-start gap-x-20'>
        {' '}
        {students.length > 0 && (
          <div className='flex flex-col w-full mt-10'>
            <h4 className='font-medium text-xl'>Module Students</h4>
            <div className='mt-6 grid grid-cols-3 gap-5 w-full'>
              {getSelectedStudents()?.map((stu) => (
                <div
                  key={stu['ID number']}
                  className='flex flex-col rounded-lg p-4 border'
                >
                  <div className='w-full flex items-center justify-between'>
                    <span>Student {stu['ID number']}</span>
                  </div>
                  <div className='flex items-end w-full justify-between'>
                    <div className='flex flex-col mt-3'>
                      <span>{stu['Full name']} </span>
                      <span className='text-sm text-slate-600'>
                        {stu?.['Email address']}{' '}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
