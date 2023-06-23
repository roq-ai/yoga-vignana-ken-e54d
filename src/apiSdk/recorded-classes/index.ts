import axios from 'axios';
import queryString from 'query-string';
import { RecordedClassInterface, RecordedClassGetQueryInterface } from 'interfaces/recorded-class';
import { GetQueryInterface } from '../../interfaces';

export const getRecordedClasses = async (query?: RecordedClassGetQueryInterface) => {
  const response = await axios.get(`/api/recorded-classes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRecordedClass = async (recordedClass: RecordedClassInterface) => {
  const response = await axios.post('/api/recorded-classes', recordedClass);
  return response.data;
};

export const updateRecordedClassById = async (id: string, recordedClass: RecordedClassInterface) => {
  const response = await axios.put(`/api/recorded-classes/${id}`, recordedClass);
  return response.data;
};

export const getRecordedClassById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/recorded-classes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRecordedClassById = async (id: string) => {
  const response = await axios.delete(`/api/recorded-classes/${id}`);
  return response.data;
};
