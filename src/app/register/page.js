'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { USER_ROLES } from '@/lib/constants';
import {
    UserPlus, Mail, Lock, Eye, EyeOff, Building2, User,
    ArrowRight, ShoppingBag, Briefcase, Home,
} from 'lucide-react';
import styles from '../login/page.module.css';

const ROLE_ICONS = {
    buyer: <ShoppingBag size={20} />,
    seller: <Home size={20} />,
    agent: <Briefcase size={20} />,
};

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    },
                },
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authBackground}>
                    <div className={styles.blob1} />
                    <div className={styles.blob2} />
                </div>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <div className={styles.authLogo}>
                            <Building2 size={32} />
                        </div>
                        <h1 className={styles.authTitle}>Account Created! 🎉</h1>
                        <p className={styles.authSubtitle}>
                            Welcome to RealVista! Redirecting you to your dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authBackground}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
            </div>

            <div className={`${styles.authCard} ${styles.authCardWide}`}>
                <div className={styles.authHeader}>
                    <Link href="/" className={styles.authLogo}>
                        <Building2 size={32} />
                    </Link>
                    <h1 className={styles.authTitle}>Create Account</h1>
                    <p className={styles.authSubtitle}>Join RealVista and start your property journey</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className={styles.authForm}>
                    {/* Role Selector */}
                    <div className="input-group">
                        <label className="input-label">I am a</label>
                        <div className={styles.roleSelector}>
                            {USER_ROLES.map((r) => (
                                <label key={r.value} className={styles.roleOption}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r.value}
                                        checked={role === r.value}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <div className={styles.roleCard}>
                                        <div className={styles.roleIcon}>
                                            {ROLE_ICONS[r.value]}
                                        </div>
                                        <span className={styles.roleName}>{r.label}</span>
                                        <span className={styles.roleDesc}>{r.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                className={`input ${styles.authInput}`}
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                className={`input ${styles.authInput}`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`input ${styles.authInput}`}
                                placeholder="Create a password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg w-full ${styles.submitBtn}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner} />
                        ) : (
                            <>
                                Create Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className={styles.authFooter}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.authLink}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
