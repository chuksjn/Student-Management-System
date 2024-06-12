import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteModule, getModules } from './api.js';
import { Loader } from '../../components';
import toast from 'react-hot-toast';
export const ModuleList = () => {
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
  const qc = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteModule(id),
    ...{
      onSuccess() {
        toast.success(`module deleted successfully`);
        qc.invalidateQueries({ queryKey: ['modules'] });
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
        <h1 className='text-3xl'>Module List</h1>
        <Link
          className='text-sm font-semibold py-3 px-4 border rounded-lg bg-slate-300 '
          to='/modules/add'
        >
          Add Module
        </Link>
      </div>
      <div className='mt-6 grid grid-cols-4 gap-5'>
        {modules?.map((mod) => (
          <div
            key={mod['Module Code']}
            className='flex flex-col rounded-lg p-4 border'
          >
            <div className='flex items-end w-full justify-between'>
              <div className='flex flex-col '>
                <span>{mod['Module Name']} </span>
                <span className='text-sm text-slate-600 uppercase'>
                  {mod?.['Module Code']}{' '}
                </span>
                <span className='text-sm text-slate-600'>
                  Students: {mod?.['Students'].split(',').length}{' '}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-x-3 mt-3'>
              <Link
                className='underline text-sm'
                to={`/modules/${mod?.['Module Code']}/students`}
              >
                View Students
              </Link>
              <Link
                className='underline text-sm'
                to={`/modules/${mod?.['Module Code']}/students/edit`}
              >
                Add Students
              </Link>
              <button
                onClick={() => {
                  console.log(mod);
                  mutate(mod?.['Module Code']);
                }}
                className='underline text-sm'
              >
                Delete
              </button>
            </div>
            <div className='flex items-center gap-x-3 mt-3'>
              <Link
                className='underline text-sm'
                to={`/modules/${mod?.['Module Code']}/assessment`}
              >
                View Assessment
              </Link>
              <Link
                className='underline text-sm'
                to={`/modules/${mod?.['Module Code']}/details`}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
