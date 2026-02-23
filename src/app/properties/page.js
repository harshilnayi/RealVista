'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PROPERTY_TYPES, LISTING_TYPES, BEDROOM_OPTIONS, SORT_OPTIONS, CITIES } from '@/lib/constants';
import { formatPrice, formatArea } from '@/lib/utils';
import {
    Search, MapPin, SlidersHorizontal, X, Bed, Bath, Maximize,
    Heart, ChevronDown, Grid3X3, List, Building2, ArrowRight,
    Plus, ArrowUpDown
} from 'lucide-react';
import styles from './page.module.css';

function PropertiesContent() {
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [totalCount, setTotalCount] = useState(0);

    // Filter state
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        city: searchParams.get('city') || '',
        listing_type: searchParams.get('type') || '',
        property_type: searchParams.get('property_type') || '',
        bedrooms: '',
        min_price: '',
        max_price: '',
        min_area: '',
        max_area: '',
        sort: 'newest',
    });

    useEffect(() => {
        loadProperties();
    }, [filters]);

    const loadProperties = async () => {
        setLoading(true);
        let query = supabase
            .from('properties')
            .select('*, property_images(*), profiles(full_name, avatar_url)', { count: 'exact' })
            .eq('status', 'active');

        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
        }
        if (filters.city) query = query.ilike('city', `%${filters.city}%`);
        if (filters.listing_type) query = query.eq('listing_type', filters.listing_type);
        if (filters.property_type) query = query.eq('property_type', filters.property_type);
        if (filters.bedrooms) query = query.gte('bedrooms', parseInt(filters.bedrooms));
        if (filters.min_price) query = query.gte('price', parseFloat(filters.min_price));
        if (filters.max_price) query = query.lte('price', parseFloat(filters.max_price));
        if (filters.min_area) query = query.gte('area_sqft', parseFloat(filters.min_area));
        if (filters.max_area) query = query.lte('area_sqft', parseFloat(filters.max_area));

        // Sort
        switch (filters.sort) {
            case 'newest': query = query.order('created_at', { ascending: false }); break;
            case 'oldest': query = query.order('created_at', { ascending: true }); break;
            case 'price_low': query = query.order('price', { ascending: true }); break;
            case 'price_high': query = query.order('price', { ascending: false }); break;
            case 'area_low': query = query.order('area_sqft', { ascending: true }); break;
            case 'area_high': query = query.order('area_sqft', { ascending: false }); break;
        }

        const { data, count } = await query.limit(24);
        setProperties(data || []);
        setTotalCount(count || 0);
        setLoading(false);
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '', city: '', listing_type: '', property_type: '',
            bedrooms: '', min_price: '', max_price: '', min_area: '', max_area: '', sort: 'newest',
        });
    };

    const activeFilterCount = Object.entries(filters)
        .filter(([k, v]) => v && k !== 'sort' && k !== 'search')
        .length;

    return (
        <div className={styles.propertiesPage}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            Browse <span className="gradient-text">Properties</span>
                        </h1>
                        <p className={styles.pageSubtitle}>
                            {totalCount} properties available
                        </p>
                    </div>
                    <Link href="/properties/new" className="btn btn-primary">
                        <Plus size={18} /> List Property
                    </Link>
                </div>

                {/* Search & Filter Bar */}
                <div className={styles.searchBar}>
                    <div className={styles.searchInputGroup}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by title, address, or city..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.searchActions}>
                        <button
                            className={`btn btn-secondary ${styles.filterToggle} ${showFilters ? styles.filterActive : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className={styles.filterBadge}>{activeFilterCount}</span>
                            )}
                        </button>

                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewActive : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 size={16} />
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewActive : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={16} />
                            </button>
                        </div>

                        <select
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            className={`input select ${styles.sortSelect}`}
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className={styles.filterPanel}>
                        <div className={styles.filterGrid}>
                            <div className="input-group">
                                <label className="input-label">City</label>
                                <select
                                    value={filters.city}
                                    onChange={(e) => updateFilter('city', e.target.value)}
                                    className="input select"
                                >
                                    <option value="">All Cities</option>
                                    {CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Listing Type</label>
                                <select
                                    value={filters.listing_type}
                                    onChange={(e) => updateFilter('listing_type', e.target.value)}
                                    className="input select"
                                >
                                    <option value="">All Types</option>
                                    {LISTING_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Property Type</label>
                                <select
                                    value={filters.property_type}
                                    onChange={(e) => updateFilter('property_type', e.target.value)}
                                    className="input select"
                                >
                                    <option value="">All Properties</option>
                                    {PROPERTY_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Bedrooms</label>
                                <select
                                    value={filters.bedrooms}
                                    onChange={(e) => updateFilter('bedrooms', e.target.value)}
                                    className="input select"
                                >
                                    <option value="">Any</option>
                                    {BEDROOM_OPTIONS.map(b => (
                                        <option key={b.value} value={b.value}>{b.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Min Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.min_price}
                                    onChange={(e) => updateFilter('min_price', e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Max Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.max_price}
                                    onChange={(e) => updateFilter('max_price', e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className={styles.filterActions}>
                            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                                <X size={14} /> Clear All
                            </button>
                        </div>
                    </div>
                )}

                {/* Property Grid / List */}
                {loading ? (
                    <div className={styles.gridSkeleton}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={styles.skeletonCard}>
                                <div className={`skeleton ${styles.skeletonImg}`} />
                                <div className={styles.skeletonBody}>
                                    <div className="skeleton" style={{ height: 20, width: '60%' }} />
                                    <div className="skeleton" style={{ height: 16, width: '80%' }} />
                                    <div className="skeleton" style={{ height: 14, width: '50%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : properties.length > 0 ? (
                    <div className={viewMode === 'grid' ? styles.propertyGrid : styles.propertyList}>
                        {properties.map((property) => (
                            <Link
                                key={property.id}
                                href={`/properties/${property.id}`}
                                className={viewMode === 'grid' ? styles.propertyCard : styles.propertyCardList}
                            >
                                <div className={styles.propertyImage}>
                                    <img
                                        src={
                                            property.property_images?.find(img => img.is_primary)?.image_url ||
                                            property.property_images?.[0]?.image_url ||
                                            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
                                        }
                                        alt={property.title}
                                    />
                                    <div className={styles.propertyBadges}>
                                        <span className={`badge ${property.listing_type === 'sale' ? 'badge-primary' : 'badge-success'}`}>
                                            For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                                        </span>
                                        <span className="badge badge-info">{property.property_type}</span>
                                    </div>
                                    <button className={styles.favBtn} onClick={(e) => e.preventDefault()}>
                                        <Heart size={18} />
                                    </button>
                                </div>
                                <div className={styles.propertyInfo}>
                                    <h3 className={styles.propertyPrice}>
                                        {formatPrice(property.price)}
                                        {property.listing_type === 'rent' && <span className={styles.perMonth}>/mo</span>}
                                    </h3>
                                    <h4 className={styles.propertyTitle}>{property.title}</h4>
                                    <p className={styles.propertyLocation}>
                                        <MapPin size={14} />
                                        {property.address ? `${property.address}, ` : ''}{property.city}, {property.state}
                                    </p>
                                    <div className={styles.propertySpecs}>
                                        {property.bedrooms > 0 && (
                                            <span className={styles.spec}><Bed size={14} /> {property.bedrooms} Beds</span>
                                        )}
                                        {property.bathrooms > 0 && (
                                            <span className={styles.spec}><Bath size={14} /> {property.bathrooms} Baths</span>
                                        )}
                                        {property.area_sqft > 0 && (
                                            <span className={styles.spec}><Maximize size={14} /> {formatArea(property.area_sqft)}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Building2 size={56} />
                        <h3>No properties found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button className="btn btn-primary" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={
            <div className="container" style={{ padding: '4rem 0' }}>
                <div className="skeleton" style={{ height: 40, width: '40%', marginBottom: 24 }} />
                <div className="skeleton" style={{ height: 56, width: '100%', marginBottom: 24 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 300 }} />)}
                </div>
            </div>
        }>
            <PropertiesContent />
        </Suspense>
    );
}
