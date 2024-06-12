import { utils, write } from 'xlsx';
import { Button } from '../../components';

export const DashboardPage = () => {
  const mockMarksheetData = [
    {
      studentId: '12345',
      studentName: 'John Doe',
      studentEmail: 'john.doe@example.com',
      course: 'Computer Science',
      tutorGroup: 'Group A',
      module: 'CS101',
      mark: '85',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '12345',
      studentName: 'John Doe',
      studentEmail: 'john.doe@example.com',
      course: 'Computer Science',
      tutorGroup: 'Group A',
      module: 'CS102',
      mark: '92',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '67890',
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      course: 'Information Technology',
      tutorGroup: 'Group B',
      module: 'IT101',
      mark: '78',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '67890',
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      course: 'Information Technology',
      tutorGroup: 'Group B',
      module: 'IT102',
      mark: '88',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '24680',
      studentName: 'Michael Johnson',
      studentEmail: 'michael.johnson@example.com',
      course: 'Software Engineering',
      tutorGroup: 'Group C',
      module: 'SE101',
      mark: '90',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '24680',
      studentName: 'Michael Johnson',
      studentEmail: 'michael.johnson@example.com',
      course: 'Software Engineering',
      tutorGroup: 'Group C',
      module: 'SE102',
      mark: '85',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '13579',
      studentName: 'Emily Brown',
      studentEmail: 'emily.brown@example.com',
      course: 'Data Science',
      tutorGroup: 'Group A',
      module: 'DS101',
      mark: '92',
      maxMark: '100',
      status: 'Submitted',
    },
    {
      studentId: '13579',
      studentName: 'Emily Brown',
      studentEmail: 'emily.brown@example.com',
      course: 'Data Science',
      tutorGroup: 'Group A',
      module: 'DS102',
      mark: '88',
      maxMark: '100',
      status: 'Submitted',
    },
  ];

  const generateMarksheet = () => {
    const worksheet = utils.json_to_sheet(mockMarksheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Marksheet');
    const excelBuffer = write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    saveAsExcelFile(excelBuffer, 'marksheet.xlsx');
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.click();
  };
  return (
    <div className='w-full h-full flex flex-col p-8'>
      <div className='flex items-center w-full justify-between'>
        <h1 className='text-3xl'>Dashboard</h1>
        <Button label='Generate Marksheet' effect={generateMarksheet} />
      </div>
      <div className='mt-6'>
        <h2 className='text-xl'>Quick Overview</h2>
        <div className='grid grid-cols-3 mt-6 gap-5'>
          <div className='flex flex-col text-center items-center p-5 border rounded-lg gap-y-2'>
            <h3 className='font-medium text-xl'>Total Students</h3>
            <p className='text-2xl font-semibold'>123</p>
          </div>
          <div className='flex flex-col text-center items-center p-5 border rounded-lg gap-y-2'>
            <h3 className='font-medium text-xl'>Total Modules</h3>
            <p className='text-2xl font-semibold'>25</p>
          </div>
          <div className='flex flex-col text-center items-center p-5 border rounded-lg gap-y-2'>
            <h3 className='font-medium text-xl'>Total Tutor Groups</h3>
            <p className='text-2xl font-semibold'>8</p>
          </div>
        </div>
      </div>
    </div>
  );
};
