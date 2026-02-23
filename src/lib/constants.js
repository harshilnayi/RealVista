// Property types
export const PROPERTY_TYPES = [
    { value: 'house', label: 'House', icon: 'Home' },
    { value: 'apartment', label: 'Apartment', icon: 'Building2' },
    { value: 'villa', label: 'Villa', icon: 'Castle' },
    { value: 'land', label: 'Land', icon: 'LandPlot' },
    { value: 'commercial', label: 'Commercial', icon: 'Store' },
];

// Listing types
export const LISTING_TYPES = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
];

// Property statuses
export const PROPERTY_STATUS = [
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'sold', label: 'Sold', color: 'error' },
    { value: 'rented', label: 'Rented', color: 'warning' },
    { value: 'inactive', label: 'Inactive', color: 'info' },
];

// User roles
export const USER_ROLES = [
    { value: 'buyer', label: 'Buyer', description: 'Search and save your favorite properties' },
    { value: 'seller', label: 'Seller', description: 'List and manage your properties' },
    { value: 'agent', label: 'Agent', description: 'Manage your portfolio and clients' },
];

// Amenities
export const AMENITIES = [
    'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Balcony',
    'Security', 'Power Backup', 'Lift', 'Club House', 'Playground',
    'Fire Safety', 'CCTV', 'Rain Water Harvesting', 'Intercom',
    'Gas Pipeline', 'WiFi', 'Air Conditioning', 'Furnished',
    'Semi-Furnished', 'Pet Friendly',
];

// Price ranges for filter
export const PRICE_RANGES = [
    { min: 0, max: 500000, label: 'Under ₹5L' },
    { min: 500000, max: 2000000, label: '₹5L - ₹20L' },
    { min: 2000000, max: 5000000, label: '₹20L - ₹50L' },
    { min: 5000000, max: 10000000, label: '₹50L - ₹1Cr' },
    { min: 10000000, max: 50000000, label: '₹1Cr - ₹5Cr' },
    { min: 50000000, max: Infinity, label: 'Above ₹5Cr' },
];

// Bedroom options
export const BEDROOM_OPTIONS = [
    { value: 1, label: '1 BHK' },
    { value: 2, label: '2 BHK' },
    { value: 3, label: '3 BHK' },
    { value: 4, label: '4 BHK' },
    { value: 5, label: '5+ BHK' },
];

// Sort options
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'area_low', label: 'Area: Small to Large' },
    { value: 'area_high', label: 'Area: Large to Small' },
];

// Indian cities for location suggestions
export const CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
    'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
    'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
    'Nashik', 'Surat', 'Noida', 'Gurgaon', 'Chandigarh',
];

// Navigation links
export const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/map', label: 'Map View' },
    { href: '/agents', label: 'Agents' },
    { href: '/calculator', label: 'Calculator' },
];

// Dashboard navigation
export const DASHBOARD_LINKS = [
    { href: '/dashboard', label: 'Overview', icon: 'LayoutDashboard' },
    { href: '/dashboard/listings', label: 'My Listings', icon: 'Building2', roles: ['seller', 'agent'] },
    { href: '/dashboard/favorites', label: 'Favorites', icon: 'Heart', roles: ['buyer'] },
    { href: '/dashboard/inquiries', label: 'Inquiries', icon: 'MessageSquare' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
];

// Stats for landing page
export const PLATFORM_STATS = [
    { label: 'Properties Listed', value: '10,000+' },
    { label: 'Happy Customers', value: '5,000+' },
    { label: 'Cities Covered', value: '25+' },
    { label: 'Expert Agents', value: '200+' },
];
