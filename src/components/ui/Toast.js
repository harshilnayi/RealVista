'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Toast.module.css';

const ToastContext = createContext();

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be inside ToastProvider');
    return ctx;
};

const ICONS = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error', 6000),
        info: (msg) => addToast(msg, 'info'),
        warning: (msg) => addToast(msg, 'warning', 5000),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(t => (
                    <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
                        <span className={styles.toastIcon}>{ICONS[t.type]}</span>
                        <span className={styles.toastMessage}>{t.message}</span>
                        <button className={styles.toastClose} onClick={() => removeToast(t.id)}>
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
