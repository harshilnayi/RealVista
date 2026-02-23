'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { timeAgo } from '@/lib/utils';
import { MessageSquare, Check, Clock, ArrowRight, User, Building2, Loader, Mail, Phone } from 'lucide-react';
import styles from './page.module.css';

export default function InquiriesPage() {
    const supabase = createClient();
    const router = useRouter();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('received');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setUserId(user.id);

        // Received inquiries
        const { data: received } = await supabase
            .from('inquiries')
            .select('*, profiles!inquiries_sender_id_fkey(full_name, email, avatar_url), properties(id, title)')
            .eq('receiver_id', user.id)
            .order('created_at', { ascending: false });

        // Sent inquiries
        const { data: sent } = await supabase
            .from('inquiries')
            .select('*, profiles!inquiries_receiver_id_fkey(full_name, email), properties(id, title)')
            .eq('sender_id', user.id)
            .order('created_at', { ascending: false });

        setInquiries({ received: received || [], sent: sent || [] });
        setLoading(false);
    };

    const markAsRead = async (id) => {
        await supabase.from('inquiries').update({ status: 'read' }).eq('id', id);
        setInquiries(prev => ({
            ...prev,
            received: prev.received.map(i => i.id === id ? { ...i, status: 'read' } : i),
        }));
    };

    if (loading) {
        return (
            <div className={styles.inquiriesPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                    <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    const currentList = tab === 'received' ? inquiries.received : inquiries.sent;

    return (
        <div className={styles.inquiriesPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        <MessageSquare size={24} /> Inquiries
                    </h1>
                    <p className={styles.pageSubtitle}>
                        {inquiries.received?.length || 0} received · {inquiries.sent?.length || 0} sent
                    </p>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${tab === 'received' ? styles.tabActive : ''}`}
                        onClick={() => setTab('received')}
                    >
                        Received ({inquiries.received?.length || 0})
                    </button>
                    <button
                        className={`${styles.tab} ${tab === 'sent' ? styles.tabActive : ''}`}
                        onClick={() => setTab('sent')}
                    >
                        Sent ({inquiries.sent?.length || 0})
                    </button>
                </div>

                {/* List */}
                {currentList.length > 0 ? (
                    <div className={styles.inquiryList}>
                        {currentList.map(inq => {
                            const person = tab === 'received' ? inq.profiles : inq.profiles;
                            return (
                                <div key={inq.id} className={`${styles.inquiryCard} ${inq.status === 'new' && tab === 'received' ? styles.unread : ''}`}>
                                    <div className={styles.inquiryHeader}>
                                        <div className={styles.personInfo}>
                                            <div className={styles.avatar}>
                                                {person?.avatar_url ? (
                                                    <img src={person.avatar_url} alt="" />
                                                ) : (
                                                    <span>{person?.full_name?.[0] || '?'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={styles.personName}>{person?.full_name || 'User'}</h4>
                                                <span className={styles.timeAgo}>{timeAgo(inq.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.headerRight}>
                                            <span className={`badge ${inq.status === 'new' ? 'badge-primary' : inq.status === 'read' ? 'badge-info' : 'badge-success'}`}>
                                                {inq.status}
                                            </span>
                                            {inq.status === 'new' && tab === 'received' && (
                                                <button className="btn btn-ghost btn-sm" onClick={() => markAsRead(inq.id)}>
                                                    <Check size={14} /> Mark Read
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {inq.properties && (
                                        <Link href={`/properties/${inq.properties.id}`} className={styles.propertyLink}>
                                            <Building2 size={14} /> {inq.properties.title}
                                        </Link>
                                    )}

                                    <p className={styles.message}>{inq.message}</p>

                                    {(inq.phone || inq.email) && (
                                        <div className={styles.contactInfo}>
                                            {inq.phone && (
                                                <a href={`tel:${inq.phone}`} className={styles.contactLink}>
                                                    <Phone size={14} /> {inq.phone}
                                                </a>
                                            )}
                                            {inq.email && (
                                                <a href={`mailto:${inq.email}`} className={styles.contactLink}>
                                                    <Mail size={14} /> {inq.email}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <MessageSquare size={56} />
                        <h3>No {tab} inquiries</h3>
                        <p>{tab === 'received' ? 'You haven\'t received any inquiries yet.' : 'You haven\'t sent any inquiries yet.'}</p>
                        {tab === 'sent' && (
                            <Link href="/properties" className="btn btn-primary">Browse Properties</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
