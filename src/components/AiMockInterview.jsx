import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { auth } from '../firebaseConfig';
import { createAvatar } from '@dicebear/avatars';
import * as avataarStyle from '@dicebear/avatars-avataaars-sprites';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMicrophone, FaKeyboard, FaPlay, FaStop, FaPaperPlane, FaRobot, FaUser, FaInfoCircle, FaCog, FaBrain } from 'react-icons/fa';
import { RiOpenaiLine } from "react-icons/ri";

// Import your skills array here
// import { skills } from './skillsData';
const skills = [
    "Software Engineering", "Data Science", "Machine Learning", "Web Development",
    "Mobile App Development", "Cloud Computing", "DevOps", "Cybersecurity",
    "Artificial Intelligence", "Blockchain", "IoT", "Big Data",
    "UI/UX Design", "Product Management", "Digital Marketing", "Content Writing",
    "Graphic Design", "Video Editing", "3D Modeling", "Game Development",
    "Network Administration", "Database Management", "Business Intelligence",
    "Data Analytics", "Project Management", "Agile Methodologies", "Scrum",
    "Technical Writing", "Quality Assurance", "Software Testing",
    "Front-end Development", "Back-end Development", "Full-stack Development",
    "API Development", "Microservices", "Containerization", "Serverless Computing",
    "Natural Language Processing", "Computer Vision", "Robotics",
    "Virtual Reality", "Augmented Reality", "Embedded Systems", "Linux Administration",
    "Windows Server Administration", "Network Security", "Penetration Testing",
    "Ethical Hacking", "Cryptography", "Quantum Computing", "Other"
  ];

const AIMockInterview = () => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [grade, setGrade] = useState(null);
  const [user, setUser] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const [avatarSvg, setAvatarSvg] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const typingRef = useRef(null);
  

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (botResponse) {
      setIsTalking(true);
      setTimeout(() => setIsTalking(false), 3000);
    }
  }, [botResponse]);

  useEffect(() => {
    const svg = createAvatar(avataarStyle, {
      seed: 'AI HR',
      mouth: isTalking ? 'smile' : 'serious',
    });
    setAvatarSvg(svg);
  }, [isTalking]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsVideoOn(true);
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      toast.error("Failed to access camera. Please check your permissions.");
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsVideoOn(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-red-500">Browser doesn't support speech recognition.</span>;
  }

  const handleStartInterview = async () => {
    const domain = selectedDomain === 'Other' ? customDomain : selectedDomain;
    if (!domain) {
      toast.error('Please select a domain or enter a custom one.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/start_interview', {
        topic: domain
      });
      setSessionId(response.data.session_id);
      setCurrentQuestion(response.data.question);
      setIsInterviewStarted(true);
      startVideo();
      setBotResponse(response.data.question);
      toast.success('Interview started successfully!');
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopInterview = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_report/${sessionId}`);
      setGrade(response.data.final_grade);
      setFullReport(response.data);
      setIsInterviewStarted(false);
      SpeechRecognition.stopListening();
      stopVideo();
      setTypedResponse('');
      toast.success('Interview completed successfully!');
      
      // Store the full report in localStorage
      localStorage.setItem('interviewReport', JSON.stringify(response.data));
    } catch (error) {
      console.error("Error getting report:", error);
      toast.error('Failed to get interview report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSpeaking = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setIsTyping(false);
    toast.info('Listening... Speak now.');
  };

  const handleStopSpeaking = () => {
    SpeechRecognition.stopListening();
    handleSubmitResponse(transcript);
  };

  const handleStartTyping = () => {
    setIsTyping(true);
    SpeechRecognition.stopListening();
    if (typingRef.current) typingRef.current.focus();
  };

  const handleStopTyping = () => {
    handleSubmitResponse(typedResponse);
  };

  const handleSubmitResponse = async (answer) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/answer_question', {
        session_id: sessionId,
        answer: answer
      });
      if (response.data.question) {
        setCurrentQuestion(response.data.question);
        setBotResponse(response.data.question);
        toast.success('Response submitted successfully!');
      } else {
        handleStopInterview();
      }
      setTypedResponse('');
      resetTranscript();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error('Failed to submit response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <h1 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        AI Mock Interview
      </h1>
      
      {!isInterviewStarted ? (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-black bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-semibold mb-4 flex items-center">
                <FaBrain className="mr-2 text-purple-400" />
                Select Interview Domain
              </h2>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500"
              >
                <option value="">Select a domain</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              {selectedDomain === 'Other' && (
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="Enter custom domain"
                  className="w-full p-3 mb-4 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500"
                />
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartInterview}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <FaPlay className="mr-2" />
                )}
                Start Interview
              </motion.button>
            </div>
            <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-purple-400" />
                Interview Tips
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Research the company and position beforehand</li>
                <li>Practice common interview questions</li>
                <li>Prepare relevant examples of your skills and experiences</li>
                <li>Dress professionally and maintain good posture</li>
                <li>Listen carefully and ask thoughtful questions</li>
                <li>Be confident and authentic in your responses</li>
              </ul>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500"
            >
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="relative">
                  <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="w-48 h-48" />
                  <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2">
                    <RiOpenaiLine  className="text-2xl" />
                  </div>
                </div>
              </div>
              <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 shadow-inner border border-purple-400">
                <h3 className="font-bold mb-2 flex items-center">
                  <FaRobot className="mr-2 text-purple-400" />
                  AI Interviewer:
                </h3>
                <p>{botResponse || "Preparing your interview..."}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500 flex flex-col"
            >
              <div className="flex-1 bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-purple-400">
                {isVideoOn ? (
                  <video ref={videoRef} autoPlay muted className="h-full w-full object-cover rounded" />
                ) : (
                  <span className="text-gray-400 flex items-center">
                    <FaUser className="mr-2" />
                    Camera is off
                  </span>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isTyping ? handleStartSpeaking : handleStartTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-md flex-grow flex items-center justify-center"
                >
                  {isTyping ? <FaMicrophone className="mr-2" /> : <FaKeyboard className="mr-2" />}
                  {isTyping ? 'Switch to Speaking' : 'Switch to Typing'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isTyping ? handleStopTyping : handleStopSpeaking}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-md flex-grow flex items-center justify-center"
                >
                  <FaPaperPlane className="mr-2" />
                  Submit Response
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500"
          >
            <h3 className="font-bold mb-2 flex items-center">
              <FaUser className="mr-2 text-purple-400" />
              Your Response:
            </h3>
            {isTyping ? (
              <textarea
                ref={typingRef}
                value={typedResponse}
                onChange={(e) => setTypedResponse(e.target.value)}
                className="w-full h-32 bg-gray-800 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-400"
                placeholder="Type your response here..."
              />
            ) : (
              <div className="h-32 bg-gray-800 rounded-md p-3 overflow-y-auto border border-purple-400">
                {transcript || "Start speaking to see your response here..."}
              </div>
            )}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStopInterview}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <FaStop className="mr-2" />
              )}
              End Interview
            </motion.button>
          </div>
        </div>
      )}

      {grade !== null && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 backdrop-filter backdrop-blur-sm"
        >
          <div className="bg-gradient-to-b from-purple-900 to-black p-8 rounded-2xl max-w-md w-full text-center border border-purple-500 shadow-lg">
            <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Interview Completed</h3>
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">Your Grade: {grade}/10</p>
            <div className="mb-6">
              <FaCog className="inline-block text-6xl text-purple-500 animate-spin-slow" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGrade(null)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIMockInterview;