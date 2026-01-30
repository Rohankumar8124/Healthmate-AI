'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';

const SYMPTOM_CATEGORIES = {
    'General': ['Fever', 'Fatigue', 'Weakness', 'Chills', 'Night Sweats', 'Weight Loss', 'Weight Gain', 'Loss of Appetite'],
    'Head': ['Headache', 'Migraine', 'Dizziness', 'Confusion', 'Memory Issues', 'Difficulty Concentrating', 'Blurred Vision'],
    'Respiratory': ['Dry Cough', 'Wet Cough', 'Shortness of Breath', 'Wheezing', 'Chest Congestion', 'Runny Nose', 'Nasal Congestion', 'Sneezing'],
    'Throat': ['Sore Throat', 'Difficulty Swallowing', 'Hoarse Voice', 'Dry Mouth', 'Swollen Glands'],
    'Digestive': ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Stomach Pain', 'Bloating', 'Heartburn', 'Indigestion'],
    'Body': ['Body Pain', 'Muscle Aches', 'Joint Pain', 'Back Pain', 'Neck Stiffness', 'Muscle Cramps', 'Swelling'],
    'Skin': ['Rash', 'Itching', 'Dry Skin', 'Hives', 'Bruising', 'Acne'],
    'Mental': ['Anxiety', 'Depression', 'Stress', 'Insomnia', 'Mood Swings', 'Irritability'],
};

export default function SymptomChecker({ selectedSymptoms, setSelectedSymptoms, additionalInfo, setAdditionalInfo, documents, setDocuments, onDiagnose, isLoading }) {
    const [activeCategory, setActiveCategory] = useState('General');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDocUpload, setShowDocUpload] = useState(false);

    const toggleSymptom = (symptom) => {
        setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
    };

    const filteredSymptoms = searchQuery
        ? Object.values(SYMPTOM_CATEGORIES).flat().filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        : SYMPTOM_CATEGORIES[activeCategory];

    const clearAll = () => {
        setSelectedSymptoms([]);
        setAdditionalInfo('');
        setSearchQuery('');
        setDocuments([]);
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="card p-5">
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search symptoms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-12" />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Category Pills */}
            {!searchQuery && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {Object.keys(SYMPTOM_CATEGORIES).map((cat) => (
                        <button key={cat} className={`category-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
                    ))}
                </div>
            )}

            {/* Symptoms Grid */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">{searchQuery ? 'Search Results' : activeCategory}</h2>
                    {selectedSymptoms.length > 0 && (
                        <button onClick={clearAll} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Clear
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredSymptoms.map((symptom) => (
                        <div key={symptom} className={`symptom-checkbox ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`} onClick={() => toggleSymptom(symptom)}>
                            <div className="checkbox-icon">
                                {selectedSymptoms.includes(symptom) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{symptom}</span>
                        </div>
                    ))}
                </div>
                {filteredSymptoms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No symptoms match "{searchQuery}"</div>
                )}
            </div>

            {/* Selected Summary */}
            {selectedSymptoms.length > 0 && (
                <div className="card p-5 card-pistachio scale-in">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-[#7ab356]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <h3 className="font-semibold text-gray-800">Selected <span className="number-highlight ml-1">{selectedSymptoms.length}</span></h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map((s) => (
                            <span key={s} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#93c572]/30 rounded-full text-sm text-gray-700">
                                {s}
                                <button onClick={() => toggleSymptom(s)} className="hover:text-red-500"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Info */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                    <h3 className="font-semibold text-gray-800">Additional Details</h3>
                    <span className="text-xs text-gray-400">(Optional)</span>
                </div>
                <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Describe when symptoms started, severity, duration, or any other relevant details..." className="input-field min-h-[100px] resize-none" rows={3} />
            </div>

            {/* Medical Documents Upload (Optional) */}
            <div className="card p-5">
                <button onClick={() => setShowDocUpload(!showDocUpload)} className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <h3 className="font-semibold text-gray-800">Previous Medical Documents</h3>
                        <span className="text-xs text-gray-400">(Optional)</span>
                        {documents.length > 0 && <span className="badge badge-success text-xs">{documents.length} uploaded</span>}
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${showDocUpload ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {showDocUpload && (
                    <div className="mt-4 pt-4 border-t border-gray-100 fade-in">
                        <p className="text-sm text-gray-500 mb-4">Upload previous prescriptions, lab reports, or medical records to help provide better context for your assessment.</p>
                        <DocumentUpload documents={documents} setDocuments={setDocuments} />
                    </div>
                )}
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center pt-2">
                <button onClick={onDiagnose} disabled={isLoading || selectedSymptoms.length === 0} className="btn btn-primary text-base px-10 py-4">
                    {isLoading ? (
                        <><svg className="w-5 h-5 spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Analyzing...</>
                    ) : (
                        <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Analyze Symptoms</>
                    )}
                </button>
            </div>
        </div>
    );
}
