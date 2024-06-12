import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStudents } from '../students/apis';
import { createTutor } from './api';
import toast from 'react-hot-toast';
import { Button, SelectElement, TextInput } from '../../components';

export const AddTutorGroup = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };
  const qc = useQueryClient();
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
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createTutor({
        ...formData,
        code: formData.code.toUpperCase(),
        students,
      }),
    ...{
      onSuccess() {
        toast.success(`${formData.name} created successfully`);
        qc.invalidateQueries({ queryKey: ['tutors'] });
        navigate('/tutor-groups');
      },
      onError() {
        toast.error('error occured sorry');
        return false;
      },
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save the new student data to your data source
    mutate();
  };

  const handleAddStudent = () => {
    if (selectedStudent) {
      if (students.includes(selectedStudent)) {
        toast.error('Cant duplicate student');
        setSelectedStudent('');
      } else {
        setStudents((prev) => [...prev, selectedStudent]);
        setSelectedStudent('');
      }
    }
  };
  const getSelectData = (data) => {
    const list = [];
    if (data?.length == 0) return [];
    data?.map((item) =>
      list.push({ value: item['ID number'], label: item['Full name'] })
    );
    return list;
  };

  const getSelectedStudents = () => {
    const selected = [];
    allStudents?.map((as) => {
      if (students.includes(as['ID number'])) {
        selected.push(as);
      }
    });
    return selected;
  };

  const removeStudent = (id) => {
    setStudents(students.filter((st) => st !== id));
  };
  return (
    <div className='w-full flex flex-col p-8'>
      <Link className='text-xs underline' to='/tutor-groups'>
        Back
      </Link>
      <h1 className='text-2xl mt-6'>Add Module</h1>
      <div className='flex items-start gap-x-20'>
        {' '}
        <form
          className='max-w-[400px] flex flex-col gap-y-5 mt-6 shrink-0 w-full'
          onSubmit={handleSubmit}
        >
          <TextInput
            value={formData.name}
            required
            name={'name'}
            label={'Tutor Name'}
            handleInputChange={handleChange}
          />
          <TextInput
            value={formData.code}
            name={'code'}
            label={'Tutor Code'}
            required
            handleInputChange={handleChange}
          />
          <div className='flex flex-col'>
            <SelectElement
              value={selectedStudent}
              name={'student'}
              label={'Students'}
              placeholder={'select student'}
              onChange={handleStudentChange}
              options={getSelectData(allStudents)}
            />
            <Button label='Add student' effect={handleAddStudent} />
          </div>

          <Button type='submit' label='Submit' loading={isPending} />
        </form>
        {students.length > 0 && (
          <div className='flex flex-col w-full mt-10'>
            <h4 className='font-medium text-xl'>Selected Students</h4>
            <div className='mt-6 grid grid-cols-2 gap-5 w-full'>
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
                    <button
                      onClick={() => {
                        console.log(stu);
                        removeStudent(stu?.['ID number']);
                      }}
                      className='underline text-sm'
                    >
                      Remove
                    </button>
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
