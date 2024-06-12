import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/';

export const getStudents = async () => {
  const config = {
    method: 'GET',
    url: `${baseUrl}students`,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    throw err.response;
  }
};
export const getStudent = async (id) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}students/${id}`,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    throw err.response;
  }
};

export const createStudent = async (data) => {
  const config = {
    method: 'POST',
    url: `${baseUrl}students`,
    data,
  };
  try {
    const response = await axios(config);
    return response.data.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    throw err.response;
  }
};
export const deleteStudent = async (id) => {
  const config = {
    method: 'DELETE',
    url: `${baseUrl}students/${id}`,
  };
  try {
    const response = await axios(config);
    return response.data.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    throw err.response;
  }
};
export const updateStudent = async (data, id) => {
  const config = {
    method: 'PUT',
    url: `${baseUrl}students/${id}`,
    data,
  };
  try {
    const response = await axios(config);
    return response.data.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    throw err.response;
  }
};
