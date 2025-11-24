
import React, { useState, useEffect, useRef } from 'react';
import { Department, Appointment, Screen } from '../../types';
import { MOCK_TIME_SLOTS } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface ChatScreenProps {
  department: Department;
  onBookAppointment: (appointment: Appointment) => void;
  onNavigate: (screen: Screen) => void;
}

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text?: string;
  options?: { text: string; value: any }[];
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ department, onBookAppointment, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0); 
  // Steps:
  // 0: Init
  // 1: Main Menu (FAQ vs Book)
  // 2: Booking - Select Faculty
  // 3: Booking - Select Time
  // 4: Booking - Confirm
  // 5: FAQ - List Questions
  
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState<{ faculty?: string; time?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Initial message from bot
  useEffect(() => {
    setMessages([]); // Clear previous messages on department change
    setIsLoading(true);
    setSelection({});
    setTimeout(() => {
        setMessages([
          {
            id: 1,
            sender: 'bot',
            text: `Hello! Welcome to the ${department.name}. How can I assist you today?`,
            options: [
                { text: 'View FAQs', value: 'faq_mode' },
                { text: 'Book Appointment', value: 'book_mode' }
            ]
          }
        ]);
        setIsLoading(false);
        setStep(1);
    }, 800);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: prev.length + 1 }]);
  };

  const handleOptionSelect = (text: string, value: any) => {
    addMessage({ sender: 'user', text });
    setIsLoading(true);

    setTimeout(() => {
        // --- STATE MACHINE ---
        
        if (step === 1) { // Main Menu
            if (value === 'faq_mode') {
                const faqs = department.faqs || [];
                if(faqs.length === 0) {
                     addMessage({
                        sender: 'bot',
                        text: "I apologize, but I don't have any frequently asked questions for this department yet.",
                        options: [{ text: 'Book Appointment', value: 'book_mode' }]
                    });
                } else {
                    addMessage({
                        sender: 'bot',
                        text: "Here are some frequently asked questions. Tap one to see the answer:",
                        options: [
                            ...faqs.map((faq, idx) => ({ text: faq.question, value: `faq_${idx}` })),
                            { text: "Go Back to Menu", value: "back_main" }
                        ]
                    });
                    setStep(5); // Go to FAQ mode
                }
            } else if (value === 'book_mode') {
                addMessage({
                    sender: 'bot',
                    text: "Please select the faculty member or staff you wish to meet:",
                    options: department.faculty.map(f => ({ text: f.name, value: f.name }))
                });
                setStep(2); // Go to Booking mode
            }
        } 
        else if (step === 5) { // FAQ Mode
            if (value === 'back_main') {
                addMessage({
                    sender: 'bot',
                    text: "How else can I help you?",
                    options: [
                        { text: 'View FAQs', value: 'faq_mode' },
                        { text: 'Book Appointment', value: 'book_mode' }
                    ]
                });
                setStep(1);
            } else if (typeof value === 'string' && value.startsWith('faq_')) {
                const index = parseInt(value.split('_')[1]);
                const answer = department.faqs[index].answer;
                addMessage({
                    sender: 'bot',
                    text: answer,
                    options: [
                        { text: "Ask another question", value: "faq_mode" },
                        { text: "Book an appointment instead", value: "book_mode" }
                    ]
                });
                setStep(1); // Return to menu logic essentially
            }
        }
        else if (step === 2) { // Faculty selected
            setSelection({ faculty: value });
            addMessage({
                sender: 'bot',
                text: `Great! Here are the available slots for ${value} today:`,
                options: MOCK_TIME_SLOTS.map(slot => ({ text: slot, value: slot }))
            });
            setStep(3);
        } else if (step === 3) { // Time slot selected
            const newSelection = {...selection, time: value};
            setSelection(newSelection);
            addMessage({
                sender: 'bot',
                text: `Perfect. Please confirm your appointment with ${newSelection.faculty} at ${newSelection.time}.`,
                options: [{ text: 'Confirm Booking', value: 'confirm' }, { text: 'Cancel', value: 'cancel' }]
            });
            setStep(4);
        } else if (step === 4) { // Confirmation
            if (value === 'confirm' && selection.faculty && selection.time) {
                const newAppointment: Appointment = {
                    id: `app_${Date.now()}`,
                    department: department,
                    faculty: selection.faculty,
                    time: selection.time,
                    date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }),
                    status: 'pending' // Default status
                };
                onBookAppointment(newAppointment);
            } else {
                addMessage({ 
                    sender: 'bot', 
                    text: 'Your booking has been cancelled. Returning to main menu.',
                    options: [
                        { text: 'View FAQs', value: 'faq_mode' },
                        { text: 'Book Appointment', value: 'book_mode' }
                    ]
                });
                setStep(1);
            }
        }
        setIsLoading(false);
    }, 600);
  };

  return (
    <div className="p-0 flex flex-col h-full">
      <header className="flex items-center p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={() => onNavigate(Screen.DepartmentBot)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeftIcon className="h-6 w-6 text-slate-600" />
        </button>
        <div className="ml-4">
          <h1 className="text-lg font-bold text-slate-800">{department.name}</h1>
          <p className="text-sm text-green-500 font-semibold">Online • Automated Assistant</p>
        </div>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto scroll-smooth">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] md:max-w-md p-3 rounded-2xl shadow-sm ${msg.sender === 'bot' ? 'bg-white text-slate-800 border border-slate-200 rounded-bl-none' : 'bg-indigo-600 text-white rounded-br-none'}`}>
              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
              {msg.options && (
                <div className="mt-3 space-y-2">
                  {msg.options.map((opt, idx) => (
                    <button 
                      key={`${opt.value}-${idx}`}
                      onClick={() => handleOptionSelect(opt.text, opt.value)}
                      disabled={isLoading}
                      className="w-full text-left bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-semibold py-2 px-3 rounded-lg border border-indigo-100 transition-colors disabled:opacity-50 text-sm"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
             <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-bl-none shadow-sm">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
