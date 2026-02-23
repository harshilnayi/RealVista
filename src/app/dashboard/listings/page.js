'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, timeAgo } from '@/lib/utils';
import {
    Building2, Plus, Edit, Trash2, Eye, MoreVertical, Loader,
    ToggleLeft, ToggleRight,
} from 'lucide-react';
import styles from './page.module.css';

export default function MyListingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }

        const { data } = await supabase
            .from('properties')
            .select('*, property_images(image_url, is_primary)')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });

        setListings(data || []);
        setLoading(false);
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await supabase.from('properties').update({ status: newStatus }).eq('id', id);
        setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    const deleteListing = async (id) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        await supabase.from('properties').delete().eq('id', id);
        setListings(prev => prev.filter(l => l.id !== id));
    };

    if (loading) {
        return (
            <div className={styles.listingsPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                    <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.listingsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            <Building2 size={24} /> My Listings
                        </h1>
                        <p className={styles.pageSubtitle}>{listings.length} properties listed</p>
                    </div>
                    <Link href="/properties/new" className="btn btn-primary">
                        <Plus size={18} /> Add Property
                    </Link>
                </div>

                {listings.length > 0 ? (
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>Property</span>
                            <span>Price</span>
                            <span>Status</span>
                            <span>Views</span>
                            <span>Listed</span>
                            <span>Actions</span>
                        </div>
                        {listings.map(listing => {
                            const img = listing.property_images?.find(i => i.is_primary)?.image_url ||
                                listing.property_images?.[0]?.image_url ||
                                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=60&fit=crop';
                            return (
                                <div key={listing.id} className={styles.tableRow}>
                                    <div className={styles.propertyCell}>
                                        <img src={img} alt="" className={styles.propertyThumb} />
                                        <div>
                                            <Link href={`/properties/${listing.id}`} className={styles.propertyName}>
                                                {listing.title}
                                            </Link>
                                            <span className={styles.propertyType}>{listing.property_type} · {listing.city}</span>
                                        </div>
                                    </div>
                                    <span className={styles.priceCell}>{formatPrice(listing.price)}</span>
                                    <span>
                                        <span className={`badge ${listing.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                            {listing.status}
                                        </span>
                                    </span>
                                    <span className={styles.viewsCell}>
                                        <Eye size={14} /> {listing.views_count || 0}
                                    </span>
                                    <span className={styles.dateCell}>{timeAgo(listing.created_at)}</span>
                                    <div className={styles.actionsCell}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => toggleStatus(listing.id, listing.status)}
                                            title={listing.status === 'active' ? 'Deactivate' : 'Activate'}
                                        >
                                            {listing.status === 'active' ? <ToggleRight size={18} color="var(--success)" /> : <ToggleLeft size={18} />}
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => deleteListing(listing.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} color="var(--error)" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Building2 size={56} />
                        <h3>No listings yet</h3>
                        <p>Start by adding your first property</p>
                        <Link href="/properties/new" className="btn btn-primary">
                            <Plus size={18} /> Add Property
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
