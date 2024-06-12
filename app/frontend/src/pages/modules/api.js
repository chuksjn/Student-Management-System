import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/';

export const getModules = async () => {
  const config = {
    method: 'GET',
    url: `${baseUrl}modules`,
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
export const getModule = async (id) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}modules/${id}`,
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
export const getModuleAssessments = async (moduleName) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}assessments/${moduleName}`,
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
export const getModuleDetails = async (moduleName) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}details/${moduleName}`,
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

export const createModule = async (data) => {
  const config = {
    method: 'POST',
    url: `${baseUrl}modules`,
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
export const deleteModule = async (id) => {
  const config = {
    method: 'DELETE',
    url: `${baseUrl}modules/${id}`,
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
export const updateModule = async (data, id) => {
  const config = {
    method: 'PUT',
    url: `${baseUrl}modules/${id}`,
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
export const addAssessment = async (data) => {
  const config = {
    method: 'POST',
    url: `${baseUrl}assessments`,
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
export const updateAssessment = async (data) => {
  const config = {
    method: 'PUT',
    url: `${baseUrl}assessments`,
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
export const addDetails = async (data, moduleName) => {
  const config = {
    method: 'POST',
    url: `${baseUrl}details/${moduleName}`,
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
export const updateDetails = async (data, moduleName) => {
  const config = {
    method: 'PUT',
    url: `${baseUrl}details/${moduleName}`,
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
