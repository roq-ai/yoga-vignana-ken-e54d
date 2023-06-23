import axios from 'axios';
import queryString from 'query-string';
import { LiveClassInterface, LiveClassGetQueryInterface } from 'interfaces/live-class';
import { GetQueryInterface } from '../../interfaces';

export const getLiveClasses = async (query?: LiveClassGetQueryInterface) => {
  const response = await axios.get(`/api/live-classes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLiveClass = async (liveClass: LiveClassInterface) => {
  const response = await axios.post('/api/live-classes', liveClass);
  return response.data;
};

export const updateLiveClassById = async (id: string, liveClass: LiveClassInterface) => {
  const response = await axios.put(`/api/live-classes/${id}`, liveClass);
  return response.data;
};

export const getLiveClassById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/live-classes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLiveClassById = async (id: string) => {
  const response = await axios.delete(`/api/live-classes/${id}`);
  return response.data;
};
