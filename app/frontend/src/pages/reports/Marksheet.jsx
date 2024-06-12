import { utils, write } from 'xlsx';

export const Marksheet = () => {
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
    <div>
      <h2>Marksheet</h2>
      <button onClick={generateMarksheet}>Generate Marksheet</button>
    </div>
  );
};
