import Link from 'next/link';
import {
    Shield, Zap, Users, Globe, Award, Target, Heart, ArrowRight,
    Building2, MapPin, Phone, Mail,
} from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
    title: 'About Us | RealVista',
    description: 'Learn about RealVista - India\'s smart property discovery platform connecting buyers, sellers, and agents.',
};

const TEAM = [
    { name: 'Built with ❤️', role: 'Final Year Project', desc: 'RealVista was crafted as a comprehensive real estate platform demonstrating modern web development.' },
];

const VALUES = [
    { icon: <Shield size={24} />, title: 'Trust & Transparency', desc: 'Every listing is verified and authentic, giving you confidence in your property journey.' },
    { icon: <Zap size={24} />, title: 'Innovation', desc: 'We leverage cutting-edge technology to make property search smarter and easier.' },
    { icon: <Users size={24} />, title: 'Community First', desc: 'Connecting buyers, sellers, and agents in a seamless, user-friendly ecosystem.' },
    { icon: <Globe size={24} />, title: 'Pan-India Coverage', desc: 'From metro cities to upcoming towns, we cover properties across India.' },
];

export default function AboutPage() {
    return (
        <div className={styles.aboutPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBlob1} />
                <div className={styles.heroBlob2} />
                <div className="container">
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>About RealVista</span>
                        <h1 className={styles.heroTitle}>
                            Redefining How India
                            <span className="gradient-text"> Discovers Property</span>
                        </h1>
                        <p className={styles.heroText}>
                            RealVista is a modern real estate platform designed to simplify the way
                            people buy, sell, and rent properties. We combine technology with trust
                            to create an exceptional property experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className={styles.mission}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionCard}>
                            <Target size={32} className={styles.missionIcon} />
                            <h3>Our Mission</h3>
                            <p>
                                To democratize property search in India by providing transparent,
                                technology-driven solutions that connect the right people with the
                                right properties.
                            </p>
                        </div>
                        <div className={styles.missionCard}>
                            <Award size={32} className={styles.missionIcon} />
                            <h3>Our Vision</h3>
                            <p>
                                To become India&apos;s most trusted and innovative property platform,
                                where every person can confidently make their real estate decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={styles.values}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Our Core Values</h2>
                    <div className={styles.valuesGrid}>
                        {VALUES.map((v, i) => (
                            <div key={i} className={styles.valueCard}>
                                <div className={styles.valueIcon}>{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>10K+</span>
                            <span className={styles.statLabel}>Properties Listed</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>50+</span>
                            <span className={styles.statLabel}>Cities Covered</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>5K+</span>
                            <span className={styles.statLabel}>Happy Users</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>98%</span>
                            <span className={styles.statLabel}>Satisfaction Rate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>Ready to Find Your Dream Property?</h2>
                        <p className={styles.ctaText}>
                            Join thousands of satisfied users who have found their perfect property through RealVista.
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/properties" className="btn btn-primary btn-lg">
                                Browse Properties <ArrowRight size={18} />
                            </Link>
                            <Link href="/register" className="btn btn-secondary btn-lg">
                                Join RealVista
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
