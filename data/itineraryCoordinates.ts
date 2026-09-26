export interface Waypoint {
    day: number;
    title: string;
    locationName: string;
    lat: number;
    lng: number;
    timing?: string;
    type?: 'arrival' | 'temple' | 'nature' | 'adventure' | 'monument' | 'culture' | 'departure';
}

export interface PackageRouteData {
    packageId: number;
    defaultZoom: number;
    center: [number, number];
    waypoints: Waypoint[];
}

export const packageRoutes: Record<number, PackageRouteData> = {
    // 1. Romantic Paris Escape
    1: {
        packageId: 1,
        defaultZoom: 12,
        center: [48.8566, 2.3522],
        waypoints: [
            { day: 1, title: 'Arrival & Seine River Cruise', locationName: 'Seine River & Pont Alexandre III', lat: 48.8637, lng: 2.3134, timing: 'Evening', type: 'arrival' },
            { day: 2, title: 'Art & History at Louvre', locationName: 'Louvre Museum & Montmartre', lat: 48.8606, lng: 2.3376, timing: 'Full Day', type: 'culture' },
            { day: 3, title: 'Iconic Eiffel Tower & Champs de Mars', locationName: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, timing: 'Morning & Sunset', type: 'monument' },
            { day: 4, title: 'Grand Palace of Versailles', locationName: 'Château de Versailles', lat: 48.8049, lng: 2.1204, timing: 'Full Day Excursion', type: 'monument' },
            { day: 5, title: 'Notre-Dame & Departure', locationName: 'Notre-Dame Cathedral & Latin Quarter', lat: 48.8530, lng: 2.3499, timing: 'Morning', type: 'departure' }
        ]
    },
    // 2. Japanese Cultural Journey (Kyoto)
    2: {
        packageId: 2,
        defaultZoom: 11,
        center: [34.9958, 135.7588],
        waypoints: [
            { day: 1, title: 'Arrival & Traditional Ryokan Check-in', locationName: 'Kyoto Station & Gion', lat: 34.9858, lng: 135.7588, timing: 'Afternoon', type: 'arrival' },
            { day: 2, title: 'Golden Pavilion & Zen Gardens', locationName: 'Kinkaku-ji & Ryōan-ji', lat: 35.0394, lng: 135.7292, timing: 'Morning', type: 'temple' },
            { day: 3, title: 'Arashiyama Bamboo Grove Walk', locationName: 'Arashiyama & Tenryū-ji', lat: 35.0169, lng: 135.6713, timing: 'Full Day', type: 'nature' },
            { day: 4, title: 'Fushimi Inari Torii Gates', locationName: 'Fushimi Inari-taisha', lat: 34.9671, lng: 135.7727, timing: 'Morning Trek', type: 'temple' },
            { day: 5, title: 'Traditional Tea Ceremony', locationName: 'Gion Historical District', lat: 35.0037, lng: 135.7772, timing: 'Afternoon', type: 'culture' },
            { day: 6, title: 'Ancient Nara Deer Park Excursion', locationName: 'Todai-ji & Nara Park', lat: 34.6851, lng: 135.8430, timing: 'Day Trip', type: 'monument' },
            { day: 7, title: 'Nishiki Market & Departure', locationName: 'Nishiki Market', lat: 35.0050, lng: 135.7649, timing: 'Morning', type: 'departure' }
        ]
    },
    // 3. Kerala Backwater Bliss
    3: {
        packageId: 3,
        defaultZoom: 9,
        center: [9.9312, 76.5],
        waypoints: [
            { day: 1, title: 'Fort Kochi Heritage & Chinese Fishing Nets', locationName: 'Fort Kochi', lat: 9.9656, lng: 76.2421, timing: 'Afternoon', type: 'arrival' },
            { day: 2, title: 'Munnar Misty Tea Plantations', locationName: 'Munnar Tea Gardens', lat: 10.0889, lng: 77.0595, timing: 'Scenic Drive & Stay', type: 'nature' },
            { day: 3, title: 'Alleppey Private Houseboat Cruise', locationName: 'Vembanad Lake Alleppey', lat: 9.4981, lng: 76.3388, timing: 'Overnight Cruise', type: 'adventure' },
            { day: 4, title: 'Thekkady Periyar Wildlife Sanctuary', locationName: 'Periyar Lake & Spices', lat: 9.6031, lng: 77.1615, timing: 'Safari & Plantation', type: 'nature' },
            { day: 5, title: 'Kathakali Performance & Cultural Night', locationName: 'Ernakulam Cultural Center', lat: 9.9816, lng: 76.2999, timing: 'Evening Show', type: 'culture' },
            { day: 6, title: 'Cochin Souvenirs & Departure', locationName: 'Cochin International Airport', lat: 10.1518, lng: 76.3930, timing: 'Departure', type: 'departure' }
        ]
    },
    // 4. Family Fun in Rome
    4: {
        packageId: 4,
        defaultZoom: 13,
        center: [41.9028, 12.4964],
        waypoints: [
            { day: 1, title: 'Trevi Fountain & Spanish Steps Walk', locationName: 'Trevi Fountain Piazza', lat: 41.9009, lng: 12.4833, timing: 'Evening', type: 'arrival' },
            { day: 2, title: 'Colosseum & Roman Forum Gladiator Tour', locationName: 'Colosseum & Palatine Hill', lat: 41.8902, lng: 12.4922, timing: 'Morning Guided', type: 'monument' },
            { day: 3, title: 'Vatican Museums & Sistine Chapel', locationName: 'St. Peter\'s Basilica', lat: 41.9029, lng: 12.4534, timing: 'Full Day', type: 'culture' },
            { day: 4, title: 'Authentic Family Pizza & Gelato Masterclass', locationName: 'Trastevere Culinary School', lat: 41.8894, lng: 12.4705, timing: 'Afternoon', type: 'culture' },
            { day: 5, title: 'Borghese Gardens Picnic & Art Gallery', locationName: 'Villa Borghese', lat: 41.9142, lng: 12.4922, timing: 'Relaxing Day', type: 'nature' },
            { day: 6, title: 'Espresso Morning & Departure', locationName: 'Rome Fiumicino Airport', lat: 41.7999, lng: 12.2462, timing: 'Morning', type: 'departure' }
        ]
    },
    // 5. Royal Rajasthan Tour
    5: {
        packageId: 5,
        defaultZoom: 8,
        center: [26.0, 74.5],
        waypoints: [
            { day: 1, title: 'Arrival in Jaipur & Hawa Mahal', locationName: 'Hawa Mahal Pink City', lat: 26.9239, lng: 75.8267, timing: 'Afternoon', type: 'arrival' },
            { day: 2, title: 'Amber Fort & City Palace', locationName: 'Amber Palace Jaipur', lat: 26.9855, lng: 75.8513, timing: 'Full Day', type: 'monument' },
            { day: 3, title: 'Journey to the Blue City (Jodhpur)', locationName: 'Clock Tower Jodhpur', lat: 26.2954, lng: 73.0232, timing: 'Scenic Road Trip', type: 'culture' },
            { day: 4, title: 'Mighty Mehrangarh Fort & Jaswant Thada', locationName: 'Mehrangarh Fort', lat: 26.2978, lng: 73.0185, timing: 'Full Day', type: 'monument' },
            { day: 5, title: 'Udaipur City of Lakes & Pichola Boat Ride', locationName: 'Lake Pichola', lat: 24.5764, lng: 73.6835, timing: 'Sunset Boat', type: 'nature' },
            { day: 6, title: 'Udaipur City Palace & Saheliyon-ki-Bari', locationName: 'City Palace Udaipur', lat: 24.5760, lng: 73.6835, timing: 'Royal Tour', type: 'monument' },
            { day: 7, title: 'Artisan Handicrafts & Bazaars', locationName: 'Hathi Pol Bazaar', lat: 24.5878, lng: 73.6888, timing: 'Shopping', type: 'culture' },
            { day: 8, title: 'Farewell Royal Rajasthan', locationName: 'Maharana Pratap Airport', lat: 24.6177, lng: 73.8961, timing: 'Departure', type: 'departure' }
        ]
    },
    // 6. Goan Beach Paradise
    6: {
        packageId: 6,
        defaultZoom: 11,
        center: [15.45, 73.85],
        waypoints: [
            { day: 1, title: 'North Goa Check-in & Sunset Cocktails', locationName: 'Calangute Beach Resort', lat: 15.5439, lng: 73.7554, timing: 'Evening', type: 'arrival' },
            { day: 2, title: 'Water Sports at Baga & Anjuna Flea Market', locationName: 'Baga Beach & Anjuna', lat: 15.5804, lng: 73.7423, timing: 'Thrills & Beach', type: 'adventure' },
            { day: 3, title: 'Old Goa UNESCO Churches & Dudhsagar', locationName: 'Basilica of Bom Jesus', lat: 15.5009, lng: 73.9116, timing: 'Heritage Day', type: 'culture' },
            { day: 4, title: 'Relaxing Coastal Morning & Departure', locationName: 'Goa Dabolim Airport', lat: 15.3808, lng: 73.8314, timing: 'Departure', type: 'departure' }
        ]
    },
    // 7. Peruvian Peaks Expedition (Machu Picchu)
    7: {
        packageId: 7,
        defaultZoom: 10,
        center: [-13.3, -72.2],
        waypoints: [
            { day: 1, title: 'Cusco High-Altitude Acclimatization', locationName: 'Plaza de Armas Cusco', lat: -13.5170, lng: -71.9785, timing: 'Day 1', type: 'arrival' },
            { day: 2, title: 'Sacred Valley & Ollantaytambo Fortress', locationName: 'Ollantaytambo Inca Ruins', lat: -13.2584, lng: -72.2633, timing: 'Day 2', type: 'monument' },
            { day: 3, title: 'Inca Trail Trek: Wayllabamba Camp', locationName: 'Inca Trail Kilometre 82', lat: -13.2200, lng: -72.3500, timing: 'Day 3', type: 'adventure' },
            { day: 4, title: 'Conquering Dead Woman\'s Pass (4,215m)', locationName: 'Warmiwañusqa High Pass', lat: -13.2450, lng: -72.4100, timing: 'Day 4', type: 'adventure' },
            { day: 5, title: 'Cloud Forests of Wiñay Wayna', locationName: 'Wiñay Wayna Ruins', lat: -13.1900, lng: -72.5300, timing: 'Day 5', type: 'nature' },
            { day: 6, title: 'Sun Gate Sunrise into Machu Picchu', locationName: 'Inti Punku (Sun Gate)', lat: -13.1700, lng: -72.5400, timing: 'Day 6', type: 'monument' },
            { day: 7, title: 'Machu Picchu Lost Citadel Guided Tour', locationName: 'Machu Picchu Sanctuary', lat: -13.1631, lng: -72.5450, timing: 'Day 7', type: 'monument' },
            { day: 8, title: 'Scenic Vistadome Train to Cusco', locationName: 'Aguas Calientes Station', lat: -13.1550, lng: -72.5250, timing: 'Day 8', type: 'culture' },
            { day: 9, title: 'Sacsayhuamán Megaliths & Local Markets', locationName: 'Sacsayhuamán Cusco', lat: -13.5080, lng: -71.9818, timing: 'Day 9', type: 'culture' },
            { day: 10, title: 'Farewell Andes & Flight Home', locationName: 'Alejandro Velasco Astete Airport', lat: -13.5357, lng: -71.9388, timing: 'Departure', type: 'departure' }
        ]
    },
    // 8. Bora Bora Bliss
    8: {
        packageId: 8,
        defaultZoom: 12,
        center: [-16.5057, -151.7413],
        waypoints: [
            { day: 1, title: 'Boat Transfer to Overwater Bungalow', locationName: 'Motu Mute Lagoon Transfer', lat: -16.4444, lng: -151.7513, timing: 'Afternoon', type: 'arrival' },
            { day: 2, title: 'Lagoon Snorkeling with Sharks & Rays', locationName: 'Coral Garden Reef', lat: -16.4819, lng: -151.7042, timing: 'Full Day', type: 'adventure' },
            { day: 3, title: '4x4 Mount Otemanu Island Safari', locationName: 'Mount Otemanu Trail', lat: -16.5011, lng: -151.7344, timing: 'Morning', type: 'nature' },
            { day: 4, title: 'Spa Rituals & Polynesian Floating Lunch', locationName: 'Deep Ocean Spa Motu', lat: -16.4950, lng: -151.6970, timing: 'Full Day', type: 'culture' },
            { day: 5, title: 'Sunset Catamaran Cruise with Champagne', locationName: 'Vaitape Bay', lat: -16.5057, lng: -151.7513, timing: 'Sunset', type: 'adventure' },
            { day: 6, title: 'Paddleboarding & Matira Beach Picnic', locationName: 'Matira White Sands Beach', lat: -16.5446, lng: -151.7410, timing: 'Day 6', type: 'nature' },
            { day: 7, title: 'Departure Flight Over Turquoise Lagoon', locationName: 'Bora Bora Airport', lat: -16.4444, lng: -151.7513, timing: 'Morning', type: 'departure' }
        ]
    },
    // 9. Himalayan Adventure in Ladakh
    9: {
        packageId: 9,
        defaultZoom: 9,
        center: [34.2, 77.8],
        waypoints: [
            { day: 1, title: 'Arrival at Leh (11,500 ft) & Rest', locationName: 'Leh Main Bazaar & Palace', lat: 34.1526, lng: 77.5771, timing: 'Acclimatization', type: 'arrival' },
            { day: 2, title: 'Thiksey, Shey & Hemis Monasteries', locationName: 'Thiksey Monastery', lat: 34.0569, lng: 77.6668, timing: 'Heritage Day', type: 'temple' },
            { day: 3, title: 'Crossing Khardung La Pass (18,380 ft)', locationName: 'Khardung La & Hunder Dunes', lat: 34.2787, lng: 77.6047, timing: 'High Mountain Pass', type: 'adventure' },
            { day: 4, title: 'Nubra Valley Double-Humped Camel Safari', locationName: 'Diskit Monastery & Hunder', lat: 34.5428, lng: 77.5614, timing: 'Desert Safari', type: 'adventure' },
            { day: 5, title: 'Shyok River Route to Pangong Tso Lake', locationName: 'Pangong Tso Blue Waters', lat: 33.7595, lng: 78.6674, timing: 'Stargazing Camp', type: 'nature' },
            { day: 6, title: 'Scenic Chang La Pass Return & Shanti Stupa', locationName: 'Shanti Stupa Leh', lat: 34.1666, lng: 77.5833, timing: 'Sunset View', type: 'monument' },
            { day: 7, title: 'Farewell Land of High Passes', locationName: 'Kushok Bakula Rimpochee Airport', lat: 34.1359, lng: 77.5465, timing: 'Morning', type: 'departure' }
        ]
    },
    // 10. Greek Islands Adventure (Santorini)
    10: {
        packageId: 10,
        defaultZoom: 12,
        center: [36.4166, 25.4324],
        waypoints: [
            { day: 1, title: 'Caldera View Check-in & Fira Stroll', locationName: 'Fira Cliffside', lat: 36.4166, lng: 25.4324, timing: 'Evening', type: 'arrival' },
            { day: 2, title: 'Scenic Hike to Imerovigli & Skaros Rock', locationName: 'Imerovigli Caldera Trail', lat: 36.4329, lng: 25.4227, timing: 'Morning', type: 'nature' },
            { day: 3, title: 'Volcano Boat Tour & Hot Springs Swim', locationName: 'Nea Kameni Active Crater', lat: 36.4039, lng: 25.3964, timing: 'Boat Tour', type: 'adventure' },
            { day: 4, title: 'World-Famous Oia Sunset & Windmills', locationName: 'Oia Castle Lookout', lat: 36.4618, lng: 25.3753, timing: 'Full Day', type: 'monument' },
            { day: 5, title: 'Unique Red Beach & Perissa Black Sands', locationName: 'Red Beach Akrotiri', lat: 36.3484, lng: 25.3942, timing: 'Beach Day', type: 'nature' },
            { day: 6, title: 'Assyrtiko Wine Tasting in Volcanic Cellars', locationName: 'Pyrgos Kallistis Vineyards', lat: 36.3831, lng: 25.4502, timing: 'Afternoon', type: 'culture' },
            { day: 7, title: 'Minoan Ruins of Ancient Akrotiri', locationName: 'Akrotiri Archaeological Site', lat: 36.3514, lng: 25.4033, timing: 'Historical Tour', type: 'monument' },
            { day: 8, title: 'Greek Frappé & Departure', locationName: 'Santorini Thira Airport', lat: 36.3992, lng: 25.4793, timing: 'Departure', type: 'departure' }
        ]
    },
    // 11. Varanasi Spiritual & Cultural Journey
    11: {
        packageId: 11,
        defaultZoom: 13,
        center: [25.32, 83.01],
        waypoints: [
            { day: 1, title: 'Arrival & Mesmerizing Dashashwamedh Ganga Aarti', locationName: 'Dashashwamedh Ghat Riverfront', lat: 25.3076, lng: 83.0107, timing: 'Sunset Boat Ritual', type: 'culture' },
            { day: 2, title: 'Sunrise Boat Ride & Kashi Vishwanath Corridor', locationName: 'Kashi Vishwanath Temple & Ghats', lat: 25.3109, lng: 83.0107, timing: 'Dawn & Heritage Walk', type: 'temple' },
            { day: 3, title: 'Sarnath Buddhist Sanctuary & Banarasi Silk Weaving', locationName: 'Sarnath Dhamek Stupa & Museum', lat: 25.3811, lng: 83.0229, timing: 'Full Day Excursion', type: 'monument' },
            { day: 4, title: 'Assi Ghat Subah-e-Banaras & Departure', locationName: 'Assi Ghat & Lal Bahadur Shastri Airport', lat: 25.2891, lng: 83.0069, timing: 'Morning Blessings', type: 'departure' }
        ]
    },
    // 12. Kashmir Paradise: Dal Lake & Gulmarg
    12: {
        packageId: 12,
        defaultZoom: 10,
        center: [34.0837, 74.8370],
        waypoints: [
            { day: 1, title: 'Arrival & Sunset Shikara Cruise', locationName: 'Dal Lake Wooden Houseboats', lat: 34.0837, lng: 74.8370, timing: 'Sunset Cruise', type: 'arrival' },
            { day: 2, title: 'Mughal Gardens & Shankaracharya Temple', locationName: 'Shalimar & Nishat Bagh', lat: 34.1485, lng: 74.8727, timing: 'Full Day', type: 'culture' },
            { day: 3, title: 'Gulmarg Snow Valley & Gondola Ride', locationName: 'Gulmarg Gondola & Apharwat Peak', lat: 34.0484, lng: 74.3805, timing: 'Alpine Cable Car', type: 'adventure' },
            { day: 4, title: 'Pahalgam Valley of Shepherds', locationName: 'Betaab Valley & Lidder River', lat: 34.0150, lng: 75.3188, timing: 'Scenic Valley Excursion', type: 'nature' },
            { day: 5, title: 'Aru Valley & Baisaran Mini Switzerland', locationName: 'Baisaran Pine Meadows', lat: 34.0890, lng: 75.2650, timing: 'Pony Trek & Woods', type: 'adventure' },
            { day: 6, title: 'Saffron Fields of Pampore & Departure', locationName: 'Sheikh ul-Alam Srinagar Airport', lat: 34.0044, lng: 74.7741, timing: 'Morning', type: 'departure' }
        ]
    },
    // 13. Golden Triangle: Taj Mahal & Mughal Splendors
    13: {
        packageId: 13,
        defaultZoom: 9,
        center: [27.8, 77.7],
        waypoints: [
            { day: 1, title: 'Old Delhi Heritage & Spice Market', locationName: 'Red Fort & Chandni Chowk', lat: 28.6562, lng: 77.2410, timing: 'Afternoon Rickshaw', type: 'culture' },
            { day: 2, title: 'Lutyens\' Delhi & UNESCO Landmarks', locationName: 'Humayun\'s Tomb & Qutub Minar', lat: 28.5244, lng: 77.1855, timing: 'Full Day Heritage', type: 'monument' },
            { day: 3, title: 'Agra Fort & Mehtab Bagh Sunset', locationName: 'Agra Fort & Yamuna Riverfront', lat: 27.1795, lng: 78.0211, timing: 'Sunset View', type: 'monument' },
            { day: 4, title: 'Sunrise Wonder at Taj Mahal', locationName: 'Taj Mahal Marble Complex', lat: 27.1751, lng: 78.0421, timing: 'Sunrise Guided', type: 'monument' },
            { day: 5, title: 'Fatehpur Sikri & Departure', locationName: 'Fatehpur Sikri Imperial City', lat: 27.0945, lng: 77.6679, timing: 'Morning Excursion', type: 'departure' }
        ]
    },
    // 14. Himachal Mountain Haven: Manali & Rohtang
    14: {
        packageId: 14,
        defaultZoom: 11,
        center: [32.2483, 77.1802],
        waypoints: [
            { day: 1, title: 'Arrival in Manali & Hadimba Temple', locationName: 'Hadimba Devi Cedar Temple', lat: 32.2483, lng: 77.1802, timing: 'Afternoon Stroll', type: 'arrival' },
            { day: 2, title: 'Solang Valley Action & Paragliding', locationName: 'Solang Valley Adventure Grounds', lat: 32.3166, lng: 77.1578, timing: 'Adventure Sports', type: 'adventure' },
            { day: 3, title: 'Atal Tunnel & High Rohtang Snow Peak', locationName: 'Atal Tunnel & Rohtang Pass', lat: 32.3644, lng: 77.1958, timing: 'Snow Summit', type: 'nature' },
            { day: 4, title: 'Naggar Castle & Heritage Art Gallery', locationName: 'Naggar Ancient Timber Castle', lat: 32.1460, lng: 77.1706, timing: 'Heritage Day', type: 'culture' },
            { day: 5, title: 'Beas River Rafting & Vashisht Springs', locationName: 'Beas River Rafting Point Kullu', lat: 31.9579, lng: 77.1095, timing: 'River Rafting', type: 'adventure' },
            { day: 6, title: 'Old Manali Shopping & Departure', locationName: 'Mall Road Manali', lat: 32.2396, lng: 77.1887, timing: 'Departure', type: 'departure' }
        ]
    },
    // 15. Andaman Tropical Escapade: Havelock & Neil
    15: {
        packageId: 15,
        defaultZoom: 10,
        center: [11.85, 92.9],
        waypoints: [
            { day: 1, title: 'Port Blair & Cellular Jail Memorial', locationName: 'Cellular Jail Port Blair', lat: 11.6739, lng: 92.7478, timing: 'Historic Evening', type: 'arrival' },
            { day: 2, title: 'Catamaran to Havelock & Radhanagar Sunset', locationName: 'Radhanagar White Beach #7', lat: 11.9839, lng: 92.9525, timing: 'Sunset Beach', type: 'nature' },
            { day: 3, title: 'Elephant Beach Scuba & Coral Snorkeling', locationName: 'Elephant Beach Coral Reef', lat: 12.0006, lng: 92.9515, timing: 'Scuba Diving', type: 'adventure' },
            { day: 4, title: 'Cruise to Neil Island & Laxmanpur Beach', locationName: 'Laxmanpur Beach Neil Island', lat: 11.8340, lng: 93.0470, timing: 'Bioluminescent Shore', type: 'nature' },
            { day: 5, title: 'Natural Rock Bridge & Return to Port Blair', locationName: 'Howrah Living Coral Bridge', lat: 11.8210, lng: 93.0530, timing: 'Morning Low Tide', type: 'nature' },
            { day: 6, title: 'Chatham Island & Island Departure', locationName: 'Veer Savarkar International Airport', lat: 11.6412, lng: 92.7297, timing: 'Departure', type: 'departure' }
        ]
    },
    // 16. Meghalaya: Living Roots & Crystal Rivers
    16: {
        packageId: 16,
        defaultZoom: 10,
        center: [25.35, 91.8],
        waypoints: [
            { day: 1, title: 'Guwahati to Shillong via Umiam Lake', locationName: 'Umiam Lake Watersports', lat: 25.6667, lng: 91.8950, timing: 'Scenic Hill Drive', type: 'arrival' },
            { day: 2, title: 'Cherrapunji Waterfalls & Limestone Caves', locationName: 'Nohkalikai Falls & Mawsmai Cave', lat: 25.2764, lng: 91.6847, timing: 'Waterfalls & Caves', type: 'nature' },
            { day: 3, title: 'Double Decker Living Root Bridge Trek', locationName: 'Nongriat Living Root Bridge', lat: 25.2470, lng: 91.6700, timing: 'Rainforest Trek', type: 'adventure' },
            { day: 4, title: 'Transparent Dawki River & Cleanest Village', locationName: 'Umngot Crystal River Dawki', lat: 25.1840, lng: 92.0190, timing: 'Boating on Air', type: 'nature' },
            { day: 5, title: 'Laitlum Grand Canyons & Departure', locationName: 'Laitlum Canyons & Guwahati Airport', lat: 25.4490, lng: 91.9050, timing: 'Canyon Morning', type: 'departure' }
        ]
    }
};

export const getPackageRoute = (packageId: number, packageName: string, destination: string, itineraryCount: number): PackageRouteData => {
    if (packageRoutes[packageId]) {
        return packageRoutes[packageId];
    }

    // Default fallback waypoints for any new/custom package
    const defaultCenter: [number, number] = [28.6139, 77.2090];
    const waypoints: Waypoint[] = [];
    const count = Math.max(1, itineraryCount || 3);
    for (let i = 1; i <= count; i++) {
        waypoints.push({
            day: i,
            title: `Day ${i} Highlights in ${destination}`,
            locationName: `${destination} Landmark ${i}`,
            lat: defaultCenter[0] + (i - 1) * 0.03,
            lng: defaultCenter[1] + (i - 1) * 0.03,
            timing: i === 1 ? 'Arrival' : i === count ? 'Departure' : 'Exploration',
            type: i === 1 ? 'arrival' : i === count ? 'departure' : 'culture'
        });
    }

    return {
        packageId,
        defaultZoom: 11,
        center: defaultCenter,
        waypoints
    };
};
