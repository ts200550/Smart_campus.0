
import React, { useState, useCallback, useEffect } from 'react';
import { Screen, User, Appointment, Department } from './types';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { QRCodeScreen } from './components/screens/QRCodeScreen';
import { DepartmentBotScreen } from './components/screens/DepartmentBotScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { ConfirmationScreen } from './components/screens/ConfirmationScreen';
import { MOCK_FACULTY_REQUESTS } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [facultyRequests, setFacultyRequests] = useState<Appointment[]>(MOCK_FACULTY_REQUESTS); // State for faculty dashboard
  const [activeDepartment, setActiveDepartment] = useState<Department | null>(null);
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setScreen(Screen.Dashboard);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setScreen(Screen.Login);
    setAppointments([]);
    setFacultyRequests(MOCK_FACULTY_REQUESTS); // Reset mock requests on logout
  }, []);

  const handleNavigate = useCallback((targetScreen: Screen) => {
    setScreen(targetScreen);
  }, []);

  const handleSelectDepartment = useCallback((department: Department) => {
    setActiveDepartment(department);
    setScreen(Screen.Chat);
  }, []);

  const handleBookAppointment = useCallback((newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => a.time.localeCompare(b.time)));
    setLastAppointment(newAppointment);
    setScreen(Screen.Confirmation);
  }, []);

  // Handler for faculty allowing/rejecting requests
  const handleRespondToRequest = useCallback((appointmentId: string, status: 'approved' | 'rejected') => {
      setFacultyRequests(prev => prev.map(app => 
        app.id === appointmentId ? { ...app, status: status } : app
      ));
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case Screen.Login:
        return <LoginScreen onLogin={handleLogin} />;
      case Screen.Dashboard:
        if (user) {
          // If faculty, pass facultyRequests, else pass student appointments
          const displayAppointments = user.role === 'faculty' || user.role === 'staff' ? facultyRequests : appointments;
          
          return <DashboardScreen 
            user={user} 
            appointments={displayAppointments} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout} 
            onRespondToRequest={handleRespondToRequest}
          />;
        }
        break;
      case Screen.QRCode:
        if (user) {
          return <QRCodeScreen user={user} onNavigate={handleNavigate} />;
        }
        break;
      case Screen.DepartmentBot:
        return <DepartmentBotScreen onNavigate={handleNavigate} onSelectDepartment={handleSelectDepartment} />;
      case Screen.Chat:
        if (activeDepartment) {
            return <ChatScreen department={activeDepartment} onBookAppointment={handleBookAppointment} onNavigate={handleNavigate} />
        }
        break;
      case Screen.Confirmation:
        if (lastAppointment) {
            return <ConfirmationScreen appointment={lastAppointment} onNavigate={handleNavigate} />
        }
        break;
    }
    // Fallback to login if state is invalid
    return <LoginScreen onLogin={handleLogin} />;
  };

  return (
    <div className="bg-slate-100 min-h-[100dvh] font-sans flex items-center justify-center p-0 sm:p-4">
        {/* Container tweaked for better mobile web app feel: uses dynamic viewport height */}
        <div className="w-full max-w-md h-[100dvh] sm:h-[800px] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
            <div className="flex-grow overflow-y-auto scroll-smooth">
                {renderScreen()}
            </div>
        </div>
    </div>
  );
};

export default App;
