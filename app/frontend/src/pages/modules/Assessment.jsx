import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '../../components';
import { getModuleAssessments } from './api';

export const ModuleAssessmentPage = () => {
  const { id: moduleName } = useParams();
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      try {
        const data = await getModuleAssessments(moduleName);
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
        <h1 className='text-3xl'>Assessment for {moduleName.toUpperCase()}</h1>
        <Link
          className='text-sm font-semibold py-3 px-4 border rounded-lg bg-slate-300 '
          to='add'
        >
          Add Assessment
        </Link>
      </div>

      {assessments && assessments.length > 0 ? (
        <div className='mt-6 grid grid-cols-4 gap-5'>
          {assessments.map((ass, index) => (
            <div key={index} className='flex flex-col rounded-lg p-4 border'>
              <div className='flex items-end w-full justify-between'>
                <div className='flex flex-col '>
                  <span>{ass['Student Name']} </span>
                  <span className='text-sm text-slate-600'>
                    Student Id: {ass?.['Student ID']}{' '}
                  </span>
                  <span className='text-sm text-slate-600'>
                    Mark: {ass?.['Mark']}/{ass['Weight/Maximum Grade']}{' '}
                  </span>
                  <span className='text-sm text-slate-600'>
                    Staus: {ass?.['Submission Status']}{' '}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-x-3 mt-3'>
                <Link
                  className='underline text-sm'
                  to={`/modules/${moduleName}/assessment/edit/${ass?.['Student ID']}`}
                >
                  Edit Assessment
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        'No assessments added'
      )}
    </div>
  );
};
