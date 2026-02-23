'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PLATFORM_STATS, PROPERTY_TYPES, CITIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  MapPin,
  ArrowRight,
  Building2,
  Home,
  Castle,
  LandPlot,
  Store,
  TrendingUp,
  Shield,
  Users,
  Star,
  ChevronRight,
  Heart,
  Bed,
  Bath,
  Maximize,
  Sparkles,
} from 'lucide-react';
import styles from './page.module.css';

const ICON_MAP = {
  Home, Building2, Castle, LandPlot, Store,
};

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('sale');
  const supabase = createClient();

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*, property_images(*), profiles(full_name, avatar_url)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);

    if (data) setFeaturedProperties(data);
  };

  return (
    <div className={styles.home}>
      {/* ── Hero Section ──────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroBlobOne} />
          <div className={styles.heroBlobTwo} />
          <div className={styles.heroBlobThree} />
          <div className={styles.heroGrid} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>India&apos;s Smartest Property Platform</span>
          </div>

          <h1 className={styles.heroTitle}>
            Find Your Dream
            <span className={styles.heroHighlight}> Property</span>
            <br />With Confidence
          </h1>

          <p className={styles.heroSubtitle}>
            Discover thousands of properties for sale and rent across India.
            Connect with verified agents and make informed decisions.
          </p>

          {/* Search Box */}
          <div className={styles.searchBox}>
            <div className={styles.searchTabs}>
              <button
                className={`${styles.searchTab} ${searchType === 'sale' ? styles.activeTab : ''}`}
                onClick={() => setSearchType('sale')}
              >
                Buy
              </button>
              <button
                className={`${styles.searchTab} ${searchType === 'rent' ? styles.activeTab : ''}`}
                onClick={() => setSearchType('rent')}
              >
                Rent
              </button>
            </div>

            <div className={styles.searchInputRow}>
              <div className={styles.searchInputGroup}>
                <MapPin size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by city, locality, or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <Link
                href={`/properties?search=${searchQuery}&type=${searchType}`}
                className={styles.searchButton}
              >
                <Search size={20} />
                <span>Search</span>
              </Link>
            </div>

            <div className={styles.popularSearches}>
              <span className={styles.popularLabel}>Popular:</span>
              {['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'].map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${city}&type=${searchType}`}
                  className={styles.popularTag}
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={styles.heroStats}>
            {PLATFORM_STATS.map((stat, i) => (
              <div key={i} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{stat.value}</span>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Property Types Section ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Explore by <span className="gradient-text">Property Type</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Find the perfect space that fits your lifestyle
            </p>
          </div>

          <div className={styles.typeGrid}>
            {PROPERTY_TYPES.map((type) => {
              const Icon = ICON_MAP[type.icon] || Building2;
              return (
                <Link
                  key={type.value}
                  href={`/properties?property_type=${type.value}`}
                  className={styles.typeCard}
                >
                  <div className={styles.typeIcon}>
                    <Icon size={28} />
                  </div>
                  <h3 className={styles.typeLabel}>{type.label}</h3>
                  <ChevronRight size={16} className={styles.typeArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Properties Section ───────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Featured <span className="gradient-text">Properties</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                Hand-picked properties just for you
              </p>
            </div>
            <Link href="/properties" className="btn btn-outline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className={styles.propertyGrid}>
              {featuredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className={styles.propertyCard}
                >
                  <div className={styles.propertyImage}>
                    <img
                      src={
                        property.property_images?.[0]?.image_url ||
                        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
                      }
                      alt={property.title}
                    />
                    <div className={styles.propertyBadges}>
                      <span className={`badge ${property.listing_type === 'sale' ? 'badge-primary' : 'badge-success'}`}>
                        For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                    </div>
                    <button className={styles.favoriteBtn} onClick={(e) => e.preventDefault()}>
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className={styles.propertyInfo}>
                    <h3 className={styles.propertyPrice}>{formatPrice(property.price)}</h3>
                    <h4 className={styles.propertyTitle}>{property.title}</h4>
                    <p className={styles.propertyLocation}>
                      <MapPin size={14} />
                      {property.city}, {property.state}
                    </p>
                    <div className={styles.propertySpecs}>
                      {property.bedrooms > 0 && (
                        <span className={styles.spec}>
                          <Bed size={14} /> {property.bedrooms} Beds
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className={styles.spec}>
                          <Bath size={14} /> {property.bathrooms} Baths
                        </span>
                      )}
                      {property.area_sqft > 0 && (
                        <span className={styles.spec}>
                          <Maximize size={14} /> {property.area_sqft} sq.ft
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Building2 size={48} className={styles.emptyIcon} />
              <h3>No properties listed yet</h3>
              <p>Be the first to list a property on RealVista!</p>
              <Link href="/register" className="btn btn-primary">
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us Section ─────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Why Choose <span className="gradient-text">RealVista</span>?
            </h2>
            <p className={styles.sectionSubtitle}>
              Everything you need for your property journey
            </p>
          </div>

          <div className={styles.featureGrid}>
            {[
              {
                icon: <Shield size={28} />,
                title: 'Verified Listings',
                desc: 'Every property is verified to ensure authenticity and accuracy of details.',
              },
              {
                icon: <TrendingUp size={28} />,
                title: 'Market Analytics',
                desc: 'Get real-time price trends and market insights for smarter decisions.',
              },
              {
                icon: <Users size={28} />,
                title: 'Expert Agents',
                desc: 'Connect with experienced agents who know the local market best.',
              },
              {
                icon: <Star size={28} />,
                title: 'Premium Experience',
                desc: 'Advanced search, comparison tools, and EMI calculator at your fingertips.',
              },
            ].map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to find your perfect property?</h2>
              <p className={styles.ctaSubtitle}>
                Join thousands of happy customers who found their dream home with RealVista.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/properties" className="btn btn-primary btn-lg">
                  Browse Properties <ArrowRight size={18} />
                </Link>
                <Link href="/register" className="btn btn-secondary btn-lg">
                  List Your Property
                </Link>
              </div>
            </div>
            <div className={styles.ctaDecor}>
              <Building2 size={120} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
