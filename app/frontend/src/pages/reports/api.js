import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/';

export const getStudentReport = async (studentId) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}/student-report/${studentId}`,
  };
  try {
    const response = await axios(config);
    console.log(response);
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    throw err.response;
  }
};
