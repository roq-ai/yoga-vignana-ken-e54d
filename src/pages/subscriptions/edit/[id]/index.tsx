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
import { getSubscriptionById, updateSubscriptionById } from 'apiSdk/subscriptions';
import { Error } from 'components/error';
import { subscriptionValidationSchema } from 'validationSchema/subscriptions';
import { SubscriptionInterface } from 'interfaces/subscription';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { CourseInterface } from 'interfaces/course';
import { getUsers } from 'apiSdk/users';
import { getCourses } from 'apiSdk/courses';

function SubscriptionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SubscriptionInterface>(
    () => (id ? `/subscriptions/${id}` : null),
    () => getSubscriptionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SubscriptionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSubscriptionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/subscriptions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SubscriptionInterface>({
    initialValues: data,
    validationSchema: subscriptionValidationSchema,
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
            Edit Subscription
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
            <FormControl id="start_date" mb="4">
              <FormLabel>Start Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.start_date ? new Date(formik.values?.start_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('start_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="end_date" mb="4">
              <FormLabel>End Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.end_date ? new Date(formik.values?.end_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('end_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
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
  entity: 'subscription',
  operation: AccessOperationEnum.UPDATE,
})(SubscriptionEditPage);
