
import React from 'react';
import { Screen, Department } from '../../types';
import { DEPARTMENTS } from '../../constants';
import { Card } from '../common/Card';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface DepartmentBotScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectDepartment: (department: Department) => void;
}

export const DepartmentBotScreen: React.FC<DepartmentBotScreenProps> = ({ onNavigate, onSelectDepartment }) => {
  return (
    <div className="p-4 md:p-6">
      <header className="flex items-center mb-6">
        <button onClick={() => onNavigate(Screen.Dashboard)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeftIcon className="h-6 w-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-4">Department Assistant</h1>
      </header>
      <div>
        <p className="text-slate-600 mb-6">Please select a department to schedule an appointment or inquire about availability.</p>
        <div className="space-y-4">
          {DEPARTMENTS.map((dept) => (
            <Card key={dept.id} onClick={() => onSelectDepartment(dept)}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    {dept.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{dept.name}</h3>
                    <p className="text-sm text-slate-500">{dept.faculty.length} faculty member(s) available.</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-slate-400" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
