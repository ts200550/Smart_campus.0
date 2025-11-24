
import React from 'react';
import { Appointment, Screen } from '../../types';
import { Card } from '../common/Card';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';


interface ConfirmationScreenProps {
  appointment: Appointment;
  onNavigate: (screen: Screen) => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ appointment, onNavigate }) => {
  return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-center h-full text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4"/>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Appointment Confirmed!</h1>
        <p className="text-slate-500 mt-2 mb-8">A confirmation has been sent to your student email.</p>
        
        <Card className="w-full max-w-md text-left p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">{appointment.department.name}</h2>
            <div className="space-y-3">
                <div className="flex items-center">
                    <UserCircleIcon className="w-5 h-5 text-slate-500 mr-3" />
                    <span className="text-slate-700">{appointment.faculty}</span>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-slate-500 mr-3" />
                    <span className="text-slate-700">{appointment.date}</span>
                </div>
                <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-slate-500 mr-3" />
                    <span className="text-slate-700">{appointment.time}</span>
                </div>
            </div>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
                onClick={() => onNavigate(Screen.Dashboard)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
            >
                Back to Dashboard
            </button>
            <button 
                onClick={() => onNavigate(Screen.DepartmentBot)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
            >
                Book Another
            </button>
        </div>
    </div>
  );
};
