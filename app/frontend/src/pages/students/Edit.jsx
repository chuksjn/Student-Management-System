import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Loader, SelectElement, TextInput } from '../../components';
import { useState } from 'react';
import { getStudent, updateStudent } from './apis';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    tutor: '',
    modules: '',
    course: '',
  });

  const { data: student, isLoading } = useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      try {
        const data = await getStudent(id);
        setFormData({
          name: data.data['Full name'],
          email: data.data['Email address'],
          id: data.data['ID number'],
          tutor: data.data['Tutor Group'],
          modules: data.data['Modules'],
          course: data.data['Course'],
        });
        return data.data;
      } catch (err) {
        console.error(err.message);
      }
    },
  });
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => updateStudent({ ...formData }, id),
    ...{
      onSuccess() {
        toast.success(`Student updated successfully`);
        qc.invalidateQueries({ queryKey: ['students'] });
        navigate('/students');
      },
      onError() {
        toast.error('error occured sorry');
        return false;
      },
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(id);
    // Add logic to save the new student data to your data source
    mutate();
  };

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='w-full flex flex-col p-8'>
      <Link className='text-xs underline' to='/students'>
        Back
      </Link>
      <h1 className='text-2xl mt-6'>Edit {student['Full name']}</h1>
      <form
        className='max-w-[400px] flex flex-col gap-y-5 mt-6'
        onSubmit={handleSubmit}
      >
        <TextInput
          value={formData.name}
          required
          name={'name'}
          label={'Full name'}
          handleInputChange={handleChange}
        />
        <TextInput
          value={formData.email}
          name={'email'}
          label={'Email'}
          required
          type='email'
          handleInputChange={handleChange}
        />
        <SelectElement
          value={formData.course}
          name={'course'}
          label={'Course'}
          required
          placeholder={'select course'}
          onChange={handleChange}
          options={[
            {
              label: 'Bachelor of Science with Honours Computer Science',
              value: 'Bachelor of Science with Honours Computer Science',
            },
            {
              label: 'Bachelor of Science with Honours Cyber Security',
              value: 'Bachelor of Science with Honours Cyber Security',
            },
          ]}
        />

        <Button type='submit' label='Submit' loading={isPending} />
      </form>
    </div>
  );
};
