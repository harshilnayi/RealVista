import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <Building2 size={24} />
                            <span>Real<strong>Vista</strong></span>
                        </Link>
                        <p className={styles.brandDesc}>
                            Your trusted platform for finding the perfect property.
                            Buy, sell, or rent with confidence.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialLink} aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="GitHub">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkTitle}>Quick Links</h4>
                        <Link href="/properties" className={styles.link}>Browse Properties</Link>
                        <Link href="/map" className={styles.link}>Map View</Link>
                        <Link href="/agents" className={styles.link}>Find Agents</Link>
                        <Link href="/calculator" className={styles.link}>EMI Calculator</Link>
                    </div>

                    {/* For Users */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkTitle}>For Users</h4>
                        <Link href="/register" className={styles.link}>Create Account</Link>
                        <Link href="/properties/new" className={styles.link}>List Property</Link>
                        <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                        <Link href="/compare" className={styles.link}>Compare Properties</Link>
                    </div>

                    {/* Contact */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkTitle}>Contact Us</h4>
                        <a href="mailto:hello@realvista.com" className={styles.contactItem}>
                            <Mail size={14} />
                            hello@realvista.com
                        </a>
                        <a href="tel:+911234567890" className={styles.contactItem}>
                            <Phone size={14} />
                            +91 123 456 7890
                        </a>
                        <span className={styles.contactItem}>
                            <MapPin size={14} />
                            Mumbai, Maharashtra, India
                        </span>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} RealVista. All rights reserved.
                    </p>
                    <div className={styles.bottomLinks}>
                        <Link href="/about" className={styles.bottomLink}>About</Link>
                        <span className={styles.dot}>·</span>
                        <Link href="/about" className={styles.bottomLink}>Privacy</Link>
                        <span className={styles.dot}>·</span>
                        <Link href="/about" className={styles.bottomLink}>Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
