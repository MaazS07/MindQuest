import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { FaGoogle } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Login successful!');
      setTimeout(() => navigate('/interview'), 1000);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Google login successful!');
      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b flex items-center justify-center from-black to-purple-900 text-white p-8">

      <div className="w-full max-w-md p-6 bg-gray-900 rounded-2xl border border-purple-500 shadow-2xl backdrop-blur-lg">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-purple-500 text-center mb-6 tracking-widest"
        >
          <IoMdPerson className="inline-block text-5xl mr-2 text-glow" />
         | MindQuest | Login
        </motion.h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AiOutlineMail className="absolute left-4 top-3 h-6 w-6 text-purple-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-10 py-3 bg-gray-800 border border-purple-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 shadow-glow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AiOutlineLock className="absolute left-4 top-3 h-6 w-6 text-purple-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-10 py-3 bg-gray-800 border border-purple-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 shadow-glow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-transform duration-300 shadow-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>

        <div className="flex items-center justify-center my-5">
          <span className="text-purple-400">or</span>
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          className="w-full py-3 flex justify-center items-center bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </motion.button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white font-semibold"
            style={{
              backgroundColor: toast.type === 'error' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(16, 185, 129, 0.9)',
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
