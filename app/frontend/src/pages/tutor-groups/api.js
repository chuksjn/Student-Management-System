import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/';

export const getTutors = async () => {
  const config = {
    method: 'GET',
    url: `${baseUrl}tutors`,
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
export const getTutor = async (id) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}tutors/${id}`,
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

export const createTutor = async (data) => {
  const config = {
    method: 'POST',
    url: `${baseUrl}tutors`,
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
export const deleteTutor = async (id) => {
  const config = {
    method: 'DELETE',
    url: `${baseUrl}tutors/${id}`,
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
export const updateTutor = async (data, id) => {
  const config = {
    method: 'PUT',
    url: `${baseUrl}tutors/${id}`,
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
