import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteStudent, getStudents } from './apis';
import { Loader } from '../../components';
import toast from 'react-hot-toast';
export const StudentList = () => {
  const { data: students, isLoading } = useQuery({
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
  const qc = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteStudent(id),
    ...{
      onSuccess() {
        toast.success(`Student deleted successfully`);
        qc.invalidateQueries({ queryKey: ['students'] });
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
        <h1 className='text-3xl'>Student List</h1>
        <Link
          className='text-sm font-semibold py-3 px-4 border rounded-lg bg-slate-300 '
          to='/students/add'
        >
          Add Student
        </Link>
      </div>
      <div className='mt-6 grid grid-cols-4 gap-5'>
        {students?.map((stu) => (
          <div
            key={stu['ID number']}
            className='flex flex-col rounded-lg p-4 border'
          >
            <div className='w-full flex items-center justify-between'>
              <span>Student {stu['ID number']}</span>
              <Link
                className='underline text-sm'
                to={`/students/edit/${stu?.['ID number']}`}
              >
                Edit
              </Link>
            </div>
            <div className='flex items-end w-full justify-between'>
              <div className='flex flex-col mt-3'>
                <span>{stu['Full name']} </span>
                <span className='text-sm text-slate-600'>
                  {stu?.['Email address']}{' '}
                </span>
              </div>
              <button
                onClick={() => {
                  console.log(stu);
                  mutate(stu?.['ID number']);
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
