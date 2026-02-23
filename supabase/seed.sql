-- ============================================================
-- RealVista Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- NOTE: These users are created as profiles only.
-- To fully test auth, create accounts via the app's Register page.
-- The UUIDs below are for demo display purposes.

-- ============================================================
-- 1. PROFILES (6 users: 2 agents, 2 sellers, 2 buyers)
-- ============================================================

INSERT INTO profiles (id, full_name, email, phone, role, bio, city, avatar_url) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Rajesh Sharma', 'rajesh.sharma@realvista.demo', '+91 98765 43210', 'agent',
   'Senior real estate agent with 12+ years of experience in Mumbai & Pune. Specializing in luxury apartments and commercial properties. Over 500+ successful deals closed.',
   'Mumbai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),

  ('a1000000-0000-0000-0000-000000000002', 'Priya Mehta', 'priya.mehta@realvista.demo', '+91 87654 32109', 'agent',
   'Passionate about helping families find their dream homes in Bangalore. Expert in residential properties, villas, and gated communities. RERA certified agent.',
   'Bangalore', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'),

  ('a1000000-0000-0000-0000-000000000003', 'Amit Patel', 'amit.patel@realvista.demo', '+91 76543 21098', 'seller',
   'Property developer and builder based in Ahmedabad. Currently developing premium residential projects across Gujarat.',
   'Ahmedabad', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),

  ('a1000000-0000-0000-0000-000000000004', 'Sneha Iyer', 'sneha.iyer@realvista.demo', '+91 65432 10987', 'seller',
   'Homeowner looking to sell premium properties in Chennai and Hyderabad. All properties are well-maintained with clear documentation.',
   'Chennai', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'),

  ('a1000000-0000-0000-0000-000000000005', 'Vikram Singh', 'vikram.singh@realvista.demo', '+91 54321 09876', 'buyer',
   'IT professional looking for investment properties in NCR region. Interested in 2-3 BHK apartments with good connectivity.',
   'Delhi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'),

  ('a1000000-0000-0000-0000-000000000006', 'Ananya Reddy', 'ananya.reddy@realvista.demo', '+91 43210 98765', 'buyer',
   'First-time homebuyer exploring options in Hyderabad and Bangalore. Looking for modern apartments near tech parks.',
   'Hyderabad', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. PROPERTIES (25 realistic listings across India)
-- ============================================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, city, state, address, pincode, bedrooms, bathrooms, area_sqft, amenities, latitude, longitude, status, views_count) VALUES

-- MUMBAI PROPERTIES
('p1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
 'Luxury Sea-View Penthouse in Bandra',
 'Stunning 4 BHK penthouse offering breathtaking panoramic views of the Arabian Sea. Features Italian marble flooring, modular kitchen with imported fittings, private terrace garden, and a dedicated parking for 2 cars. Located in one of Mumbai''s most prestigious addresses with world-class amenities including infinity pool, sky lounge, and 24/7 concierge service.',
 'apartment', 'sale', 85000000, 'Mumbai', 'Maharashtra', 'Bandra West, Carter Road', '400050',
 4, 4, 3200,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Air Conditioning', 'Balcony', 'Club House'],
 19.0596, 72.8295, 'active', 342),

('p1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001',
 'Modern 2BHK in Andheri West',
 'Well-designed 2 BHK apartment in a prime location near Andheri station. Walking distance to malls, hospitals, and schools. The apartment features a spacious living room, modern kitchen with chimney, and ample natural light. Society has excellent security and maintenance.',
 'apartment', 'sale', 18500000, 'Mumbai', 'Maharashtra', 'Lokhandwala Complex, Andheri West', '400053',
 2, 2, 1050,
 ARRAY['Parking', 'Gym', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Intercom'],
 19.1364, 72.8296, 'active', 218),

('p1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001',
 'Spacious 3BHK for Rent in Powai',
 'Fully furnished 3 BHK apartment available for rent in Hiranandani Gardens, Powai. Premium furnishing with air conditioning in all rooms, washing machine, refrigerator, and modular kitchen. Lake-facing balcony with serene views. Close to IIT Bombay and major IT parks.',
 'apartment', 'rent', 85000, 'Mumbai', 'Maharashtra', 'Hiranandani Gardens, Powai', '400076',
 3, 2, 1450,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'Air Conditioning', 'Furnished', 'Balcony', 'CCTV'],
 19.1176, 72.9060, 'active', 156),

-- BANGALORE PROPERTIES
('p1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002',
 'Premium Villa in Whitefield',
 'Exquisite 4 BHK independent villa in a gated community. Features a private garden, covered car porch for 2 cars, servant quarters, and a stunning terrace with city views. Italian marble in living areas, wooden flooring in bedrooms. The community has a clubhouse, Olympic-size swimming pool, and tennis courts.',
 'villa', 'sale', 42000000, 'Bangalore', 'Karnataka', 'ITPL Road, Whitefield', '560066',
 4, 5, 4500,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security', 'Power Backup', 'Club House', 'CCTV', 'Rain Water Harvesting', 'Pet Friendly'],
 12.9698, 77.7500, 'active', 289),

('p1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002',
 'Cozy 1BHK Studio near Koramangala',
 'Perfect starter home or investment! Compact yet well-planned 1 BHK in a modern high-rise near Koramangala tech hub. Walking distance to restaurants, pubs, and shopping. Ideal for working professionals or rental income. High-speed elevator, rooftop party area, and co-working space in the building.',
 'apartment', 'sale', 6500000, 'Bangalore', 'Karnataka', 'HSR Layout, Sector 2', '560102',
 1, 1, 550,
 ARRAY['Parking', 'Gym', 'Security', 'Lift', 'Power Backup', 'WiFi', 'CCTV'],
 12.9116, 77.6389, 'active', 445),

('p1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002',
 'Elegant 3BHK in Indiranagar',
 'Beautifully designed 3 BHK in the heart of Indiranagar — Bangalore''s trendiest neighborhood. The apartment boasts floor-to-ceiling windows, a large open kitchen, premium vitrified tiles, and video door phone. Walking distance to 100 Feet Road, metro station, and top restaurants.',
 'apartment', 'sale', 27500000, 'Bangalore', 'Karnataka', '12th Main, Indiranagar', '560038',
 3, 3, 1800,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Balcony', 'Security', 'Lift', 'Power Backup', 'Intercom', 'CCTV', 'Gas Pipeline'],
 12.9784, 77.6408, 'active', 312),

-- DELHI NCR PROPERTIES
('p1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003',
 'Luxurious 4BHK in Golf Course Road, Gurgaon',
 'Ultra-premium 4 BHK apartment in a trophy tower on Golf Course Road. Panoramic views of the Aravalli hills and golf greens. Smart home automation, VRV air conditioning, imported marble, and designer bathrooms. Building features a sky lounge on the 40th floor, temperature-controlled pool, and private theater.',
 'apartment', 'sale', 65000000, 'Gurgaon', 'Haryana', 'Golf Course Road, DLF Phase 5', '122009',
 4, 4, 3800,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Air Conditioning', 'Club House', 'Intercom'],
 28.4430, 77.1012, 'active', 198),

('p1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003',
 'Affordable 2BHK in Noida Extension',
 'Brand new 2 BHK apartment in a RERA-registered project in Noida Extension. Modern amenities including a kids play area, jogging track, and landscaped gardens. Excellent connectivity via Noida-Greater Noida Expressway. EMI starts at ₹15,000/month. Ready to move in!',
 'apartment', 'sale', 4200000, 'Noida', 'Uttar Pradesh', 'Sector 16C, Noida Extension', '201301',
 2, 2, 950,
 ARRAY['Parking', 'Gym', 'Garden', 'Security', 'Lift', 'Power Backup', 'Playground', 'Rain Water Harvesting'],
 28.5693, 77.4538, 'active', 567),

('p1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003',
 'Independent Floor in South Delhi',
 'Elegant 3 BHK builder floor in a quiet lane of Greater Kailash-II. Freshly painted with modular kitchen, imported bathroom fittings, and wooden wardrobes in all bedrooms. Separate servant quarter and dedicated parking. Close to M Block Market and metro station.',
 'house', 'sale', 38000000, 'Delhi', 'Delhi', 'Greater Kailash II', '110048',
 3, 3, 2200,
 ARRAY['Parking', 'Security', 'Power Backup', 'Air Conditioning', 'Furnished', 'CCTV', 'Intercom'],
 28.5355, 77.2412, 'active', 234),

('p1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003',
 'Studio Apartment for Rent in Cyber City',
 'Fully furnished studio apartment perfect for working professionals. Located in Cyber City hub with walking distance to major offices. Includes a queen bed, study table, wardrobe, microwave, and washing machine. Building has 24/7 security, power backup, and high-speed WiFi.',
 'apartment', 'rent', 35000, 'Gurgaon', 'Haryana', 'DLF Cyber City, Phase 2', '122002',
 1, 1, 450,
 ARRAY['Parking', 'Gym', 'Security', 'Lift', 'Power Backup', 'WiFi', 'Furnished', 'Air Conditioning', 'CCTV'],
 28.4940, 77.0866, 'active', 389),

-- HYDERABAD PROPERTIES
('p1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004',
 'Gated Community Villa in Gachibowli',
 'Stunning 5 BHK villa in an exclusive gated community near Financial District. Spread across 5500 sq.ft with a private swimming pool, home theater room, and landscaped garden. Italian kitchen, central AC, and solar panels. Community features a golf putting green and tennis court.',
 'villa', 'sale', 55000000, 'Hyderabad', 'Telangana', 'Gachibowli, Financial District', '500032',
 5, 6, 5500,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security', 'Power Backup', 'Club House', 'CCTV', 'Air Conditioning', 'Pet Friendly'],
 17.4400, 78.3489, 'active', 167),

('p1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004',
 'Modern 2BHK near HITEC City',
 'Contemporary 2 BHK in a 30-story tower with stunning city views. Close to major IT companies — Microsoft, Google, Amazon offices within 5 km. Open kitchen design, smart locks, and video intercom. Building has a sky deck, indoor games room, and EV charging stations.',
 'apartment', 'sale', 9800000, 'Hyderabad', 'Telangana', 'Kondapur, Near HITEC City', '500084',
 2, 2, 1150,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Intercom', 'Fire Safety'],
 17.4575, 78.3740, 'active', 423),

-- CHENNAI PROPERTIES
('p1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000004',
 'Heritage Bungalow in Adyar',
 'Rare find — a beautifully restored heritage bungalow on a 4000 sq.ft plot in prestigious Adyar. Original Burma teak woodwork, courtyard with fountain, 4 spacious bedrooms, and a wrap-around veranda. Perfect for those who appreciate old-world charm with modern comforts.',
 'house', 'sale', 47000000, 'Chennai', 'Tamil Nadu', 'Adyar, Gandhi Nagar', '600020',
 4, 3, 3500,
 ARRAY['Parking', 'Garden', 'Security', 'Power Backup', 'Rain Water Harvesting'],
 13.0067, 80.2544, 'active', 145),

('p1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000004',
 'Sea-Facing 3BHK in ECR',
 'Wake up to the sound of waves! Premium 3 BHK apartment on East Coast Road with direct beach access. Floor-to-ceiling windows in the living room, Italian marble throughout, and a large balcony overlooking the Bay of Bengal. Ideal for weekend home or peaceful living.',
 'apartment', 'sale', 22000000, 'Chennai', 'Tamil Nadu', 'East Coast Road, Neelankarai', '600041',
 3, 3, 1950,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Balcony', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Intercom'],
 12.9516, 80.2570, 'active', 267),

-- PUNE PROPERTIES
('p1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000001',
 'Hilltop Villa in Lavasa',
 'Escape the city! Gorgeous 3 BHK villa perched on a hilltop in Lavasa with valley views. Modern architecture with eco-friendly features — rainwater harvesting, solar water heater, and cross-ventilation design. Perfect weekend home, just 60 km from Pune city.',
 'villa', 'sale', 32000000, 'Pune', 'Maharashtra', 'Lavasa City, Dasve', '412112',
 3, 3, 2800,
 ARRAY['Parking', 'Garden', 'Security', 'Power Backup', 'Rain Water Harvesting', 'Balcony'],
 18.4088, 73.5075, 'active', 198),

('p1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000001',
 'Trendy 2BHK in Hinjewadi IT Park',
 'Modern 2 BHK in a vibrant township near Hinjewadi IT Park Phase 1. Ideal for techies! Comes with covered parking, modular kitchen, and balcony with green views. Township has a supermarket, pharmacy, school, and sports complex within the campus.',
 'apartment', 'sale', 7200000, 'Pune', 'Maharashtra', 'Hinjewadi Phase 1, Rajiv Gandhi Infotech Park', '411057',
 2, 2, 980,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'Playground', 'CCTV', 'Gas Pipeline'],
 18.5912, 73.7389, 'active', 534),

