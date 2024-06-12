import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Loader, TextArea, TextInput } from '../../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getModuleDetails, updateDetails } from './api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const EditDetailsPage = () => {
  const { id: moduleName, student: studentId } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    attendance: '',
    notes: '',
    checkpoints: '',
  });
  const [student, setStudent] = useState({
    studentId: '',
    studentName: '',
  });

  const { isLoading } = useQuery({
    queryKey: ['details'],
    queryFn: async () => {
      try {
        const data = await getModuleDetails(moduleName);
        const [thisOne] = data.data.filter((d) => d['Student ID'] == studentId);
        setDetails({
          attendance: thisOne['Attendance'],
          notes: thisOne['Notes'],
          checkpoints: thisOne['Checkpoints'],
        });
        setStudent({
          studentId: thisOne['Student ID'],
          studentName: thisOne['Student Name'],
        });
        return data.data.reverse();
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateDetails(
        {
          detailsData: {
            ...details,
            ...student,
          },
        },
        moduleName
      ),
    ...{
      onSuccess() {
        toast.success(`Details updated successfully`);
        qc.invalidateQueries({ queryKey: ['details'] });
        navigate(`/modules/${moduleName}/details/`);
      },
      onError() {
        toast.error('error occured sorry');
        return false;
      },
    },
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    mutate();
  };

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <Link
        className='text-xs underline'
        to={`/modules/${moduleName}/details/`}
      >
        Back
      </Link>
      <h1 className='text-3xl mt-6'>
        Edit {student.studentName} details for {moduleName.toUpperCase()}
      </h1>
      <form
        className='max-w-[400px] flex flex-col gap-y-5 mt-6 shrink-0 w-full'
        onSubmit={handleSubmit}
      >
        <TextInput
          placeholder={'add attendance'}
          label='Attendance(out of 30)'
          value={details.attendance}
          name='attendance'
          type='number'
          required
          {...{ max: 30 }}
          handleInputChange={handleChange}
        />
        <TextInput
          placeholder={'add checkpoints'}
          label='Checkpoint'
          value={details.checkpoints}
          name='checkpoints'
          required
          handleInputChange={handleChange}
        />
        <TextArea
          placeholder={'add notes'}
          label='Notes'
          value={details.notes}
          name='notes'
          handleInputChange={handleChange}
        />

        <Button type='submit' label='Update Details' loading={isPending} />
      </form>
    </div>
  );
};
