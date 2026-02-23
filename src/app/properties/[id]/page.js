'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatArea, timeAgo, getPropertyTypeLabel, getStatusColor } from '@/lib/utils';
import {
    MapPin, Bed, Bath, Maximize, Calendar, Eye, Heart, Share2,
    ChevronLeft, ChevronRight, Building2, User, Phone, Mail,
    Send, X, Check, ArrowLeft, Bookmark, Home,
} from 'lucide-react';
import styles from './page.module.css';

export default function PropertyDetailPage() {
    const { id } = useParams();
    const supabase = createClient();
    const [property, setProperty] = useState(null);
    const [owner, setOwner] = useState(null);
    const [images, setImages] = useState([]);
    const [currentImg, setCurrentImg] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const [inquiry, setInquiry] = useState({ message: '', phone: '', email: '' });
    const [inquirySent, setInquirySent] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        loadProperty();
        loadUser();
    }, [id]);

    const loadUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            const { data } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', user.id)
                .eq('property_id', id)
                .single();
            setIsFav(!!data);
        }
    };

    const loadProperty = async () => {
        const { data } = await supabase
            .from('properties')
            .select('*, property_images(*), profiles(id, full_name, email, phone, avatar_url, role, bio, city)')
            .eq('id', id)
            .single();

        if (data) {
            setProperty(data);
            setOwner(data.profiles);
            setImages(
                data.property_images?.sort((a, b) => a.display_order - b.display_order) || []
            );
            // Increment views
            supabase.from('properties').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id).then();
        }
        setLoading(false);
    };

    const toggleFavorite = async () => {
        if (!user) return;
        if (isFav) {
            await supabase.from('favorites').delete().eq('user_id', user.id).eq('property_id', id);
        } else {
            await supabase.from('favorites').insert({ user_id: user.id, property_id: id });
        }
        setIsFav(!isFav);
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        if (!user || !property) return;

        await supabase.from('inquiries').insert({
            sender_id: user.id,
            property_id: property.id,
            receiver_id: property.owner_id,
            message: inquiry.message,
            phone: inquiry.phone,
            email: inquiry.email,
        });
        setInquirySent(true);
    };

    if (loading) {
        return (
            <div className={styles.detailPage}>
                <div className="container">
                    <div className="skeleton" style={{ height: 400, borderRadius: 16, marginBottom: 24 }} />
                    <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className={styles.detailPage}>
                <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
                    <Building2 size={64} style={{ color: 'var(--text-dim)', marginBottom: 16 }} />
                    <h2>Property Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                        This property may have been removed or doesn&apos;t exist.
                    </p>
                    <Link href="/properties" className="btn btn-primary">
                        <ArrowLeft size={16} /> Browse Properties
                    </Link>
                </div>
            </div>
        );
    }

    const defaultImg = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop';

    return (
        <div className={styles.detailPage}>
            <div className="container">
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <Link href="/properties" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Properties
                    </Link>
                </div>

                {/* Image Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImage} onClick={() => setShowGallery(true)}>
                        <img
                            src={images[currentImg]?.image_url || defaultImg}
                            alt={property.title}
                        />
                        <div className={styles.imgCounter}>
                            {currentImg + 1} / {Math.max(images.length, 1)}
                        </div>
                        {images.length > 1 && (
                            <>
                                <button
                                    className={`${styles.galleryNav} ${styles.galleryPrev}`}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImg(i => i > 0 ? i - 1 : images.length - 1); }}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    className={`${styles.galleryNav} ${styles.galleryNext}`}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImg(i => i < images.length - 1 ? i + 1 : 0); }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className={styles.thumbnails}>
                            {images.slice(0, 5).map((img, i) => (
                                <button
                                    key={img.id}
                                    className={`${styles.thumb} ${i === currentImg ? styles.thumbActive : ''}`}
                                    onClick={() => setCurrentImg(i)}
                                >
                                    <img src={img.image_url} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={styles.contentGrid}>
                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        {/* Title & Price */}
                        <div className={styles.titleSection}>
                            <div className={styles.badges}>
                                <span className={`badge ${property.listing_type === 'sale' ? 'badge-primary' : 'badge-success'}`}>
                                    For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                                </span>
                                <span className={`badge ${getStatusColor(property.status)}`}>
                                    {property.status}
                                </span>
                                <span className="badge badge-info">{getPropertyTypeLabel(property.property_type)}</span>
                            </div>
                            <h1 className={styles.title}>{property.title}</h1>
                            <p className={styles.location}>
                                <MapPin size={16} />
                                {property.address && `${property.address}, `}{property.city}, {property.state}
                                {property.pincode && ` - ${property.pincode}`}
                            </p>
                            <div className={styles.priceRow}>
                                <h2 className={styles.price}>
                                    {formatPrice(property.price)}
                                    {property.listing_type === 'rent' && <span className={styles.perMonth}>/month</span>}
                                </h2>
                                <div className={styles.actions}>
                                    <button
                                        className={`btn btn-secondary btn-icon ${isFav ? styles.favActive : ''}`}
                                        onClick={toggleFavorite}
                                    >
                                        <Heart size={18} fill={isFav ? 'var(--error)' : 'none'} color={isFav ? 'var(--error)' : 'currentColor'} />
                                    </button>
                                    <button className="btn btn-secondary btn-icon">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Key Specs */}
                        <div className={styles.specsGrid}>
                            {property.bedrooms > 0 && (
                                <div className={styles.specCard}>
                                    <Bed size={22} />
                                    <div>
                                        <span className={styles.specValue}>{property.bedrooms}</span>
                                        <span className={styles.specLabel}>Bedrooms</span>
                                    </div>
                                </div>
                            )}
                            {property.bathrooms > 0 && (
                                <div className={styles.specCard}>
                                    <Bath size={22} />
                                    <div>
                                        <span className={styles.specValue}>{property.bathrooms}</span>
                                        <span className={styles.specLabel}>Bathrooms</span>
                                    </div>
                                </div>
                            )}
                            {property.area_sqft > 0 && (
                                <div className={styles.specCard}>
                                    <Maximize size={22} />
                                    <div>
                                        <span className={styles.specValue}>{formatArea(property.area_sqft)}</span>
                                        <span className={styles.specLabel}>Area</span>
                                    </div>
                                </div>
                            )}
                            <div className={styles.specCard}>
                                <Eye size={22} />
                                <div>
                                    <span className={styles.specValue}>{property.views_count || 0}</span>
                                    <span className={styles.specLabel}>Views</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Description</h3>
                            <p className={styles.description}>
                                {property.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Amenities */}
                        {property.amenities?.length > 0 && (
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Amenities</h3>
                                <div className={styles.amenitiesGrid}>
                                    {property.amenities.map((amenity, i) => (
                                        <div key={i} className={styles.amenityTag}>
                                            <Check size={14} />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Details</h3>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailRow}>
                                    <span>Property Type</span>
                                    <strong>{getPropertyTypeLabel(property.property_type)}</strong>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Listing Type</span>
                                    <strong>{property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</strong>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Status</span>
                                    <strong style={{ textTransform: 'capitalize' }}>{property.status}</strong>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Listed</span>
                                    <strong>{timeAgo(property.created_at)}</strong>
                                </div>
                                {property.pincode && (
                                    <div className={styles.detailRow}>
                                        <span>Pincode</span>
                                        <strong>{property.pincode}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        {/* Owner Card */}
                        {owner && (
                            <div className={styles.ownerCard}>
                                <div className={styles.ownerHeader}>
                                    <div className={styles.ownerAvatar}>
                                        {owner.avatar_url ? (
                                            <img src={owner.avatar_url} alt={owner.full_name} />
                                        ) : (
                                            <span>{owner.full_name?.[0]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={styles.ownerName}>{owner.full_name}</h4>
                                        <span className={styles.ownerRole}>{owner.role}</span>
                                    </div>
                                </div>
                                {owner.phone && (
                                    <a href={`tel:${owner.phone}`} className={styles.ownerContact}>
                                        <Phone size={14} /> {owner.phone}
                                    </a>
                                )}
                                {owner.email && (
                                    <a href={`mailto:${owner.email}`} className={styles.ownerContact}>
                                        <Mail size={14} /> {owner.email}
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Inquiry Form */}
                        <div className={styles.inquiryCard}>
                            <h3 className={styles.inquiryTitle}>
                                <Send size={18} /> Send Inquiry
                            </h3>
                            {inquirySent ? (
                                <div className={styles.inquirySuccess}>
                                    <Check size={32} />
                                    <h4>Inquiry Sent!</h4>
                                    <p>The owner will get back to you soon.</p>
                                </div>
                            ) : user ? (
                                <form onSubmit={handleInquiry} className={styles.inquiryForm}>
                                    <textarea
                                        className="input textarea"
                                        placeholder="Hi, I'm interested in this property..."
                                        value={inquiry.message}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, message: e.target.value }))}
                                        required
                                        rows={4}
                                    />
                                    <input
                                        type="tel"
                                        className="input"
                                        placeholder="Your phone number"
                                        value={inquiry.phone}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Your email"
                                        value={inquiry.email}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                    <button type="submit" className="btn btn-primary w-full">
                                        <Send size={16} /> Send Inquiry
                                    </button>
                                </form>
                            ) : (
                                <div className={styles.loginPrompt}>
                                    <p>Sign in to send an inquiry</p>
                                    <Link href={`/login?redirect=/properties/${id}`} className="btn btn-primary w-full">
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Gallery Modal */}
            {showGallery && (
                <div className={styles.galleryModal} onClick={() => setShowGallery(false)}>
                    <button className={styles.galleryClose} onClick={() => setShowGallery(false)}>
                        <X size={24} />
                    </button>
                    <img
                        src={images[currentImg]?.image_url || defaultImg}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        className={styles.galleryModalImg}
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                className={`${styles.galleryNav} ${styles.galleryPrev}`}
                                onClick={(e) => { e.stopPropagation(); setCurrentImg(i => i > 0 ? i - 1 : images.length - 1); }}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                className={`${styles.galleryNav} ${styles.galleryNext}`}
                                onClick={(e) => { e.stopPropagation(); setCurrentImg(i => i < images.length - 1 ? i + 1 : 0); }}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
