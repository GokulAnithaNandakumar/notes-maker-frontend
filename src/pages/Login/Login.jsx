import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('testuser@gmail.com');
  const [password, setPassword] = useState('testuser@123');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please Enter a Valid Email Address');
      return;
    }

    if (!password) {
      setError('Please Enter a Password');
      return;
    }

    setError('');
    // Login API call
    try {
      const response = await axiosInstance.post('/login', {
        email: email,
        password: password,
      });
      // Handle login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>
            <input 
              type='text' 
              placeholder='Email' 
              className='input-box' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
            {error && <p className='text-xs text-red-500 pb-1'>{error}</p>}
            <button type='submit' className='btn-primary'>Login</button>
            <p className='text-sm text-center mt-4'>
              Not registered yet?{' '}
              <Link to='/signup' className='font-medium text-primary underline'>
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
