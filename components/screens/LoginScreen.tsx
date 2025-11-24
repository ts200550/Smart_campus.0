
import React, { useState } from 'react';
import { User, Role } from '../../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('S12345');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<Role>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would authenticate here.
    // For this prototype, we'll use mock data based on role.
    
    if (role === 'student') {
        onLogin({
            id: studentId,
            name: 'Alex Johnson',
            email: 'alex.j@university.edu',
            role: 'student'
        });
    } else {
        onLogin({
            id: 'F98765',
            name: 'Prof. Albus Dumbledore',
            email: 'dumbledore@university.edu',
            role: 'faculty'
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600">Smart Campus 2.0</h1>
            <p className="text-slate-500 mt-2">Your unified campus portal.</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-4">
            <div className="flex border-b">
                <button 
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${role === 'student' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => { setRole('student'); setStudentId('S12345'); }}
                >
                    Student Login
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${role === 'faculty' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => { setRole('faculty'); setStudentId('F98765'); }}
                >
                    Faculty / Staff
                </button>
            </div>

            <form onSubmit={handleLogin} className="px-8 pt-6 pb-8">
            <div className="mb-4">
                <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="studentid">
                {role === 'student' ? 'Student ID' : 'Faculty ID'}
                </label>
                <input
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="studentid"
                type="text"
                placeholder={role === 'student' ? "e.g., S12345" : "e.g., F98765"}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                Password
                </label>
                <input
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                type="submit"
                >
                Sign In as {role === 'student' ? 'Student' : 'Faculty'}
                </button>
            </div>
            </form>
        </div>
        <p className="text-center text-slate-500 text-xs">
          &copy;{new Date().getFullYear()} University Name. All rights reserved.
        </p>
      </div>
    </div>
  );
};
