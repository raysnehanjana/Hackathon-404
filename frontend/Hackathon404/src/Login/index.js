import React, { useState, useEffect } from 'react';
import { getFetch, postFetch } from '../utils/fetchAPI';
import LoginComponent from './loginComponent';
import { useAccessDispatch } from '../utils/AppContext/loginContext';

export default function Login({ navigation }) {
  const [stateData, setStateData] = useState({
    emailId: '',
    password: '',
    hotelName: '',
    hotelId: 0,
    listOfServices: [],
    passwordError: false,
    emailIdError: false,
    loginError: false,
  });
  const dispatch = useAccessDispatch();

  useEffect(() => {
    getFetch('fetchHotelDetails')
      .then(lists => {
        lists.forEach(list => {
          if (list.hotelId === 1234) {
            setStateData(state => ({
              ...state,
              hotelName: list.hotemName,
              hotelId: list.hotelId,
              listOfServices: list.listOfServices,
            }));
          }
        });
      })
      .catch(err => console.log(err));
  }, []);

  const onChangeText = (text, name) => {
    const nameField = `${name}Error`;
    if (text === '') {
      setStateData(state => ({
        ...state,
        [nameField]: true,
      }));
    } else {
      setStateData(state => ({
        ...state,
        [nameField]: false,
      }));
    }
    setStateData(state => ({ ...state, [name]: text }));
  };

  const _login = () => {
    if (stateData.emailId === '') {
      setStateData(state => ({
        ...state,
        emailIdError: true,
      }));
    } else if (stateData.password === '') {
      setStateData(state => ({
        ...state,
        passwordError: true,
      }));
    } else {
      const body = {
        userId: stateData.emailId,
        password: stateData.password,
      };

      postFetch(
        'fetchUserDetailsById',
        body,
      ).then(response => {
        if (response.status === 'Failed') {
          dispatch({ type: 'logout', payload: '' });
          setStateData((state) => ({
            ...state,
            loginError: true,
          }));
        }
        else {
          dispatch({ type: 'login', payload: response.userId });
          console.log('response', response);
          setStateData((state) => ({
            ...state,
            emailId: '',
            password: '',
            loginError: false,
          }));
          switch (response.userType) {
            case 'HOTEL_ADMIN': navigation.navigate('AdminDashboard', { hotelId: stateData.hotelId, listOfServices: stateData.listOfServices });
              break;
            case 'GUEST': navigation.navigate('Dashboard', { hotelId: stateData.hotelId, listOfServices: stateData.listOfServices });
              break;
            case 'SUPER_ADMIN': navigation.navigate('Dashboard', { hotelId: stateData.hotelId, listOfServices: stateData.listOfServices });
              break;
          }
        }
      });
    }
  };
  const backToPage = () => {
    navigation.goBack();
  };

  return (
    <LoginComponent
      onChangeText={onChangeText}
      backToPage={backToPage}
      _login={_login}
      emailIdError={stateData.emailIdError}
      passwordError={stateData.passwordError}
      loginError={stateData.loginError}
      emailId={stateData.emailId}
      password={stateData.password}
    />
  );
}
