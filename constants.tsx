
import React from 'react';
import { Department, Appointment } from './types';
import { AcademicCapIcon } from './components/icons/AcademicCapIcon';
import { BuildingLibraryIcon } from './components/icons/BuildingLibraryIcon';
import { UserCircleIcon } from './components/icons/UserCircleIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { ClockIcon } from './components/icons/ClockIcon';


export const DEPARTMENTS: Department[] = [
  {
    id: 'apo',
    name: 'APO (Attendance & Portal)',
    icon: <ClockIcon className="h-8 w-8 text-indigo-500" />,
    faculty: [
        { name: 'Mrs. Sarah Connor', office: 'Tech Support Desk 1' },
        { name: 'Mr. Thomas Anderson', office: 'System Admin Office' }
    ],
    faqs: [
        { question: "How do I reset my portal password?", answer: "You can reset your password by clicking 'Forgot Password' on the login screen or visiting the IT desk in Block A." },
        { question: "My attendance wasn't updated.", answer: "Please ensure you scan the QR code within the valid time. If it persists, submit a manual correction form via the portal." },
        { question: "How to access campus Wi-Fi?", answer: "Use your Student ID as the username and your portal password to connect to 'Campus_Secure'." }
    ]
  },
  {
    id: 'finance',
    name: 'Finance Office',
    icon: <UserCircleIcon className="h-8 w-8 text-green-600" />,
    faculty: [
        { name: 'Mr. Ebenezer Scrooge', office: 'Accounts Room 101' },
        { name: 'Ms. Penny Stocks', office: 'Accounts Room 102' }
    ],
    faqs: [
        { question: "When is the tuition fee deadline?", answer: "Tuition fees for the current semester are due by the 15th of next month." },
        { question: "How do I apply for a scholarship?", answer: "Scholarship forms are available on the portal under 'Financial Aid'. Submission closes on September 30th." },
        { question: "Where can I get a fee receipt?", answer: "Fee receipts are automatically emailed to you upon payment. You can also download them from your student dashboard." }
    ]
  },
  {
    id: 'sre',
    name: 'SRE (Exams & Registry)',
    icon: <CalendarIcon className="h-8 w-8 text-orange-500" />,
    faculty: [
        { name: 'Dr. Strange', office: 'Exam Control Room' },
        { name: 'Prof. Minerva McGonagall', office: 'Registry Office' }
    ],
    faqs: [
        { question: "When will the exam schedule be released?", answer: "The final exam schedule will be published two weeks before the commencement of examinations." },
        { question: "How do I request a transcript?", answer: "Transcript requests can be made via the portal. Processing time is typically 3-5 working days." },
        { question: "What is the process for re-evaluation?", answer: "You must submit a re-evaluation form along with the requisite fee within 7 days of result declaration." }
    ]
  },
  {
    id: 'faculty',
    name: 'Academic Faculties',
    icon: <AcademicCapIcon className="h-8 w-8 text-purple-600" />,
    faculty: [
        { name: 'Prof. Albus Dumbledore (Physics)', office: 'Science Block 301' },
        { name: 'Dr. Sheldon Cooper (Theoretical Phys)', office: 'Science Block 304' },
        { name: 'Dr. Ross Geller (Paleontology)', office: 'History Dept 202' },
        { name: 'Mr. Walter White (Chemistry)', office: 'Lab 4' },
        { name: 'Prof. John Keating (English)', office: 'Arts Block 101' }
    ],
    faqs: [
        { question: "How do I book office hours?", answer: "You can use this bot to book specific slots available for each professor." },
        { question: "Where can I find the syllabus?", answer: "Syllabus documents are uploaded to the Learning Management System (LMS) under your respective course codes." },
        { question: "I missed a lab session.", answer: "Please contact your specific subject professor immediately to schedule a make-up lab session if permitted." }
    ]
  },
  {
    id: 'library',
    name: 'Library',
    icon: <BuildingLibraryIcon className="h-8 w-8 text-blue-500" />,
    faculty: [
        { name: 'Mr. Rupert Giles', office: 'Librarian Desk'}
    ],
    faqs: [
        { question: "What are the library hours?", answer: "The library is open from 8:00 AM to 8:00 PM on weekdays and 10:00 AM to 4:00 PM on weekends." },
        { question: "How many books can I borrow?", answer: "Undergraduates can borrow up to 4 books at a time for a duration of 14 days." }
    ]
  },
];

export const MOCK_TIME_SLOTS = [
    "10:00 - 10:15 AM",
    "10:30 - 10:45 AM",
    "11:15 - 11:30 AM",
    "02:00 - 02:15 PM",
    "02:30 - 02:45 PM",
];

export const MOCK_FACULTY_REQUESTS: Appointment[] = [
    {
        id: 'req_1',
        studentName: 'John Doe',
        faculty: 'Prof. Albus Dumbledore (Physics)',
        department: DEPARTMENTS[3], // Academic
        time: '10:30 - 10:45 AM',
        date: 'Monday, Oct 24',
        status: 'pending'
    },
    {
        id: 'req_2',
        studentName: 'Hermione Granger',
        faculty: 'Prof. Albus Dumbledore (Physics)',
        department: DEPARTMENTS[3], // Academic
        time: '11:15 - 11:30 AM',
        date: 'Monday, Oct 24',
        status: 'pending'
    },
    {
        id: 'req_3',
        studentName: 'Ron Weasley',
        faculty: 'Prof. Albus Dumbledore (Physics)',
        department: DEPARTMENTS[3], // Academic
        time: '02:00 - 02:15 PM',
        date: 'Tuesday, Oct 25',
        status: 'pending'
    }
];
