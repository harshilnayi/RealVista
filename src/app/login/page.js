'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogIn, Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';
    const supabase = createClient();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.push(redirect);
            router.refresh();
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authCard}>
            <div className={styles.authHeader}>
                <Link href="/" className={styles.authLogo}>
                    <Building2 size={32} />
                </Link>
                <h1 className={styles.authTitle}>Welcome Back</h1>
                <p className={styles.authSubtitle}>Sign in to your RealVista account</p>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleLogin} className={styles.authForm}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                            Sign In <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className={styles.authFooter}>
                Don&apos;t have an account?{' '}
                <Link href="/register" className={styles.authLink}>
                    Create one
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className={styles.authPage}>
            <div className={styles.authBackground}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
            </div>
            <Suspense fallback={
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <div className={styles.authLogo}><Building2 size={32} /></div>
                        <h1 className={styles.authTitle}>Loading...</h1>
                    </div>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