-- AHMEDABAD PROPERTIES
('p1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000003',
 'Penthouse with Rooftop Pool in SG Highway',
 'The crown jewel of this 25-story tower — a duplex penthouse featuring a private rooftop pool, jacuzzi, and entertaining deck. 4 BHK with home office, walk-in closets, and a chef''s kitchen. Floor-to-ceiling windows offer 270° views of the city skyline.',
 'apartment', 'sale', 48000000, 'Ahmedabad', 'Gujarat', 'SG Highway, Bodakdev', '380054',
 4, 4, 4200,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'Club House', 'CCTV', 'Air Conditioning', 'Balcony'],
 23.0395, 72.5078, 'active', 156),

('p1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000003',
 'Commercial Shop in CG Road',
 'Prime commercial space on the bustling CG Road — Ahmedabad''s premier shopping street. Ground floor shop with 30 ft frontage, mezzanine storage, and glass facade. High footfall area surrounded by malls, restaurants, and offices. Excellent for retail or showroom.',
 'commercial', 'sale', 35000000, 'Ahmedabad', 'Gujarat', 'CG Road, Navrangpura', '380009',
 0, 1, 1200,
 ARRAY['Parking', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Fire Safety'],
 23.0300, 72.5600, 'active', 112),

-- JAIPUR PROPERTIES
('p1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000002',
 'Royal Haveli-Style Villa in C-Scheme',
 'A masterpiece of Rajasthani architecture meets modern luxury. This haveli-style 5 BHK villa features hand-carved jharokhas, a central courtyard with fountain, rooftop terrace with fort views, and a modern kitchen. Spread across 6000 sq.ft of living space on a 400 sq.yard plot.',
 'villa', 'sale', 75000000, 'Jaipur', 'Rajasthan', 'C-Scheme, Near Statue Circle', '302001',
 5, 5, 6000,
 ARRAY['Parking', 'Garden', 'Security', 'Power Backup', 'Air Conditioning', 'CCTV', 'Intercom'],
 26.9040, 75.8000, 'active', 89),

('p1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000002',
 'Budget 1BHK in Mansarovar',
 'Affordable 1 BHK flat ideal for small families or bachelors. Located in Mansarovar — Jaipur''s largest planned colony with excellent infrastructure. Close to Mansarovar metro station, hospitals, and schools. Semi-furnished with modular kitchen.',
 'apartment', 'sale', 2100000, 'Jaipur', 'Rajasthan', 'Sector 9, Mansarovar', '302020',
 1, 1, 500,
 ARRAY['Parking', 'Security', 'Power Backup', 'Semi-Furnished'],
 26.8600, 75.7700, 'active', 678),

-- KOLKATA PROPERTIES
('p1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000001',
 'Riverside Apartment in Howrah',
 'Elegant 3 BHK apartment with stunning Hooghly river views. Located in a newly developed high-rise near Howrah Bridge. Features large windows for natural light, Italian marble in the drawing room, and a spacious balcony. The complex has a riverfront promenade, gym, and children''s play area.',
 'apartment', 'sale', 12500000, 'Kolkata', 'West Bengal', 'Near Howrah Bridge, Riverside', '711101',
 3, 2, 1600,
 ARRAY['Parking', 'Gym', 'Balcony', 'Security', 'Lift', 'Power Backup', 'CCTV', 'Playground'],
 22.5856, 88.3404, 'active', 234),

-- SURAT PROPERTY
('p1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000003',
 'Luxurious 3BHK in VIP Road',
 'Premium 3 BHK in Surat''s fastest developing corridor. Spacious rooms with cross ventilation, modular kitchen with breakfast counter, and a large utility area. The tower offers a rooftop infinity pool, party lawn, and mini theater. Ready possession!',
 'apartment', 'sale', 8500000, 'Surat', 'Gujarat', 'VIP Road, Vesu', '395007',
 3, 2, 1650,
 ARRAY['Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift', 'Power Backup', 'Club House', 'CCTV'],
 21.1553, 72.7714, 'active', 345),

-- LAND PLOTS
('p1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000004',
 'Premium Residential Plot in Whitefield',
 'BMRDA approved residential plot in a gated plotted development near Whitefield. East-facing 30x40 site with wide tar roads, underground drainage, and overhead water tank. Corner plot with extra open space. Ready for construction — all approvals in place.',
 'land', 'sale', 5600000, 'Bangalore', 'Karnataka', 'Near ITPL, Whitefield', '560066',
 0, 0, 1200,
 ARRAY['Security', 'Rain Water Harvesting'],
 12.9800, 77.7450, 'active', 412),

('p1000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000004',
 'Farmland near Bangalore Airport',
 'Scenic 2-acre agricultural land with mango and coconut plantation near Devanahalli (Bangalore International Airport). Perfect for farmhouse construction or long-term investment. Land value appreciating rapidly due to airport expansion and upcoming infrastructure projects.',
 'land', 'sale', 14000000, 'Bangalore', 'Karnataka', 'Devanahalli, Near Airport', '562110',
 0, 0, 87120,
 ARRAY['Rain Water Harvesting'],
 13.2367, 77.7106, 'active', 178),

-- RENTAL PROPERTIES
('p1000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000002',
 'Furnished 2BHK for Rent in Koramangala',
 'Move-in ready! Tastefully furnished 2 BHK in Koramangala 5th Block. Includes sofa set, dining table, queen beds, washing machine, refrigerator, and microwave. Walking distance to Forum Mall, restaurants, and startups. Perfect for a couple or roommates.',
 'apartment', 'rent', 45000, 'Bangalore', 'Karnataka', '5th Block, Koramangala', '560095',
 2, 2, 1100,
 ARRAY['Parking', 'Gym', 'Security', 'Lift', 'Power Backup', 'Furnished', 'WiFi', 'CCTV'],
 12.9352, 77.6245, 'active', 521)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. PROPERTY IMAGES (Multiple images per property using Unsplash)
-- ============================================================

INSERT INTO property_images (property_id, image_url, is_primary, display_order) VALUES
-- Property 1: Luxury Sea-View Penthouse
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop', false, 1),
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop', false, 2),

-- Property 2: Modern 2BHK Andheri
('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop', false, 1),

-- Property 3: 3BHK Powai Rent
('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=500&fit=crop', false, 1),

-- Property 4: Premium Villa Whitefield
('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1600566753086-00f18f6b0049?w=800&h=500&fit=crop', false, 1),
('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop', false, 2),

-- Property 5: 1BHK Studio
('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop', true, 0),

-- Property 6: 3BHK Indiranagar
('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop', false, 1),

-- Property 7: 4BHK Golf Course
('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=500&fit=crop', false, 1),

-- Property 8: 2BHK Noida
('p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=500&fit=crop', true, 0),

-- Property 9: South Delhi Floor
('p1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=500&fit=crop', false, 1),

-- Property 10: Studio Cyber City
('p1000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=500&fit=crop', true, 0),

-- Property 11: Villa Gachibowli
('p1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop', false, 1),
('p1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=500&fit=crop', false, 2),

-- Property 12: 2BHK HITEC City
('p1000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop', true, 0),

-- Property 13: Heritage Bungalow
('p1000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=500&fit=crop', false, 1),

-- Property 14: ECR Chennai
('p1000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop', true, 0),

-- Property 15: Lavasa Villa
('p1000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&h=500&fit=crop', true, 0),

-- Property 16: 2BHK Hinjewadi
('p1000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop', true, 0),

-- Property 17: Penthouse SG Highway
('p1000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1600566752447-f4e219dcc6ff?w=800&h=500&fit=crop', false, 1),

-- Property 18: Commercial CG Road
('p1000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop', true, 0),

-- Property 19: Royal Haveli Jaipur
('p1000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop', false, 1),

-- Property 20: Budget 1BHK Jaipur
('p1000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=500&fit=crop', true, 0),

-- Property 21: Riverside Kolkata
('p1000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop', true, 0),

-- Property 22: 3BHK Surat
('p1000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=500&fit=crop', true, 0),

-- Property 23: Plot Whitefield
('p1000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop', true, 0),

-- Property 24: Farmland
('p1000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&h=500&fit=crop', true, 0),

-- Property 25: Furnished 2BHK Koramangala
('p1000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=500&fit=crop', true, 0),
('p1000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=500&fit=crop', false, 1)

ON CONFLICT DO NOTHING;


-- ============================================================
-- 4. FAVORITES (Sample favorites)
-- ============================================================

INSERT INTO favorites (user_id, property_id) VALUES
  ('a1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000007'),
  ('a1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000010'),
  ('a1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000012'),
  ('a1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000006'),
  ('a1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000025')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 5. INQUIRIES (Sample messages between users)
-- ============================================================

INSERT INTO inquiries (sender_id, receiver_id, property_id, message, phone, email, status) VALUES
  ('a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001',
   'p1000000-0000-0000-0000-000000000002',
   'Hi Rajesh, I am interested in the 2BHK in Andheri West. Is the price negotiable? I can visit this weekend. Also, could you share the maintenance charges and other monthly expenses?',
   '+91 54321 09876', 'vikram.singh@realvista.demo', 'new'),

  ('a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002',
   'p1000000-0000-0000-0000-000000000006',
   'Hello Priya, the 3BHK in Indiranagar looks perfect for me. I work at a tech park nearby. Could we schedule a site visit next week? Is the property RERA registered?',
   '+91 43210 98765', 'ananya.reddy@realvista.demo', 'new'),

  ('a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003',
   'p1000000-0000-0000-0000-000000000007',
   'Dear Amit, I saw the luxurious 4BHK on Golf Course Road. What is the expected ROI for investors? I am looking to invest in Gurgaon. Please share floor plans and brochure.',
   '+91 54321 09876', 'vikram.singh@realvista.demo', 'read'),

  ('a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002',
   'p1000000-0000-0000-0000-000000000025',
   'Hi, I am relocating to Bangalore for work. The furnished 2BHK in Koramangala looks great. Is it available from next month? What is the security deposit amount?',
   '+91 43210 98765', 'ananya.reddy@realvista.demo', 'new'),

  ('a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003',
   'p1000000-0000-0000-0000-000000000008',
   'Hi, I want to know more about the 2BHK in Noida Extension. Is the builder reputed? What is the possession timeline? Are there any hidden charges?',
   '+91 54321 09876', 'vikram.singh@realvista.demo', 'read')
ON CONFLICT DO NOTHING;
