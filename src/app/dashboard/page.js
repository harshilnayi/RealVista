'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, timeAgo } from '@/lib/utils';
import {
    LayoutDashboard, Building2, Heart, MessageSquare, BarChart3,
    Plus, Eye, TrendingUp, Users, ArrowRight, Settings, ChevronRight,
    Home, Loader,
} from 'lucide-react';
import styles from './page.module.css';

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ listings: 0, favorites: 0, inquiries: 0, views: 0 });
    const [recentListings, setRecentListings] = useState([]);
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setUser(user);

        // Load profile
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(prof);

        // Load stats
        const { count: listingCount } = await supabase
            .from('properties').select('*', { count: 'exact', head: true }).eq('owner_id', user.id);

        const { count: favCount } = await supabase
            .from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

        const { count: inqCount } = await supabase
            .from('inquiries').select('*', { count: 'exact', head: true })
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        const { data: propViews } = await supabase
            .from('properties').select('views_count').eq('owner_id', user.id);
        const totalViews = propViews?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;

        setStats({
            listings: listingCount || 0,
            favorites: favCount || 0,
            inquiries: inqCount || 0,
            views: totalViews,
        });

        // Recent listings
        const { data: listings } = await supabase
            .from('properties')
            .select('id, title, price, status, views_count, listing_type, created_at')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
        setRecentListings(listings || []);

        // Recent inquiries
        const { data: inquiries } = await supabase
            .from('inquiries')
            .select('*, profiles!inquiries_sender_id_fkey(full_name), properties(title)')
            .eq('receiver_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
        setRecentInquiries(inquiries || []);

        setLoading(false);
    };

    if (loading) {
        return (
            <div className={styles.dashboardPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                    <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.dashHeader}>
                    <div>
                        <h1 className={styles.dashTitle}>
                            Welcome back, <span className="gradient-text">{profile?.full_name}</span>
                        </h1>
                        <p className={styles.dashSubtitle}>
                            Here&apos;s an overview of your activity on RealVista
                        </p>
                    </div>
                    {(profile?.role === 'seller' || profile?.role === 'agent') && (
                        <Link href="/properties/new" className="btn btn-primary">
                            <Plus size={18} /> List Property
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statBlue}`}>
                            <Building2 size={22} />
                        </div>
                        <div>
                            <span className={styles.statValue}>{stats.listings}</span>
                            <span className={styles.statLabel}>My Listings</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statPink}`}>
                            <Heart size={22} />
                        </div>
                        <div>
                            <span className={styles.statValue}>{stats.favorites}</span>
                            <span className={styles.statLabel}>Favorites</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statGreen}`}>
                            <MessageSquare size={22} />
                        </div>
                        <div>
                            <span className={styles.statValue}>{stats.inquiries}</span>
                            <span className={styles.statLabel}>Inquiries</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statOrange}`}>
                            <Eye size={22} />
                        </div>
                        <div>
                            <span className={styles.statValue}>{stats.views}</span>
                            <span className={styles.statLabel}>Total Views</span>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Quick Actions */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Quick Actions</h3>
                        <div className={styles.actionsList}>
                            <Link href="/properties" className={styles.actionItem}>
                                <Home size={18} /> Browse Properties <ChevronRight size={16} />
                            </Link>
                            <Link href="/dashboard/favorites" className={styles.actionItem}>
                                <Heart size={18} /> View Favorites <ChevronRight size={16} />
                            </Link>
                            <Link href="/dashboard/inquiries" className={styles.actionItem}>
                                <MessageSquare size={18} /> View Inquiries <ChevronRight size={16} />
                            </Link>
                            <Link href="/calculator" className={styles.actionItem}>
                                <BarChart3 size={18} /> EMI Calculator <ChevronRight size={16} />
                            </Link>
                            {(profile?.role === 'seller' || profile?.role === 'agent') && (
                                <Link href="/properties/new" className={styles.actionItem}>
                                    <Plus size={18} /> List Property <ChevronRight size={16} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Recent Listings */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>My Recent Listings</h3>
                            <Link href="/dashboard/listings" className={styles.viewAll}>
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentListings.length > 0 ? (
                            <div className={styles.listingList}>
                                {recentListings.map(listing => (
                                    <Link key={listing.id} href={`/properties/${listing.id}`} className={styles.listingItem}>
                                        <div>
                                            <h4 className={styles.listingTitle}>{listing.title}</h4>
                                            <span className={styles.listingMeta}>
                                                {formatPrice(listing.price)} · {timeAgo(listing.created_at)}
                                            </span>
                                        </div>
                                        <span className={`badge ${listing.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                            {listing.status}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.emptyText}>No listings yet. Start by listing a property!</p>
                        )}
                    </div>

                    {/* Recent Inquiries */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Recent Inquiries</h3>
                            <Link href="/dashboard/inquiries" className={styles.viewAll}>
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentInquiries.length > 0 ? (
                            <div className={styles.listingList}>
                                {recentInquiries.map(inq => (
                                    <div key={inq.id} className={styles.inquiryItem}>
                                        <div>
                                            <h4 className={styles.listingTitle}>{inq.profiles?.full_name || 'User'}</h4>
                                            <span className={styles.listingMeta}>
                                                {inq.message?.slice(0, 60)}... · {timeAgo(inq.created_at)}
                                            </span>
                                        </div>
                                        <span className={`badge ${inq.status === 'new' ? 'badge-primary' : 'badge-success'}`}>
                                            {inq.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.emptyText}>No inquiries received yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
