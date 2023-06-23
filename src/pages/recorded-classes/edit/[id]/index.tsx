import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRecordedClassById, updateRecordedClassById } from 'apiSdk/recorded-classes';
import { Error } from 'components/error';
import { recordedClassValidationSchema } from 'validationSchema/recorded-classes';
import { RecordedClassInterface } from 'interfaces/recorded-class';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CourseInterface } from 'interfaces/course';
import { getCourses } from 'apiSdk/courses';

function RecordedClassEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RecordedClassInterface>(
    () => (id ? `/recorded-classes/${id}` : null),
    () => getRecordedClassById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RecordedClassInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRecordedClassById(id, values);
      mutate(updated);
      resetForm();
      router.push('/recorded-classes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RecordedClassInterface>({
    initialValues: data,
    validationSchema: recordedClassValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Recorded Class
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="video_url" mb="4" isInvalid={!!formik.errors?.video_url}>
              <FormLabel>Video Url</FormLabel>
              <Input type="text" name="video_url" value={formik.values?.video_url} onChange={formik.handleChange} />
              {formik.errors.video_url && <FormErrorMessage>{formik.errors?.video_url}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CourseInterface>
              formik={formik}
              name={'course_id'}
              label={'Select Course'}
              placeholder={'Select Course'}
              fetcher={getCourses}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'recorded_class',
  operation: AccessOperationEnum.UPDATE,
})(RecordedClassEditPage);
