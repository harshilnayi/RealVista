'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, CITIES } from '@/lib/constants';
import { Building2, Save, Loader, ArrowLeft, Check, Trash2 } from 'lucide-react';
import styles from './page.module.css';

export default function EditPropertyPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', price: '', property_type: 'apartment',
        listing_type: 'sale', bedrooms: '', bathrooms: '', area_sqft: '',
        address: '', city: '', state: '', pincode: '',
        latitude: '', longitude: '', amenities: [],
    });

    useEffect(() => {
        loadProperty();
    }, []);

    const loadProperty = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setUser(user);

        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            toast.error('Property not found');
            router.push('/dashboard/listings');
            return;
        }

        if (data.owner_id !== user.id) {
            toast.error('You can only edit your own properties');
            router.push('/dashboard/listings');
            return;
        }

        setForm({
            title: data.title || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            property_type: data.property_type || 'apartment',
            listing_type: data.listing_type || 'sale',
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            area_sqft: data.area_sqft?.toString() || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || '',
            latitude: data.latitude?.toString() || '',
            longitude: data.longitude?.toString() || '',
            amenities: data.amenities || [],
        });
        setLoading(false);
    };

    const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const toggleAmenity = (amenity) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('properties')
            .update({
                title: form.title,
                description: form.description,
                price: parseFloat(form.price) || 0,
                property_type: form.property_type,
                listing_type: form.listing_type,
                bedrooms: parseInt(form.bedrooms) || 0,
                bathrooms: parseInt(form.bathrooms) || 0,
                area_sqft: parseFloat(form.area_sqft) || 0,
                address: form.address,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                latitude: parseFloat(form.latitude) || null,
                longitude: parseFloat(form.longitude) || null,
                amenities: form.amenities,
            })
            .eq('id', id);

        if (error) {
            toast.error('Failed to update property');
        } else {
            toast.success('Property updated successfully!');
            router.push(`/properties/${id}`);
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this listing?')) return;
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) {
            toast.error('Failed to delete property');
        } else {
            toast.success('Property deleted');
            router.push('/dashboard/listings');
        }
    };

    if (loading) {
        return (
            <div className={styles.editPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                    <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editPage}>
            <div className="container">
                <div className={styles.formContainer}>
                    {/* Header */}
                    <div className={styles.formHeader}>
                        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h1 className={styles.formTitle}>
                            <Building2 size={24} /> Edit Property
                        </h1>
                    </div>

                    <form onSubmit={handleSave}>
                        {/* Basic Info */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Basic Information</h3>
                            <div className={styles.formGrid}>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Title *</label>
                                    <input type="text" className="input" value={form.title} onChange={(e) => updateForm('title', e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Listing Type</label>
                                    <select className="input select" value={form.listing_type} onChange={(e) => updateForm('listing_type', e.target.value)}>
                                        {LISTING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Property Type</label>
                                    <select className="input select" value={form.property_type} onChange={(e) => updateForm('property_type', e.target.value)}>
                                        {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price (₹) *</label>
                                    <input type="number" className="input" value={form.price} onChange={(e) => updateForm('price', e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Area (sq.ft)</label>
                                    <input type="number" className="input" value={form.area_sqft} onChange={(e) => updateForm('area_sqft', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Bedrooms</label>
                                    <input type="number" className="input" min="0" value={form.bedrooms} onChange={(e) => updateForm('bedrooms', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Bathrooms</label>
                                    <input type="number" className="input" min="0" value={form.bathrooms} onChange={(e) => updateForm('bathrooms', e.target.value)} />
                                </div>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Description</label>
                                    <textarea className="input" rows={5} style={{ resize: 'vertical' }} value={form.description} onChange={(e) => updateForm('description', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Location</h3>
                            <div className={styles.formGrid}>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Address</label>
                                    <input type="text" className="input" value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">City *</label>
                                    <select className="input select" value={form.city} onChange={(e) => updateForm('city', e.target.value)} required>
                                        <option value="">Select City</option>
                                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">State</label>
                                    <input type="text" className="input" value={form.state} onChange={(e) => updateForm('state', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Pincode</label>
                                    <input type="text" className="input" value={form.pincode} onChange={(e) => updateForm('pincode', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Amenities</h3>
                            <div className={styles.amenitiesGrid}>
                                {AMENITIES.map(amenity => (
                                    <button key={amenity} type="button"
                                        className={`${styles.amenityChip} ${form.amenities.includes(amenity) ? styles.amenityActive : ''}`}
                                        onClick={() => toggleAmenity(amenity)}>
                                        {form.amenities.includes(amenity) && <Check size={14} />}
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.formActions}>
                            <button type="button" className={`btn btn-secondary ${styles.deleteBtn}`} onClick={handleDelete}>
                                <Trash2 size={16} /> Delete Listing
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                                {saving ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
