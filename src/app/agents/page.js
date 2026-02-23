'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { CITIES } from '@/lib/constants';
import { Users, MapPin, Phone, Mail, Building2, Search, Star, Briefcase, Loader } from 'lucide-react';
import styles from './page.module.css';

export default function AgentsPage() {
    const supabase = createClient();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, avatar_url, bio, city, role, created_at')
            .in('role', ['agent', 'seller'])
            .order('created_at', { ascending: false });

        setAgents(data || []);
        setLoading(false);
    };

    const filtered = agents.filter(agent => {
        const matchSearch = !search ||
            agent.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            agent.bio?.toLowerCase().includes(search.toLowerCase());
        const matchCity = !cityFilter || agent.city === cityFilter;
        return matchSearch && matchCity;
    });

    // Count listings per agent
    const [listingCounts, setListingCounts] = useState({});
    useEffect(() => {
        if (agents.length > 0) {
            const fetchCounts = async () => {
                const counts = {};
                for (const agent of agents) {
                    const { count } = await supabase
                        .from('properties')
                        .select('*', { count: 'exact', head: true })
                        .eq('owner_id', agent.id)
                        .eq('status', 'active');
                    counts[agent.id] = count || 0;
                }
                setListingCounts(counts);
            };
            fetchCounts();
        }
    }, [agents]);

    return (
        <div className={styles.agentsPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        Our <span className="gradient-text">Agents & Sellers</span>
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Connect with trusted real estate professionals
                    </p>
                </div>

                {/* Search/Filter */}
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="input select"
                        style={{ maxWidth: 200 }}
                    >
                        <option value="">All Cities</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Agents Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                        <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className={styles.agentsGrid}>
                        {filtered.map(agent => (
                            <div key={agent.id} className={styles.agentCard}>
                                <div className={styles.agentAvatar}>
                                    {agent.avatar_url ? (
                                        <img src={agent.avatar_url} alt={agent.full_name} />
                                    ) : (
                                        <span>{agent.full_name?.[0] || '?'}</span>
                                    )}
                                </div>
                                <div className={styles.agentInfo}>
                                    <h3 className={styles.agentName}>{agent.full_name}</h3>
                                    <span className={`badge ${agent.role === 'agent' ? 'badge-primary' : 'badge-success'}`}>
                                        {agent.role === 'agent' ? 'Agent' : 'Seller'}
                                    </span>
                                </div>
                                {agent.city && (
                                    <p className={styles.agentCity}>
                                        <MapPin size={14} /> {agent.city}
                                    </p>
                                )}
                                {agent.bio && (
                                    <p className={styles.agentBio}>{agent.bio.slice(0, 100)}{agent.bio.length > 100 ? '...' : ''}</p>
                                )}
                                <div className={styles.agentStats}>
                                    <div className={styles.agentStat}>
                                        <Building2 size={14} />
                                        <span>{listingCounts[agent.id] || 0} Listings</span>
                                    </div>
                                </div>
                                <div className={styles.agentActions}>
                                    {agent.phone && (
                                        <a href={`tel:${agent.phone}`} className="btn btn-secondary btn-sm">
                                            <Phone size={14} /> Call
                                        </a>
                                    )}
                                    {agent.email && (
                                        <a href={`mailto:${agent.email}`} className="btn btn-primary btn-sm">
                                            <Mail size={14} /> Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Users size={56} />
                        <h3>No agents found</h3>
                        <p>
                            {agents.length === 0
                                ? 'No agents or sellers have registered yet. Be the first!'
                                : 'Try adjusting your search filters.'}
                        </p>
                        {agents.length === 0 && (
                            <Link href="/register" className="btn btn-primary">Join as Agent</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
