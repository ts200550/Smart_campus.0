
import React from 'react';
import { User, Appointment, Screen } from '../../types';
import { Card } from '../common/Card';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface DashboardScreenProps {
  user: User;
  appointments: Appointment[]; // For students: their bookings. For faculty: requests.
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onRespondToRequest?: (appointmentId: string, status: 'approved' | 'rejected') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, appointments, onNavigate, onLogout, onRespondToRequest }) => {
  
  // --- FACULTY VIEW ---
  if (user.role === 'faculty' || user.role === 'staff') {
      return (
        <div className="p-4 md:p-6 space-y-6">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Faculty Portal</h1>
              <p className="text-slate-500">Manage your student appointments.</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-slate-200 text-slate-600 hover:bg-slate-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </header>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Pending Appointment Requests</h2>
            {appointments.filter(a => a.status === 'pending').length > 0 ? (
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'pending').map(app => (
                  <Card key={app.id} className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                                <span className="font-bold text-lg text-slate-800">{app.studentName}</span>
                            </div>
                            <div className="text-sm text-slate-600 space-y-1">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2" /> {app.date}
                                </div>
                                <div className="flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-2" /> {app.time}
                                </div>
                            </div>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                            PENDING
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button 
                            onClick={() => onRespondToRequest && onRespondToRequest(app.id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Allow
                        </button>
                        <button 
                            onClick={() => onRespondToRequest && onRespondToRequest(app.id, 'rejected')}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            Reject
                        </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500">No pending requests at the moment.</p>
              </Card>
            )}
          </div>

          {/* History Section for Faculty */}
           <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 mt-8">Processed Requests</h2>
            <div className="space-y-3">
                 {appointments.filter(a => a.status !== 'pending').map(app => (
                    <div key={app.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-slate-100 opacity-75">
                         <div>
                             <p className="font-semibold">{app.studentName}</p>
                             <p className="text-xs text-slate-500">{app.date} • {app.time}</p>
                         </div>
                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {app.status.toUpperCase()}
                         </span>
                    </div>
                 ))}
            </div>
           </div>
        </div>
      );
  }

  // --- STUDENT VIEW ---
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500">What would you like to do today?</p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-slate-200 text-slate-600 hover:bg-slate-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => onNavigate(Screen.QRCode)} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold">Mark Attendance</h2>
            <p className="opacity-80 mt-1">Generate a secure QR code for class check-in.</p>
          </div>
          <div className="mt-4 flex justify-end items-center">
            <span className="font-semibold">Generate QR</span>
            <ChevronRightIcon className="h-6 w-6 ml-1" />
          </div>
        </Card>
        <Card onClick={() => onNavigate(Screen.DepartmentBot)} className="bg-gradient-to-br from-sky-500 to-cyan-500 text-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold">Department Assistant</h2>
            <p className="opacity-80 mt-1">Book appointments & Check FAQs.</p>
          </div>
          <div className="mt-4 flex justify-end items-center">
            <span className="font-semibold">Open Bot</span>
            <ChevronRightIcon className="h-6 w-6 ml-1" />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">My Appointments</h2>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map(app => (
              <Card key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    {app.department.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{app.department.name}</p>
                    <p className="text-sm text-slate-500">{app.faculty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-slate-600">
                    <CalendarIcon className="h-4 w-4 mr-1.5" /> {app.date}
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-600 mt-1">
                     <ClockIcon className="h-4 w-4 mr-1.5" /> {app.time}
                  </div>
                   <div className={`mt-2 text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                      {app.status?.toUpperCase() || 'CONFIRMED'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-500">You have no upcoming appointments.</p>
            <button onClick={() => onNavigate(Screen.DepartmentBot)} className="mt-4 bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-indigo-200 transition-colors">
                Book one now
            </button>
          </Card>
        )}
      </div>
    </div>
  );
};
