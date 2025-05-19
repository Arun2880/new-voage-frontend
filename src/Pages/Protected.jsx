import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected = ({ Component }) => {
  // const {Component}=props;
  const navigate = useNavigate();
const token = sessionStorage.getItem('token');
useEffect(()=>{


    if (!token) {
      navigate('/');
      return;
    }
})
   

    

  return <Component />;
};

export default Protected;


 