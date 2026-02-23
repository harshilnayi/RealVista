'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatArea } from '@/lib/utils';
import { Heart, MapPin, Bed, Bath, Maximize, Trash2, Building2, Loader } from 'lucide-react';
import styles from './page.module.css';

export default function FavoritesPage() {
    const supabase = createClient();
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login?redirect=/dashboard/favorites'); return; }

        const { data } = await supabase
            .from('favorites')
            .select('id, property_id, properties(*, property_images(image_url, is_primary))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        setFavorites(data || []);
        setLoading(false);
    };

    const removeFavorite = async (favId) => {
        await supabase.from('favorites').delete().eq('id', favId);
        setFavorites(prev => prev.filter(f => f.id !== favId));
    };

    if (loading) {
        return (
            <div className={styles.favPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                    <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.favPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        <Heart size={28} fill="var(--error)" color="var(--error)" />
                        My Favorites
                    </h1>
                    <p className={styles.pageSubtitle}>{favorites.length} saved properties</p>
                </div>

                {favorites.length > 0 ? (
                    <div className={styles.favGrid}>
                        {favorites.map(fav => {
                            const p = fav.properties;
                            if (!p) return null;
                            const img =
                                p.property_images?.find(i => i.is_primary)?.image_url ||
                                p.property_images?.[0]?.image_url ||
                                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop';
                            return (
                                <div key={fav.id} className={styles.favCard}>
                                    <Link href={`/properties/${p.id}`} className={styles.favLink}>
                                        <div className={styles.favImage}>
                                            <img src={img} alt={p.title} />
                                            <span className={`badge ${p.listing_type === 'sale' ? 'badge-primary' : 'badge-success'}`}>
                                                For {p.listing_type === 'sale' ? 'Sale' : 'Rent'}
                                            </span>
                                        </div>
                                        <div className={styles.favInfo}>
                                            <h3 className={styles.favPrice}>{formatPrice(p.price)}</h3>
                                            <h4 className={styles.favTitle}>{p.title}</h4>
                                            <p className={styles.favLocation}>
                                                <MapPin size={14} /> {p.city}, {p.state}
                                            </p>
                                            <div className={styles.favSpecs}>
                                                {p.bedrooms > 0 && <span><Bed size={14} /> {p.bedrooms}</span>}
                                                {p.bathrooms > 0 && <span><Bath size={14} /> {p.bathrooms}</span>}
                                                {p.area_sqft > 0 && <span><Maximize size={14} /> {formatArea(p.area_sqft)}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                    <button className={styles.removeBtn} onClick={() => removeFavorite(fav.id)} title="Remove">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Heart size={56} />
                        <h3>No favorites yet</h3>
                        <p>Save properties you like by clicking the heart icon</p>
                        <Link href="/properties" className="btn btn-primary">Browse Properties</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
