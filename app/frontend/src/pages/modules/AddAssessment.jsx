import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStudents } from '../students/apis';
import { Button, Loader, SelectElement, TextInput } from '../../components';
import { addAssessment, getModule } from './api';
import toast from 'react-hot-toast';

export const AddModuleAssessment = () => {
  const { id: moduleName } = useParams();
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
  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    setAssessment({ ...assessment, [e.target.name]: e.target.value });
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
      addAssessment({
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
        Add Assessment for {moduleName.toUpperCase()}
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

        <Button type='submit' label='Add Assessment' loading={isPending} />
      </form>
    </div>
  );
};
