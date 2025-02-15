import * as Yup from 'yup';

export const logInSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Please input valid email address'),
  password: Yup.string().required('Please input password').min(6, 'Minimun 6 digits'),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().required('Please input user name').min(3, 'Minimun 3 digits'),
  email: Yup.string().required('Email is required').email('Please input valid email address'),
  password: Yup.string().required('Please input password').min(6, 'Minimun 6 digits'),
  confirmPassword: Yup.string()
    .required('Please confirm password')
    .oneOf([Yup.ref('password')], 'Password is invalid'),
});
