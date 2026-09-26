export interface DestinationInsight {
    keywords: string[];
    name: string;
    country: string;
    tagline: string;
    description: string;
    image: string;
    estimatedPrice: number;
    recommendedDuration: string;
    category: 'Cultural' | 'Adventure' | 'Honeymoon' | 'Family';
    highlights: string[];
    bestTimeToVisit: string;
}

export const destinationKnowledge: DestinationInsight[] = [
    {
        keywords: ['varanasi', 'banaras', 'kashi', 'benaras', 'ganga', 'ganges'],
        name: 'Varanasi',
        country: 'India',
        tagline: 'The Spiritual Heart & Oldest Living City in the World',
        description: 'Varanasi offers profound spiritual aura with its ancient Ghats on the sacred river Ganges, evening Aarti celebrations, historic silk weaving culture, and close proximity to Buddhist sanctuary Sarnath.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 34999,
        recommendedDuration: '4 Days, 3 Nights',
        category: 'Cultural',
        highlights: ['Ganga Sunrise Boat Cruise', 'Dashashwamedh Ghat Evening Aarti', 'Sarnath Archaeological Park', 'Heritage Old City Walk'],
        bestTimeToVisit: 'October to March'
    },
    {
        keywords: ['bali', 'indonesia', 'ubud', 'seminyak', 'canggu', 'kuta', 'nusa penida'],
        name: 'Bali',
        country: 'Indonesia',
        tagline: 'Island of the Gods & Tropical Serenity',
        description: 'Famous for volcanic forested mountains, iconic rice terraces, coral reefs, spiritual Hindu temples, and world-class beach clubs.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 65999,
        recommendedDuration: '6 Days, 5 Nights',
        category: 'Honeymoon',
        highlights: ['Ubud Monkey Forest & Rice Terraces', 'Tanah Lot Sunset Temple', 'Nusa Penida Island Tour', 'Balinese Spa & Beach Clubs'],
        bestTimeToVisit: 'April to October'
    },
    {
        keywords: ['dubai', 'uae', 'emirates', 'burj khalifa', 'abu dhabi'],
        name: 'Dubai',
        country: 'United Arab Emirates',
        tagline: 'Ultramodern Architecture & Desert Luxury',
        description: 'A dazzling oasis of luxury shopping, futuristic skyscrapers, thrilling desert safaris, and lively nightlife entertainment.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 85999,
        recommendedDuration: '5 Days, 4 Nights',
        category: 'Family',
        highlights: ['Burj Khalifa 124th Floor Observatory', 'Red Dune Desert Safari & BBQ Dinner', 'Dubai Marina Cruise', 'Aquaventure Waterpark'],
        bestTimeToVisit: 'November to April'
    },
    {
        keywords: ['maldives', 'male', 'overwater villa', 'atoll'],
        name: 'Maldives',
        country: 'Maldives',
        tagline: 'Turquoise Lagoons & Private Overwater Villas',
        description: 'An archipelago of pure tropical indulgence featuring crystalline waters, white-sand beaches, and vibrant coral marine life.',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 129999,
        recommendedDuration: '5 Days, 4 Nights',
        category: 'Honeymoon',
        highlights: ['Overwater Villa Stay', 'Nurse Shark Snorkeling', 'Sunset Dolphin Cruise', 'Floating Breakfast Experience'],
        bestTimeToVisit: 'November to April'
    },
    {
        keywords: ['switzerland', 'swiss', 'alps', 'zurich', 'interlaken', 'lucerne', 'zermatt'],
        name: 'Switzerland',
        country: 'Switzerland',
        tagline: 'Majestic Alpine Peaks & Mirror Lakes',
        description: 'Fairytale landscapes, snow-capped peaks, scenic panoramic trains, pristine turquoise lakes, and world-renowned alpine hospitality.',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 219999,
        recommendedDuration: '7 Days, 6 Nights',
        category: 'Adventure',
        highlights: ['Jungfraujoch - Top of Europe', 'Mount Titlis Cable Car', 'Scenic Glacier Express Train', 'Lake Lucerne Steamboat Cruise'],
        bestTimeToVisit: 'May to October & Dec to Mar'
    },
    {
        keywords: ['tokyo', 'japan', 'shibuya', 'shinjuku', 'mount fuji', 'fuji', 'osaka'],
        name: 'Tokyo & Mt. Fuji',
        country: 'Japan',
        tagline: 'Futuristic Metropolises & Timeless Traditions',
        description: 'From neon-lit streets and anime culture to tranquil Shinto shrines and majestic views of Mount Fuji.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 169999,
        recommendedDuration: '7 Days, 6 Nights',
        category: 'Cultural',
        highlights: ['Shibuya Sky & Harajuku Tour', 'Mount Fuji & Lake Kawaguchi Trip', 'Senso-ji Temple Asakusa', 'Akihabara & TeamLab Planets'],
        bestTimeToVisit: 'March to May & Sept to Nov'
    },
    {
        keywords: ['thailand', 'bangkok', 'phuket', 'krabi', 'pattaya', 'chiang mai'],
        name: 'Thailand (Phuket & Bangkok)',
        country: 'Thailand',
        tagline: 'Golden Temples, Exotic Islands & Night Markets',
        description: 'A vibrant journey blending golden Buddhist temples, world-class street food, and stunning limestone karsts in the Andaman Sea.',
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 54999,
        recommendedDuration: '6 Days, 5 Nights',
        category: 'Family',
        highlights: ['Phi Phi Islands Speedboat Tour', 'Grand Palace & Wat Arun', 'Chao Phraya Dinner Cruise', 'Phuket Old Town Walk'],
        bestTimeToVisit: 'November to April'
    },
    {
        keywords: ['singapore', 'marina bay', 'sentosa'],
        name: 'Singapore',
        country: 'Singapore',
        tagline: 'Garden City of the Future',
        description: 'A modern marvel renowned for lush futuristic conservatories, skyline infinity pools, and premier family theme parks.',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 79999,
        recommendedDuration: '5 Days, 4 Nights',
        category: 'Family',
        highlights: ['Gardens by the Bay & Cloud Forest', 'Universal Studios Singapore', 'Marina Bay Sands SkyPark', 'Night Safari Wildlife Tour'],
        bestTimeToVisit: 'Year-round'
    },
    {
        keywords: ['egypt', 'cairo', 'pyramids', 'nile', 'giza', 'luxor'],
        name: 'Egypt & The Nile',
        country: 'Egypt',
        tagline: 'Cradle of Ancient Civilizations & Wonders',
        description: 'Stand in awe before the Great Pyramids of Giza, cruise the mythical Nile River, and unlock centuries of pharaonic history.',
        image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 139999,
        recommendedDuration: '8 Days, 7 Nights',
        category: 'Cultural',
        highlights: ['Giza Pyramids & Sphinx Guided Walk', 'Nile River Luxury Cruise', 'Valley of the Kings in Luxor', 'Egyptian Grand Museum'],
        bestTimeToVisit: 'October to April'
    },
    {
        keywords: ['vietnam', 'hanoi', 'ha long bay', 'da nang', 'hoi an'],
        name: 'Vietnam & Ha Long Bay',
        country: 'Vietnam',
        tagline: 'Emerald Bays & Heritage Lantern Towns',
        description: 'Dramatic limestone karsts rising from emerald waters, ancient lantern-lit towns, French colonial charm, and world-class culinary wonders.',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 62999,
        recommendedDuration: '7 Days, 6 Nights',
        category: 'Adventure',
        highlights: ['Ha Long Bay Luxury Overnight Cruise', 'Hoi An Ancient Lantern Town', 'Ba Na Hills & Golden Bridge', 'Hanoi Street Food Tour'],
        bestTimeToVisit: 'March to May & Sept to Nov'
    },
    {
        keywords: ['agra', 'taj mahal', 'mathura', 'vrindavan'],
        name: 'Agra & Golden Triangle',
        country: 'India',
        tagline: 'Home of the World Wonder: The Taj Mahal',
        description: 'Marvel at the eternal monument of love, explore majestic Mughal citadels, and soak in royal North Indian heritage.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
        estimatedPrice: 28999,
        recommendedDuration: '3 Days, 2 Nights',
        category: 'Cultural',
        highlights: ['Sunrise at the Taj Mahal', 'Agra Fort Guided Tour', 'Fatehpur Sikri Excursion', 'Mughal Heritage Food Walk'],
        bestTimeToVisit: 'October to March'
    }
];

export const getDestinationInsight = (query: string): DestinationInsight => {
    const q = query.trim().toLowerCase();

    // 1. Look for matching keywords
    const match = destinationKnowledge.find(dest =>
        dest.keywords.some(k => q.includes(k) || k.includes(q)) ||
        dest.name.toLowerCase().includes(q)
    );

    if (match) return match;

    // 2. Generate an intelligent custom preview for any other city/place
    const formattedName = query
        .trim()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

    return {
        keywords: [q],
        name: formattedName,
        country: 'Worldwide Destination',
        tagline: `Custom Curated Travel Experience in ${formattedName}`,
        description: `Explore the vibrant landmarks, authentic local culture, hand-picked accommodations, and hidden gems of ${formattedName} with our bespoke private tour planners.`,
        image: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80`,
        estimatedPrice: 49999,
        recommendedDuration: '5 Days, 4 Nights',
        category: 'Cultural',
        highlights: [
            `Private City & Landmark Guided Tour`,
            `Hand-selected Boutique Hotel Accommodations`,
            `Curated Culinary & Cultural Experiences`,
            `24/7 Dedicated Concierge & Airport Transfers`
        ],
        bestTimeToVisit: 'Peak Season Availability'
    };
};
