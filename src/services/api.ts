import axios from 'axios';

export const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export const loginUser = async (name: string, email: string) => {
  return api.post('/auth/login', { name, email });
};

export const fetchBreeds = async () => {
  return api.get<string[]>('/dogs/breeds');
};

export const searchDogs = async (filters = {}) => {
  return api.get('/dogs/search', { params: filters });
};

export const fetchDogDetails = async (dogIds: string[]) => {
  return api.post('/dogs', dogIds);
};

export const matchDog = async (dogIds: string[]) => {
  return api.post('/dogs/match', dogIds);
};


