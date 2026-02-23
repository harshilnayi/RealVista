'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { MapPin, Bed, Bath, Maximize, Navigation, Loader, Layers, X } from 'lucide-react';
import styles from './page.module.css';

export default function MapPage() {
    const supabase = createClient();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        const { data } = await supabase
            .from('properties')
            .select('id, title, price, listing_type, property_type, city, state, address, latitude, longitude, bedrooms, bathrooms, area_sqft, property_images(image_url, is_primary)')
            .eq('status', 'active')
            .not('latitude', 'is', null)
            .not('longitude', 'is', null)
            .limit(100);

        setProperties(data || []);
        setLoading(false);
    };

    // Dynamic import of Leaflet map (client-only)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadMap = async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            // Fix default icon issue
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            const existingMap = document.getElementById('map-container');
            if (!existingMap || existingMap._leaflet_id) return;

            const map = L.map('map-container').setView([20.5937, 78.9629], 5);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 18,
            }).addTo(map);

            properties.forEach((p) => {
                if (p.latitude && p.longitude) {
                    const marker = L.marker([p.latitude, p.longitude]).addTo(map);
                    marker.bindPopup(`
            <div style="min-width:200px">
              <strong style="font-size:14px">${p.title}</strong><br/>
              <span style="color:#6366f1;font-weight:700">${formatPrice(p.price)}</span><br/>
              <span style="font-size:12px;color:#94a3b8">${p.city}, ${p.state}</span><br/>
              <a href="/properties/${p.id}" style="color:#6366f1;font-size:12px;margin-top:4px;display:inline-block">View Details →</a>
            </div>
          `);
                    marker.on('click', () => setSelectedProperty(p));
                }
            });

            setMapLoaded(true);
        };

        if (!loading && properties.length >= 0) {
            setTimeout(loadMap, 100);
        }
    }, [loading, properties]);

    return (
        <div className={styles.mapPage}>
            {/* Header */}
            <div className={styles.mapHeader}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className={styles.pageTitle}>
                                <Navigation size={24} /> Map <span className="gradient-text">View</span>
                            </h1>
                            <p className={styles.subtitle}>{properties.length} properties with location data</p>
                        </div>
                        <Link href="/properties" className="btn btn-secondary btn-sm">
                            <Layers size={14} /> List View
                        </Link>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className={styles.mapWrapper}>
                {loading ? (
                    <div className={styles.mapLoading}>
                        <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                        <p>Loading map data...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className={styles.mapLoading}>
                        <MapPin size={48} style={{ color: 'var(--text-dim)' }} />
                        <h3>No properties with location data</h3>
                        <p>Properties need latitude/longitude to appear on the map.</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: 8 }}>
                            When listing a property, add coordinates in the location step.
                        </p>
                    </div>
                ) : null}
                <div id="map-container" className={styles.mapContainer} />
            </div>

            {/* Selected Property Sidebar */}
            {selectedProperty && (
                <div className={styles.propertySidebar}>
                    <button className={styles.sidebarClose} onClick={() => setSelectedProperty(null)}>
                        <X size={18} />
                    </button>
                    <Link href={`/properties/${selectedProperty.id}`} className={styles.sidebarCard}>
                        <img
                            src={
                                selectedProperty.property_images?.find(i => i.is_primary)?.image_url ||
                                selectedProperty.property_images?.[0]?.image_url ||
                                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
                            }
                            alt={selectedProperty.title}
                            className={styles.sidebarImg}
                        />
                        <div className={styles.sidebarInfo}>
                            <h3 className={styles.sidebarPrice}>{formatPrice(selectedProperty.price)}</h3>
                            <h4>{selectedProperty.title}</h4>
                            <p><MapPin size={14} /> {selectedProperty.city}, {selectedProperty.state}</p>
                            <div className={styles.sidebarSpecs}>
                                {selectedProperty.bedrooms > 0 && <span><Bed size={14} /> {selectedProperty.bedrooms}</span>}
                                {selectedProperty.bathrooms > 0 && <span><Bath size={14} /> {selectedProperty.bathrooms}</span>}
                                {selectedProperty.area_sqft > 0 && <span><Maximize size={14} /> {selectedProperty.area_sqft} sqft</span>}
                            </div>
                            <span className={styles.viewLink}>View Details →</span>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
