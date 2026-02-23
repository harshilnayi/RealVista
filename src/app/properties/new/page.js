'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, CITIES } from '@/lib/constants';
import {
    Building2, ImagePlus, X, Upload, MapPin, DollarSign, ArrowRight, ArrowLeft, Check, Loader,
} from 'lucide-react';
import styles from './page.module.css';

export default function NewPropertyPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', price: '', property_type: 'apartment',
        listing_type: 'sale', bedrooms: '', bathrooms: '', area_sqft: '',
        address: '', city: '', state: '', pincode: '',
        latitude: '', longitude: '', amenities: [],
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/login?redirect=/properties/new'); return; }
            setUser(user);
        };
        getUser();
    }, []);

    const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const toggleAmenity = (amenity) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            // 1. Insert property
            const { data: property, error: propError } = await supabase
                .from('properties')
                .insert({
                    owner_id: user.id,
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
                .select()
                .single();

            if (propError) throw propError;

            // 2. Upload images
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const ext = img.file.name.split('.').pop();
                const path = `${user.id}/${property.id}/${i}.${ext}`;

                const { error: uploadErr } = await supabase.storage
                    .from('property-images')
                    .upload(path, img.file);

                if (!uploadErr) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('property-images')
                        .getPublicUrl(path);

                    await supabase.from('property_images').insert({
                        property_id: property.id,
                        image_url: publicUrl,
                        display_order: i,
                        is_primary: i === 0,
                    });
                }
            }

            router.push(`/properties/${property.id}`);
        } catch (err) {
            console.error('Error creating property:', err);
            alert('Failed to create property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalSteps = 3;

    return (
        <div className={styles.newPropertyPage}>
            <div className="container">
                <div className={styles.formContainer}>
                    {/* Header */}
                    <div className={styles.formHeader}>
                        <h1 className={styles.formTitle}>
                            <Building2 size={28} />
                            List Your Property
                        </h1>
                        <p className={styles.formSubtitle}>Fill in the details to list your property</p>

                        {/* Progress */}
                        <div className={styles.progress}>
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={`${styles.progressStep} ${s <= step ? styles.progressActive : ''} ${s < step ? styles.progressDone : ''}`}
                                >
                                    <div className={styles.progressDot}>
                                        {s < step ? <Check size={14} /> : s}
                                    </div>
                                    <span>{s === 1 ? 'Basic Info' : s === 2 ? 'Details' : 'Images'}</span>
                                </div>
                            ))}
                            <div className={styles.progressLine}>
                                <div className={styles.progressFill} style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className={styles.formStep}>
                                <div className={styles.formGrid}>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="input-label">Property Title *</label>
                                        <input
                                            type="text" className="input" placeholder="e.g. Spacious 3BHK Apartment in Bandra"
                                            value={form.title} onChange={(e) => updateForm('title', e.target.value)} required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Listing Type *</label>
                                        <select className="input select" value={form.listing_type} onChange={(e) => updateForm('listing_type', e.target.value)}>
                                            {LISTING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Property Type *</label>
                                        <select className="input select" value={form.property_type} onChange={(e) => updateForm('property_type', e.target.value)}>
                                            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Price (₹) *</label>
                                        <input
                                            type="number" className="input" placeholder="e.g. 5000000"
                                            value={form.price} onChange={(e) => updateForm('price', e.target.value)} required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Area (sq.ft)</label>
                                        <input
                                            type="number" className="input" placeholder="e.g. 1200"
                                            value={form.area_sqft} onChange={(e) => updateForm('area_sqft', e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Bedrooms</label>
                                        <input
                                            type="number" className="input" placeholder="e.g. 3" min="0"
                                            value={form.bedrooms} onChange={(e) => updateForm('bedrooms', e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Bathrooms</label>
                                        <input
                                            type="number" className="input" placeholder="e.g. 2" min="0"
                                            value={form.bathrooms} onChange={(e) => updateForm('bathrooms', e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="input-label">Description</label>
                                        <textarea
                                            className="input textarea" placeholder="Describe your property..." rows={5}
                                            value={form.description} onChange={(e) => updateForm('description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location & Amenities */}
                        {step === 2 && (
                            <div className={styles.formStep}>
                                <div className={styles.formGrid}>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="input-label">Street Address</label>
                                        <input
                                            type="text" className="input" placeholder="e.g. 42, Marine Drive"
                                            value={form.address} onChange={(e) => updateForm('address', e.target.value)}
                                        />
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
                                        <input
                                            type="text" className="input" placeholder="e.g. Maharashtra"
                                            value={form.state} onChange={(e) => updateForm('state', e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Pincode</label>
                                        <input
                                            type="text" className="input" placeholder="e.g. 400001"
                                            value={form.pincode} onChange={(e) => updateForm('pincode', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.amenitiesSection}>
                                    <label className="input-label">Amenities</label>
                                    <div className={styles.amenitiesGrid}>
                                        {AMENITIES.map(amenity => (
                                            <button
                                                key={amenity}
                                                type="button"
                                                className={`${styles.amenityChip} ${form.amenities.includes(amenity) ? styles.amenityActive : ''}`}
                                                onClick={() => toggleAmenity(amenity)}
                                            >
                                                {form.amenities.includes(amenity) && <Check size={14} />}
                                                {amenity}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Images */}
                        {step === 3 && (
                            <div className={styles.formStep}>
                                <div className={styles.imageUpload}>
                                    <label className={styles.uploadArea}>
                                        <input
                                            type="file" accept="image/*" multiple
                                            onChange={handleImageUpload} style={{ display: 'none' }}
                                        />
                                        <Upload size={32} />
                                        <span>Click to upload images</span>
                                        <span className={styles.uploadHint}>JPG, PNG up to 5MB each</span>
                                    </label>
                                </div>

                                {images.length > 0 && (
                                    <div className={styles.imagePreviewGrid}>
                                        {images.map((img, i) => (
                                            <div key={i} className={styles.imagePreview}>
                                                <img src={img.preview} alt="" />
                                                {i === 0 && <span className={styles.primaryBadge}>Primary</span>}
                                                <button
                                                    type="button"
                                                    className={styles.removeImg}
                                                    onClick={() => removeImage(i)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className={styles.formNav}>
                            {step > 1 && (
                                <button type="button" className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
                                    <ArrowLeft size={16} /> Previous
                                </button>
                            )}
                            <div style={{ flex: 1 }} />
                            {step < totalSteps ? (
                                <button type="button" className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
                                    Next <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? <><Loader size={18} className="animate-spin" /> Publishing...</> : <>Publish Property <Check size={18} /></>}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
