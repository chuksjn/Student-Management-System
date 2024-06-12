import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTutor, getTutors } from './api';
import toast from 'react-hot-toast';
import { Loader } from '../../components';
import { Link } from 'react-router-dom';

export const TutorGroupList = () => {
  const { data: tutors, isLoading } = useQuery({
    queryKey: ['tutors'],
    queryFn: async () => {
      try {
        const data = await getTutors();
        return data.data.reverse();
      } catch (err) {
        console.error(err.message);
      }
    },
  });
  const qc = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteTutor(id),
    ...{
      onSuccess() {
        toast.success(`tutor deleted successfully`);
        qc.invalidateQueries({ queryKey: ['tutors'] });
      },
      onError() {
        toast.error('error occured sorry');
        return false;
      },
    },
  });
  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <div className='w-full flex items-center justify-between'>
        <h1 className='text-3xl'>Tutor Group List</h1>
        <Link
          className='text-sm font-semibold py-3 px-4 border rounded-lg bg-slate-300 '
          to='/tutor-groups/add'
        >
          Add Tutor
        </Link>
      </div>
      <div className='mt-6 grid grid-cols-4 gap-5'>
        {tutors?.map((tut) => (
          <div
            key={tut['Tutor Code']}
            className='flex flex-col rounded-lg p-4 border'
          >
            <div className='flex items-end w-full justify-between'>
              <div className='flex flex-col '>
                <span>{tut['Tutor Name']} </span>
                <span className='text-sm text-slate-600 uppercase'>
                  {tut?.['Tutor Code']}{' '}
                </span>
                <span className='text-sm text-slate-600'>
                  Students: {tut?.['Students'].split(',').length}{' '}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-x-3 mt-3'>
              <Link
                className='underline text-sm'
                to={`/tutor-groups/${tut?.['Tutor Code']}/students`}
              >
                View Students
              </Link>
              <Link
                className='underline text-sm'
                to={`/tutor-groups/${tut?.['Tutor Code']}/students/edit`}
              >
                Add Students
              </Link>
              <button
                onClick={() => {
                  mutate(tut?.['Tutor Code']);
                }}
                className='underline text-sm'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
