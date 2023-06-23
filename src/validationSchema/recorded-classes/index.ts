import * as yup from 'yup';

export const recordedClassValidationSchema = yup.object().shape({
  name: yup.string().required(),
  video_url: yup.string().required(),
  course_id: yup.string().nullable(),
});
