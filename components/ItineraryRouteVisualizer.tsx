import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, ItineraryItem } from '../types';
import { getPackageRoute, Waypoint } from '../data/itineraryCoordinates';

interface ItineraryRouteVisualizerProps {
    pkg: Package;
    onSelectDay?: (day: number) => void;
}

const ItineraryRouteVisualizer: React.FC<ItineraryRouteVisualizerProps> = ({ pkg, onSelectDay }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const polylineRef = useRef<L.Polyline | null>(null);

    const routeData = getPackageRoute(pkg.id, pkg.name, pkg.destination, pkg.itinerary.length);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const playTimerRef = useRef<any>(null);

    // Get current waypoint and matched itinerary item
    const currentWaypoint = routeData.waypoints.find(w => w.day === selectedDay) || routeData.waypoints[0];
    const currentItineraryItem = pkg.itinerary.find(item => item.day === selectedDay);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
            center: routeData.center,
            zoom: routeData.defaultZoom,
            zoomControl: false,
            scrollWheelZoom: false, // Prevents unintended page scroll capture
        });

        // Add Zoom Control to top-right
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Add CartoDB Voyager tiles (clean, beautiful aesthetic for travel maps)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            subdomains: 'abcd',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Render markers and polyline
        renderWaypointsAndRoute(map, 1);

        return () => {
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [pkg.id]);

    // Handle marker and polyline rendering
    const renderWaypointsAndRoute = (map: L.Map, activeDay: number) => {
        // Clear previous markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        if (polylineRef.current) {
            polylineRef.current.remove();
            polylineRef.current = null;
        }

        const latLngs: L.LatLngTuple[] = [];

        routeData.waypoints.forEach((wp) => {
            const isSelected = wp.day === activeDay;
            latLngs.push([wp.lat, wp.lng]);

            // Custom HTML DivIcon with pulsing highlight for active day
            const customIcon = L.divIcon({
                className: 'custom-itinerary-pin',
                html: `
                    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                        ${isSelected ? `
                            <div style="
                                position: absolute;
                                width: 44px;
                                height: 44px;
                                border-radius: 9999px;
                                background-color: rgba(230, 81, 0, 0.25);
                                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                            "></div>
                        ` : ''}
                        <div style="
                            width: ${isSelected ? '36px' : '28px'};
                            height: ${isSelected ? '36px' : '28px'};
                            border-radius: 9999px;
                            background: ${isSelected ? '#e65100' : '#1e3a8a'};
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 800;
                            font-size: ${isSelected ? '14px' : '11px'};
                            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                            border: 2px solid white;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            ${wp.day}
                        </div>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            });

            const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(map);

            const matchedItinerary = pkg.itinerary.find(i => i.day === wp.day);
            const popupContent = `
                <div style="font-family: inherit; padding: 4px; max-width: 220px;">
                    <div style="font-size: 11px; font-weight: 700; color: #e65100; text-transform: uppercase;">Day ${wp.day} &bull; ${wp.timing || 'Tour'}</div>
                    <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 2px;">${wp.locationName}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${matchedItinerary ? matchedItinerary.title : wp.title}</div>
                </div>
            `;
            marker.bindPopup(popupContent);

            marker.on('click', () => {
                selectDay(wp.day);
            });

            markersRef.current.push(marker);
        });

        // Draw connecting route polyline
        if (latLngs.length > 1) {
            const polyline = L.polyline(latLngs, {
                color: '#e65100',
                weight: 3.5,
                opacity: 0.85,
                dashArray: '6, 8',
                lineCap: 'round',
            }).addTo(map);
            polylineRef.current = polyline;
        }
    };

    // Fly to selected day
    const selectDay = (day: number) => {
        setSelectedDay(day);
        if (onSelectDay) onSelectDay(day);

        const wp = routeData.waypoints.find(w => w.day === day);
        if (wp && mapInstanceRef.current) {
            renderWaypointsAndRoute(mapInstanceRef.current, day);
            mapInstanceRef.current.flyTo([wp.lat, wp.lng], 14, {
                duration: 1.1,
                easeLinearity: 0.25,
            });

            // Open popup for this marker
            const marker = markersRef.current[day - 1];
            if (marker) {
                setTimeout(() => {
                    marker.openPopup();
                }, 700);
            }
        }
    };

    // Fit all bounds
    const handleFitAll = () => {
        if (!mapInstanceRef.current || routeData.waypoints.length === 0) return;
        const bounds = L.latLngBounds(routeData.waypoints.map(w => [w.lat, w.lng]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    };

    // Auto Play Journey through the days
    const toggleAutoPlay = () => {
        if (isPlaying) {
            clearInterval(playTimerRef.current);
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            let nextDay = selectedDay >= routeData.waypoints.length ? 1 : selectedDay + 1;
            selectDay(nextDay);

            playTimerRef.current = setInterval(() => {
                setSelectedDay(prev => {
                    const following = prev >= routeData.waypoints.length ? 1 : prev + 1;
                    selectDay(following);
                    return following;
                });
            }, 3500);
        }
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (playTimerRef.current) clearInterval(playTimerRef.current);
        };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
            {/* Header Bar */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-gray-900 via-primary to-gray-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-white">
                            Interactive Route Visualizer
                        </span>
                        <span className="text-xs text-blue-200">
                            {routeData.waypoints.length} Stops &bull; {pkg.duration}
                        </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold font-montserrat mt-2">
                        Visual Day-by-Day Journey
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                        Explore every waypoint, monument, and scenic transition along your itinerary in {pkg.destination}.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                        onClick={toggleAutoPlay}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                            isPlaying
                                ? 'bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-300'
                                : 'bg-secondary text-white hover:bg-secondary/90'
                        }`}
                        title={isPlaying ? 'Pause Auto Tour' : 'Play Tour'}
                    >
                        {isPlaying ? (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Pause Tour</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                <span>Auto-Play Tour</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleFitAll}
                        className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-white/20"
                        title="Show all stops on map"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="hidden sm:inline">Fit Route</span>
                    </button>
                </div>
            </div>

            {/* Day Selector Chips Carousel */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 overflow-x-auto scrollbar-thin flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2 pr-1 flex-shrink-0">
                    Jump to:
                </span>
                {routeData.waypoints.map(wp => (
                    <button
                        key={wp.day}
                        onClick={() => selectDay(wp.day)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                            selectedDay === wp.day
                                ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20 scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            selectedDay === wp.day ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                            {wp.day}
                        </span>
                        <span>{wp.locationName.split('&')[0].trim()}</span>
                    </button>
                ))}
            </div>

            {/* Split Visualizer Body: Interactive Map + Active Day Detail */}
            <div className="grid lg:grid-cols-12 gap-0">
                {/* Map Display */}
                <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
                    <div ref={mapContainerRef} className="w-full h-full z-10" />

                    {/* Quick overlay tip */}
                    <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-[11px] text-gray-600 flex items-center gap-1.5 pointer-events-none">
                        <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Click any marker to inspect that day's itinerary</span>
                    </div>
                </div>

                {/* Stop Detail Card */}
                <div className="lg:col-span-4 p-6 sm:p-8 bg-gray-50/50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-secondary border border-orange-200">
                                Day {currentWaypoint.day} of {routeData.waypoints.length}
                            </span>
                            <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                                {currentWaypoint.timing || 'Scheduled Activity'}
                            </span>
                        </div>

                        <h4 className="text-xl font-bold font-montserrat text-gray-900 mt-2">
                            {currentItineraryItem?.title || currentWaypoint.title}
                        </h4>

                        <div className="mt-3 flex items-center text-xs text-primary font-semibold gap-1.5">
                            <svg className="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{currentWaypoint.locationName}</span>
                        </div>

                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Activity Description
                            </h5>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {currentItineraryItem?.description || 'Experience curated guided walking tours, local transportation, and heritage visits tailored for this day.'}
                            </p>
                        </div>

                        {/* Coords & External Maps link */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                            <span>GPS: {currentWaypoint.lat.toFixed(4)}, {currentWaypoint.lng.toFixed(4)}</span>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentWaypoint.locationName + ' ' + pkg.destination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-semibold flex items-center gap-1"
                            >
                                Open in Google Maps
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Prev / Next day pagination controls */}
                    <div className="pt-6 mt-6 border-t border-gray-200 flex items-center justify-between gap-3">
                        <button
                            onClick={() => selectDay(Math.max(1, selectedDay - 1))}
                            disabled={selectedDay === 1}
                            className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous Day
                        </button>
                        <button
                            onClick={() => selectDay(Math.min(routeData.waypoints.length, selectedDay + 1))}
                            disabled={selectedDay === routeData.waypoints.length}
                            className="flex-1 py-2 px-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                            Next Day
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryRouteVisualizer;
