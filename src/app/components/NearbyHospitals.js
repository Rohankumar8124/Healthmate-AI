'use client';

import { useState, useEffect } from 'react';

export default function NearbyHospitals() {
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [permissionState, setPermissionState] = useState('prompt');

    const requestLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setPermissionState('granted');

                // Fetch nearby hospitals
                await fetchNearbyHospitals(latitude, longitude);
            },
            (error) => {
                setPermissionState('denied');
                setError(error.message === 'User denied Geolocation'
                    ? 'Location access denied. Please enable location permissions in your browser settings.'
                    : `Unable to retrieve location: ${error.message}`
                );
                setLoading(false);
            }
        );
    };

    const fetchNearbyHospitals = async (lat, lng) => {
        try {
            // Using Overpass API (OpenStreetMap) to find nearby hospitals - Free and no API key needed
            const radius = 5000; // 5km radius
            const query = `
                [out:json];
                (
                    node["amenity"="hospital"](around:${radius},${lat},${lng});
                    way["amenity"="hospital"](around:${radius},${lat},${lng});
                    node["amenity"="clinic"](around:${radius},${lat},${lng});
                    way["amenity"="clinic"](around:${radius},${lat},${lng});
                );
                out center;
            `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query,
            });

            if (!response.ok) throw new Error('Failed to fetch hospitals');

            const data = await response.json();

            // Process and sort by distance
            const hospitalsData = data.elements.map(element => {
                const hospitalLat = element.lat || element.center?.lat;
                const hospitalLng = element.lon || element.center?.lon;
                const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);

                return {
                    id: element.id,
                    name: element.tags?.name || 'Unnamed Hospital',
                    type: element.tags?.amenity === 'hospital' ? 'Hospital' : 'Clinic',
                    address: formatAddress(element.tags),
                    phone: element.tags?.phone || element.tags?.['contact:phone'],
                    emergency: element.tags?.emergency === 'yes',
                    lat: hospitalLat,
                    lng: hospitalLng,
                    distance: distance.toFixed(2),
                };
            }).filter(h => h.lat && h.lng)
                .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                .slice(0, 15); // Limit to 15 closest

            setHospitals(hospitalsData);
        } catch (err) {
            setError('Failed to fetch nearby hospitals. Please try again.');
            console.error('Error fetching hospitals:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const toRad = (deg) => deg * (Math.PI / 180);

    const formatAddress = (tags) => {
        const parts = [];
        if (tags?.['addr:street']) parts.push(tags['addr:street']);
        if (tags?.['addr:city']) parts.push(tags['addr:city']);
        if (tags?.['addr:state']) parts.push(tags['addr:state']);
        return parts.length > 0 ? parts.join(', ') : 'Address not available';
    };

    const openInMaps = (lat, lng, name) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#93c572]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Nearby Hospitals & Clinics
                        </h2>
                        <p className="text-sm text-gray-500">
                            Find healthcare facilities near your location
                        </p>
                    </div>

                    {!location && (
                        <button
                            onClick={requestLocation}
                            disabled={loading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Getting Location...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    Enable Location
                                </>
                            )}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm text-red-700 font-medium">Location Error</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Hospitals List */}
            {location && hospitals.length > 0 && (
                <div className="space-y-3">
                    <p className="text-sm text-gray-500 px-1">
                        Found {hospitals.length} healthcare facilities within 5km
                    </p>

                    {hospitals.map((hospital, index) => (
                        <div key={hospital.id} className="card p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="number-highlight text-sm">{index + 1}</span>
                                        <div>
                                            <h3 className="font-medium text-gray-800">{hospital.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`badge text-xs ${hospital.type === 'Hospital' ? 'badge-info' : 'badge-neutral'}`}>
                                                    {hospital.type}
                                                </span>
                                                {hospital.emergency && (
                                                    <span className="badge badge-danger text-xs">Emergency</span>
                                                )}
                                                <span className="text-xs text-gray-400">• {hospital.distance} km away</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-sm text-gray-600 ml-11">
                                        <p className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {hospital.address}
                                        </p>
                                        {hospital.phone && (
                                            <p className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <a href={`tel:${hospital.phone}`} className="text-[#93c572] hover:underline">
                                                    {hospital.phone}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => openInMaps(hospital.lat, hospital.lng, hospital.name)}
                                    className="btn btn-secondary text-sm px-4 py-2 flex items-center gap-2 flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Directions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && location && (
                <div className="card p-12 text-center">
                    <svg className="w-8 h-8 spin mx-auto mb-4 text-[#93c572]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-gray-500">Searching for nearby hospitals...</p>
                </div>
            )}

            {/* No Results */}
            {location && !loading && hospitals.length === 0 && !error && (
                <div className="card p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500">No hospitals found within 5km radius</p>
                    <button onClick={() => fetchNearbyHospitals(location.lat, location.lng)} className="btn btn-secondary mt-4">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
