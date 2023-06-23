import * as yup from 'yup';

export const liveClassValidationSchema = yup.object().shape({
  name: yup.string().required(),
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  course_id: yup.string().nullable(),
});
