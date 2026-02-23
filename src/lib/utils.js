/**
 * Format price in Indian currency format (₹)
 */
export function formatPrice(price) {
    if (!price && price !== 0) return '₹0';

    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} L`;
    } else if (price >= 1000) {
        return `₹${(price / 1000).toFixed(1)}K`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Format area in sq.ft
 */
export function formatArea(area) {
    if (!area) return '0 sq.ft';
    return `${area.toLocaleString('en-IN')} sq.ft`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Get time ago string
 */
export function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
}

/**
 * Generate initials from name
 */
export function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Truncate text
 */
export function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Calculate EMI
 */
export function calculateEMI(principal, annualRate, tenureYears) {
    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;

    if (monthlyRate === 0) return principal / months;

    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(emi);
}

/**
 * Get property type label
 */
export function getPropertyTypeLabel(type) {
    const types = {
        house: 'House',
        apartment: 'Apartment',
        villa: 'Villa',
        land: 'Land',
        commercial: 'Commercial',
    };
    return types[type] || type;
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
    const colors = {
        active: 'badge-success',
        sold: 'badge-error',
        rented: 'badge-warning',
        inactive: 'badge-info',
    };
    return colors[status] || 'badge-primary';
}

/**
 * Validate email
 */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone (Indian format)
 */
export function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Generate a slug from text
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

/**
 * Debounce function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * cn - className merge utility
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
