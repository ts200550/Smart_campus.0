
// Fix: Import React to make JSX types like `JSX.Element` available in a .ts file.
import React from 'react';

export enum Screen {
  Login,
  Dashboard,
  QRCode,
  DepartmentBot,
  Chat,
  Confirmation,
}

export type Role = 'student' | 'faculty' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  faculty: { name: string; office: string }[];
  faqs: FAQ[];
}

export type AppointmentStatus = 'pending' | 'approved' | 'rejected';

export interface Appointment {
  id: string;
  department: Department; // For student view
  faculty: string;        // For student view (who they are seeing)
  studentName?: string;   // For faculty view (who is seeing them)
  time: string;
  date: string;
  status: AppointmentStatus;
}

declare global {
  var QRCode: {
    toCanvas(canvas: HTMLCanvasElement, text: string, options: any, callback: (error: any) => void): void;
  };
}
