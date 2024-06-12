import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '../../components';
import { getModuleDetails } from './api';

export const ModuleDeatils = () => {
  const { id: moduleName } = useParams();
  const { data: details, isLoading } = useQuery({
    queryKey: ['details'],
    queryFn: async () => {
      try {
        const data = await getModuleDetails(moduleName);
        return data.data.reverse();
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <Link className='text-xs underline' to={`/modules`}>
        Back to modules
      </Link>
      <div className='w-full flex items-center justify-between mt-6'>
        <h1 className='text-3xl'>Details for {moduleName.toUpperCase()}</h1>
        <Link
          className='text-sm font-semibold py-3 px-4 border rounded-lg bg-slate-300 '
          to='add'
        >
          Add Student Detail
        </Link>
      </div>

      {details && details.length > 0 ? (
        <div className='mt-6 grid grid-cols-4 gap-5'>
          {details.map((det, index) => (
            <div key={index} className='flex flex-col rounded-lg p-4 border'>
              <div className='flex items-end w-full justify-between'>
                <div className='flex flex-col '>
                  <span>{det['Student Name']} </span>
                  <span className='text-sm text-slate-600'>
                    Student Id: {det?.['Student ID']}{' '}
                  </span>
                  <span className='text-sm text-slate-600'>
                    Attendance: {det?.['Attendance']}/ 30 times
                  </span>
                  <span className='text-sm text-slate-600'>
                    Notes: {det?.['Notes']}{' '}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-x-3 mt-3'>
                <Link
                  className='underline text-sm'
                  to={`/modules/${moduleName}/details/edit/${det?.['Student ID']}`}
                >
                  Edit Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        'No details added'
      )}
    </div>
  );
};
