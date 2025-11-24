
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Screen } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { RefreshIcon } from '../icons/RefreshIcon';

interface QRCodeScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const QR_EXPIRY_SECONDS = 20;

const StatusIndicator: React.FC<{ text: string; active: boolean; done: boolean }> = ({ text, active, done }) => (
    <div className="flex items-center space-x-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${done ? 'bg-green-500' : active ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}>
            {done && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
        </div>
        <span className={`transition-colors duration-300 ${active || done ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>{text}</span>
    </div>
);

export const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ user, onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'generated' | 'scanned' | 'marked'>('generated');
  const [timer, setTimer] = useState(QR_EXPIRY_SECONDS);
  const timerIntervalRef = useRef<number | null>(null);
  const refreshIntervalRef = useRef<number | null>(null);

  const generateQR = useCallback(() => {
    if (canvasRef.current && user) {
      const qrData = JSON.stringify({ userId: user.id, timestamp: Date.now(), nonce: Math.random() });
      QRCode.toCanvas(canvasRef.current, qrData, { width: 256, margin: 1, color: { dark: '#1e293b', light: '#0000' } }, (error) => {
        if (error) console.error(error);
      });
      setTimer(QR_EXPIRY_SECONDS);
      setStatus('generated');
    }
  }, [user]);
  
  // Start auto-refreshing every X seconds
  useEffect(() => {
    generateQR();
    refreshIntervalRef.current = window.setInterval(generateQR, QR_EXPIRY_SECONDS * 1000);
    return () => {
        if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [generateQR]);

  // Countdown timer for progress bar
  useEffect(() => {
    if (status !== 'marked') {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [status, generateQR]); // Rerun when a new QR is generated
  
  // Simulate the scan and mark process
  useEffect(() => {
    let scanTimeout: number;
    let markTimeout: number;
    if (status === 'generated') {
        // Only simulate scan if timer is active and reasonably fresh
        scanTimeout = window.setTimeout(() => {
             if(timer > 5) setStatus('scanned')
        }, 8000);
    } else if (status === 'scanned') {
        markTimeout = window.setTimeout(() => setStatus('marked'), 2000);
    }
    return () => {
        clearTimeout(scanTimeout);
        clearTimeout(markTimeout);
    };
  }, [status, timer]);

  const handleManualRefresh = () => {
      // Reset timers
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      
      generateQR(); // Regenerate immediately
      
      // Restart interval
      refreshIntervalRef.current = window.setInterval(generateQR, QR_EXPIRY_SECONDS * 1000);
  };

  const progress = (timer / QR_EXPIRY_SECONDS) * 100;

  return (
    <div className="p-4 md:p-6 flex flex-col h-full">
      <header className="flex items-center mb-4">
        <button onClick={() => onNavigate(Screen.Dashboard)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeftIcon className="h-6 w-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-4">Attendance QR</h1>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 text-center overflow-y-auto">
        <p className="text-slate-600">Scan this QR code at the class entrance.</p>
        <div className="relative mt-6 mb-4 w-64 h-64 flex-shrink-0">
            <canvas ref={canvasRef} className="w-full h-full" />
            {status === 'marked' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                     <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            )}
        </div>
        
        <button 
            onClick={handleManualRefresh}
            disabled={status === 'marked'}
            className={`mb-6 flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${status === 'marked' ? 'opacity-0' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200 hover:scale-105'}`}
        >
            <RefreshIcon className="w-4 h-4 mr-2" />
            Refresh Code
        </button>

        <div className="w-full max-w-sm space-y-4 mb-6">
          <StatusIndicator text="QR Generated" active={status === 'generated'} done={status === 'scanned' || status === 'marked'} />
          <StatusIndicator text="Scanner Reading..." active={status === 'scanned'} done={status === 'marked'} />
          <StatusIndicator text="Attendance Marked" active={false} done={status === 'marked'} />
        </div>
        
        <div className="w-full max-w-xs">
          <p className="text-sm text-slate-500 mb-2">
            {status !== 'marked' ? `QR expires in ${timer}s` : "Attendance successfully marked!"}
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${status === 'marked' ? 'bg-green-500' : 'bg-indigo-600'}`} 
              style={{ width: `${status === 'marked' ? 100 : progress}%` }}
            ></div>
          </div>
        </div>

        {status === 'marked' && (
            <button 
                onClick={() => onNavigate(Screen.Dashboard)} 
                className="mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Back to Dashboard
            </button>
        )}
      </div>
    </div>
  );
};
