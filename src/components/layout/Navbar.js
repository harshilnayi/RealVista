'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NAV_LINKS } from '@/lib/constants';
import {
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    Building2,
    LogIn,
    UserPlus,
    ChevronDown,
} from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const closeMenus = () => {
        setMobileOpen(false);
        setDropdownOpen(false);
    };

    const syncUserState = useEffectEvent(async (nextUser) => {
        setUser(nextUser);

        if (!nextUser) {
            setProfile(null);
            return;
        }

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', nextUser.id)
            .single();

        setProfile(data);
    });

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser();
            await syncUserState(currentUser);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                await syncUserState(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        closeMenus();
        router.push('/');
        router.refresh();
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContainer}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo} onClick={closeMenus}>
                    <Building2 size={28} />
                    <span>Real<strong>Vista</strong></span>
                </Link>

                {/* Desktop Nav Links */}
                <div className={styles.navLinks}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Auth Section */}
                <div className={styles.authSection}>
                    {user ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userButton}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className={styles.avatar}>
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name} />
                                    ) : (
                                        <span>{profile?.full_name?.[0] || 'U'}</span>
                                    )}
                                </div>
                                <span className={styles.userName}>{profile?.full_name || 'User'}</span>
                                <ChevronDown size={16} className={dropdownOpen ? styles.rotated : ''} />
                            </button>

                            {dropdownOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <p className={styles.dropdownName}>{profile?.full_name}</p>
                                        <p className={styles.dropdownRole}>{profile?.role}</p>
                                    </div>
                                    <div className={styles.dropdownDivider} />
                                    <Link href="/dashboard" className={styles.dropdownItem} onClick={closeMenus}>
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                    <Link href="/dashboard/listings" className={styles.dropdownItem} onClick={closeMenus}>
                                        <Building2 size={16} />
                                        My Listings
                                    </Link>
                                    <Link href="/dashboard/settings" className={styles.dropdownItem} onClick={closeMenus}>
                                        <User size={16} />
                                        Profile
                                    </Link>
                                    <div className={styles.dropdownDivider} />
                                    <button onClick={handleLogout} className={styles.dropdownItem}>
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login" className="btn btn-ghost btn-sm" onClick={closeMenus}>
                                <LogIn size={16} />
                                Sign In
                            </Link>
                            <Link href="/register" className="btn btn-primary btn-sm" onClick={closeMenus}>
                                <UserPlus size={16} />
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className={styles.mobileMenu}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className={styles.dropdownDivider} />
                    {user ? (
                        <>
                            <Link href="/dashboard" className={styles.mobileLink} onClick={closeMenus}>
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <button onClick={handleLogout} className={styles.mobileLink}>
                                <LogOut size={18} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.mobileLink} onClick={closeMenus}>
                                <LogIn size={18} /> Sign In
                            </Link>
                            <Link href="/register" className={styles.mobileLink} onClick={closeMenus}>
                                <UserPlus size={18} /> Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
