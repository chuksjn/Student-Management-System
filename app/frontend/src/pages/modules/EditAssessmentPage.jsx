import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Loader, SelectElement, TextInput } from '../../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getModuleAssessments, updateAssessment } from './api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const EditModuleAssessmentPage = () => {
  const { id: moduleName, student: studentId } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState({
    weight: '',
    mark: '',
    submissionStatus: '',
    markingStatus: '',
  });
  const [student, setStudent] = useState({
    studentId: '',
    studentName: '',
    studentEmail: '',
  });

  const { isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      try {
        const data = await getModuleAssessments(moduleName);
        const [thisOne] = data.data.filter((d) => d['Student ID'] == studentId);
        setAssessment({
          weight: thisOne['Weight/Maximum Grade'],
          mark: thisOne['Mark'],
          submissionStatus: thisOne['Submission Status'],
          markingStatus: thisOne['Weight/Maximum Grade'],
        });
        setStudent({
          studentId: thisOne['Student ID'],
          studentName: thisOne['Student Name'],
          studentEmail: thisOne['Student Email'],
        });
        return data.data.reverse();
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateAssessment({
        assessmentData: {
          ...assessment,
          ...student,
        },
        moduleName,
      }),
    ...{
      onSuccess() {
        toast.success(`Assessted updated successfully`);
        qc.invalidateQueries({ queryKey: ['assessments'] });
        navigate(`/modules/${moduleName}/assessment/`);
      },
      onError() {
        toast.error('error occured sorry');
        return false;
      },
    },
  });

  const handleChange = (e) => {
    setAssessment({ ...assessment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (assessment.submissionStatus == 'No submission - Not marked') {
      setAssessment({ ...assessment, markingStatus: 'Not marked', mark: '' });
    } else if (assessment.markingStatus == 'Not marked') {
      setAssessment({
        ...assessment,
        submissionStatus: 'No submission - Not marked',
        mark: '',
      });
    }
    mutate();
  };

  return isLoading ? (
    <Loader big />
  ) : (
    <div className='flex flex-col p-8'>
      <Link
        className='text-xs underline'
        to={`/modules/${moduleName}/assessment/`}
      >
        Back
      </Link>
      <h1 className='text-3xl mt-6'>
        Edit {student.studentName} Assessment for {moduleName.toUpperCase()}
      </h1>
      <form
        className='max-w-[400px] flex flex-col gap-y-5 mt-6 shrink-0 w-full'
        onSubmit={handleSubmit}
      >
        <TextInput
          placeholder={'add weight'}
          label='Weight/Maximum Grade'
          value={assessment.weight}
          type='number'
          name='weight'
          required
          handleInputChange={handleChange}
        />
        <TextInput
          placeholder={'add mark'}
          label='Mark'
          name='mark'
          value={assessment.mark}
          type='number'
          required
          handleInputChange={handleChange}
        />

        <SelectElement
          placeholder={'select status'}
          label='Submission Status'
          options={[
            {
              label: 'Submitted for grading - Released',
              value: 'Submitted for grading - Released',
            },
            {
              label: 'No submission - Not marked',
              value: 'No submission - Not marked',
            },
          ]}
          value={assessment.submissionStatus}
          name='submissionStatus'
          onChange={handleChange}
        />
        <SelectElement
          placeholder={'select status'}
          label='Marking workflow state'
          options={[
            { label: 'Released', value: 'Released' },
            { label: 'Not marked', value: 'Not marked' },
          ]}
          value={assessment.markingStatus}
          name='markingStatus'
          onChange={handleChange}
        />

        <Button type='submit' label='Update Assessment' loading={isPending} />
      </form>
    </div>
  );
};
