import * as yup from 'yup';

export const courseValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  organization_id: yup.string().nullable(),
});
