import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Import GIF images from the assets folder
import meet1 from '../assets/meet1.gif';
import meet2 from '../assets/meet2.gif';
import meet3 from '../assets/meet3.gif';

const Hero = () => {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000); // Hide welcome message after 3 seconds
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleStartJourney = () => {
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-filter backdrop-blur-3xl z-0"></div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Main content */}
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              >
                MindQuest
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-6"
              >
                {['About', 'Tips', 'Insights', 'Resources', 'Contact'].map((item, index) => (
                  <Link key={item} to={`#${item.toLowerCase()}`} className="hidden md:inline-block text-gray-300 hover:text-purple-400 transition duration-300">
                    <motion.span
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      {item}
                    </motion.span>
                  </Link>
                ))}
                {user && (
                  <div className="flex items-center space-x-2">
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                    <span className="text-gray-300">{user.displayName}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-6 py-20">
          <section className="min-h-screen flex flex-col justify-center items-center text-center relative">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            >
              Master Your HR Interview
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl"
            >
              Unlock the secrets to acing your human resources interviews with expert insights, cutting-edge tips, and personalized strategies.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6"
            >
              <button 
                onClick={handleStartJourney}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Your Journey
              </button>
              <button className="px-8 py-4 text-lg font-semibold rounded-full bg-transparent border-2 border-purple-400 hover:bg-purple-400 hover:text-gray-900 transition duration-300 transform hover:scale-105 shadow-lg">
                Explore Resources
              </button>
            </motion.div>

            {/* Animated GIFs */}
            <div className="mt-20 grid grid-cols-3 gap-8">
              {[meet1, meet2, meet3].map((gif, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="relative overflow-hidden rounded-2xl shadow-2xl"
                >
                  <img src={gif} alt={`Interview scene ${index + 1}`} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20">
            <div className="grid md:grid-cols-2 gap-12">
              {[
                { title: "Personalized Strategies", content: "Tailor your interview approach with AI-powered insights." },
                { title: "Real-time Practice", content: "Hone your skills with our advanced interview simulation technology." },
                { title: "Expert Insights", content: "Learn from top HR professionals and industry leaders." },
                { title: "Comprehensive Resources", content: "Access a vast library of guides, tips, and best practices." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white/5 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition duration-300"
                >
                  <h2 className="text-2xl font-bold mb-4 text-purple-400">{item.title}</h2>
                  <p className="text-gray-300">{item.content}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-black/30 backdrop-filter backdrop-blur-lg py-8">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400">© 2024 HR Interview Hub. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcome && user && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <p className="font-bold">Hello, {user.displayName}!</p>
            <p>Welcome to HR Interview Hub</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;