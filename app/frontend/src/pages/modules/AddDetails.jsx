import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addDetails, getModule } from './api';
import { getStudents } from '../students/apis';
import toast from 'react-hot-toast';
import {
  Button,
  Loader,
  SelectElement,
  TextArea,
  TextInput,
} from '../../components';

export const AddDetails = () => {
  const { id: moduleName } = useParams();
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
  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  const handleStudentChange = (e) => {
    setStudent({
      studentId: e.target.value,
      studentName: getStudent(e.target.value).name,
      studentEmail: getStudent(e.target.value).email,
    });
  };

  const { isLoading } = useQuery({
    queryKey: ['modules', moduleName],
    queryFn: async () => {
      try {
        const data = await getModule(moduleName);
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

  const getStudent = (id) => {
    const [selected] = allStudents.filter((stu) => id == stu['ID number']);

    return { name: selected['Full name'], email: selected['Email address'] };
  };

  const getSelectData = (data) => {
    const list = [];
    if (data?.length == 0) return [];
    data?.map(
      (item) =>
        students.includes(item['ID number']) &&
        list.push({ value: item['ID number'], label: item['Full name'] })
    );
    return list;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      addDetails(
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
        toast.success(`Details added successfully`);
        qc.invalidateQueries({ queryKey: ['details'] });
        navigate(`/modules/${moduleName}/details`);
      },
      onError(err) {
        toast.error(err.data ? err.data.message : err.message);
        return false;
      },
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    mutate();
  };

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <Link className='text-xs underline' to={`/modules/${moduleName}/details`}>
        Back
      </Link>
      <h1 className='text-3xl mt-6'>
        Add Details for {moduleName.toUpperCase()}
      </h1>
      <form
        className='max-w-[400px] flex flex-col gap-y-5 mt-6 shrink-0 w-full'
        onSubmit={handleSubmit}
      >
        <SelectElement
          placeholder={'select student'}
          label='Student'
          options={getSelectData(allStudents)}
          name='student'
          value={student.studentId}
          onChange={handleStudentChange}
        />
        <TextInput
          placeholder={'add attendance'}
          label='Attendance(out of 30)'
          value={details.attendance}
          name='attendance'
          type='number'
          required
          handleInputChange={handleChange}
          {...{ max: 30 }}
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

        <Button type='submit' label='Add Details' loading={isPending} />
      </form>
    </div>
  );
};
