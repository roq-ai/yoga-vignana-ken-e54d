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
import { getLiveClassById, updateLiveClassById } from 'apiSdk/live-classes';
import { Error } from 'components/error';
import { liveClassValidationSchema } from 'validationSchema/live-classes';
import { LiveClassInterface } from 'interfaces/live-class';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CourseInterface } from 'interfaces/course';
import { getCourses } from 'apiSdk/courses';

function LiveClassEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LiveClassInterface>(
    () => (id ? `/live-classes/${id}` : null),
    () => getLiveClassById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: LiveClassInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateLiveClassById(id, values);
      mutate(updated);
      resetForm();
      router.push('/live-classes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<LiveClassInterface>({
    initialValues: data,
    validationSchema: liveClassValidationSchema,
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
            Edit Live Class
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
            <FormControl id="start_time" mb="4">
              <FormLabel>Start Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.start_time ? new Date(formik.values?.start_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('start_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="end_time" mb="4">
              <FormLabel>End Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.end_time ? new Date(formik.values?.end_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('end_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
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
  entity: 'live_class',
  operation: AccessOperationEnum.UPDATE,
})(LiveClassEditPage);
