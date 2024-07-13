import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';


const SignUp = () => {

  const [name, setName]= useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name){
      setError('Please Enter Your Name');
      return;
    }
    if(!validateEmail(email)){
      setError('Please Enter a Valid Email Address');
      return;
    }

    if(!password){
      setError('Please Enter a Password');
      return;
    }

    setError('')

    //appi call
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password,
      });
      //hangle registration ersponse
      if (response.data && response.data.error) {
        setError(response.data.message);
        return
      }
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
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>SignUp</h4>
            <input 
              type='text' 
              placeholder='Name' 
              className='input-box' 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <button type='submit' className='btn-primary'>Create Account</button>
            <p className='text-sm text-center mt-4'>
              Already have an Account?{' '}
              <Link to='/login' className='font-medium text-primary underline'>
               Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
