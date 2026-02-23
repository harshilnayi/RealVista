'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';
import { User, Mail, Phone, MapPin, Save, Camera, Loader, LogOut, Shield } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        full_name: '', phone: '', bio: '', city: '', avatar_url: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setUser(user);

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile) {
            setForm({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                bio: profile.bio || '',
                city: profile.city || '',
                avatar_url: profile.avatar_url || '',
            });
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: form.full_name,
                phone: form.phone,
                bio: form.bio,
                city: form.city,
                avatar_url: form.avatar_url,
            })
            .eq('id', user.id);

        if (error) {
            toast.error('Failed to update profile');
        } else {
            toast.success('Profile updated successfully!');
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.info('Logged out successfully');
        router.push('/');
    };

    const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    if (loading) {
        return (
            <div className={styles.settingsPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                    <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.settingsPage}>
            <div className="container">
                <h1 className={styles.pageTitle}>
                    <User size={24} /> Profile & Settings
                </h1>

                <div className={styles.settingsGrid}>
                    {/* Profile Form */}
                    <form onSubmit={handleSave} className={styles.formCard}>
                        <h3 className={styles.cardTitle}>Personal Information</h3>

                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                {form.avatar_url ? (
                                    <img src={form.avatar_url} alt="Avatar" />
                                ) : (
                                    <span>{form.full_name?.[0] || '?'}</span>
                                )}
                            </div>
                            <div className={styles.avatarInfo}>
                                <p className={styles.avatarHint}>Paste an image URL for your avatar</p>
                                <input
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={form.avatar_url}
                                    onChange={(e) => update('avatar_url', e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div className="input-group">
                                <label className="input-label"><User size={14} /> Full Name</label>
                                <input type="text" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="input" required />
                            </div>
                            <div className="input-group">
                                <label className="input-label"><Mail size={14} /> Email</label>
                                <input type="email" value={user?.email || ''} className="input" disabled style={{ opacity: 0.5 }} />
                            </div>
                            <div className="input-group">
                                <label className="input-label"><Phone size={14} /> Phone</label>
                                <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" />
                            </div>
                            <div className="input-group">
                                <label className="input-label"><MapPin size={14} /> City</label>
                                <input type="text" placeholder="Mumbai" value={form.city} onChange={(e) => update('city', e.target.value)} className="input" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Bio</label>
                            <textarea
                                placeholder="Tell us about yourself..."
                                value={form.bio}
                                onChange={(e) => update('bio', e.target.value)}
                                className="input"
                                rows={4}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                        </button>
                    </form>

                    {/* Account Card */}
                    <div className={styles.sideCard}>
                        <div className={styles.accountCard}>
                            <h3 className={styles.cardTitle}><Shield size={18} /> Account</h3>
                            <div className={styles.accountInfo}>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Role:</strong> <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user?.user_metadata?.role || 'buyer'}</span></p>
                                <p><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <button onClick={handleLogout} className={`btn btn-secondary ${styles.logoutBtn}`}>
                            <LogOut size={16} /> Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
