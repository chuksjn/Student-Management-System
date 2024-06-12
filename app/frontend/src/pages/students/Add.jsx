import { useState } from 'react';
import { Button, SelectElement, TextInput } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from './apis';

export const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    tutor: '',
    course: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => createStudent({ ...formData }),
    ...{
      onSuccess() {
        toast.success(`${formData.name} created successfully`);
        qc.invalidateQueries({ queryKey: ['students'] });
        navigate('/students');
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

  return (
    <div className='w-full flex flex-col p-8'>
      <Link className='text-xs underline' to='/students'>
        Back
      </Link>
      <h1 className='text-2xl mt-6'>Add Student</h1>
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
        <TextInput
          value={formData.id}
          name={'id'}
          required
          label={'Student Id'}
          handleInputChange={handleChange}
        />

        <Button type='submit' label='Submit' loading={isPending} />
      </form>
    </div>
  );
};
