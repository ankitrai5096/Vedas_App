// src/redux/authActions.js

export const setUser = (user) => ({
    type: 'SET_USER',
    payload: user,
  });
  
  export const clearUser = () => ({
    type: 'CLEAR_USER',
  });
  

  const SET_USER = 'SET_USER'
  const CLEAR_USER = 'CLEAR_USER'
