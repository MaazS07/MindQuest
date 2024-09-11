import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaFileDownload } from 'react-icons/fa';
import { auth } from '../firebaseConfig';
import interviewData from '../json_data.json';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const HRDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const generatePDF = () => {
    const formattedInterviewData = JSON.stringify(interviewData, null, 2);

    const docDefinition = {
      content: [
        { text: 'MindQuest', style: 'header' },
        { text: 'HR Interview Report', style: 'subheader' },
        {
          text: `Interview Topic: ${interviewData.interview_topic}`,
          style: 'topic',
        },
        {
          text: `Final Grade: ${interviewData.final_grade}/10`,
          style: 'grade',
        },
        { text: 'Grading Criteria', style: 'sectionHeader' },
        {
          ul: interviewData.grading_criteria.map(criterion => criterion),
          style: 'list',
        },
        { text: 'Interview Performance', style: 'sectionHeader' },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0, x2: 515, y2: 0,
              lineWidth: 1,
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [{ text: 'Category', style: 'tableHeader' }, { text: 'Grade', style: 'tableHeader' }],
              ['Technical Knowledge', '9'],
              ['Problem Solving', '8'],
              ['Engineering Principles', '9'],
              ['Communication', '7'],
              ['Culture Fit', '7'],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 10, 0, 20],
        },
        { text: 'Full Interview Data', style: 'sectionHeader' },
        { text: formattedInterviewData, style: 'json' },
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        subheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        topic: {
          fontSize: 14,
          margin: [0, 5, 0, 5],
        },
        grade: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 15, 0, 10],
        },
        list: {
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
        json: {
          fontSize: 10,
          fontFamily: 'Courier',
          preserveLeadingSpaces: true,
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('interview_report.pdf');
  };

  const renderStats = () => {
    const data = [
      { name: 'Technical Knowledge', grade: 9 },
      { name: 'Problem Solving', grade: 8 },
      { name: 'Engineering Principles', grade: 9 },
      { name: 'Communication', grade: 7 },
      { name: 'Culture Fit', grade: 7 },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="grade" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white p-8">
      <h1 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        HR Dashboard
      </h1>

      <div className="text-center mb-4">
        <button
          onClick={generatePDF}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
        >
          <FaFileDownload className="mr-2" />
          Generate PDF
        </button>
      </div>

      {user && (
        <div className="mb-8 text-center">
          <img src={user.photoURL || "/api/placeholder/100/100"} alt="User profile" className="w-20 h-20 rounded-full mx-auto mb-2" />
          <p className="text-xl font-semibold">{user.displayName || "Anonymous User"}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500">
          <h2 className="text-2xl font-semibold mb-4">Interview Details</h2>
          <p><strong>Topic:</strong> {interviewData.interview_topic}</p>
          <p><strong>Final Grade:</strong> {interviewData.final_grade}/10</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Grading Criteria</h3>
          <ul className="list-disc list-inside">
            {interviewData.grading_criteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </div>

        <div className="bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500">
          <h2 className="text-2xl font-semibold mb-4">Interview Performance Stats</h2>
          {renderStats()}
        </div>

        <div className="col-span-2 bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-500 overflow-auto max-h-[80vh]">
          <h2 className="text-2xl font-semibold mb-4">Full Interview Data (Formatted JSON)</h2>
          <pre className="bg-black p-4 rounded-xl max-h-96 overflow-auto text-left whitespace-pre-wrap text-sm">
            {JSON.stringify(interviewData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;