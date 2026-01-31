'use client';

import { useState, useEffect } from 'react';
import { generatePrescriptionPDF, downloadPDF } from '../utils/pdfGenerator';

export default function PreviousReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedReport, setExpandedReport] = useState(null);
    const [downloadingPDF, setDownloadingPDF] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/diagnose');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch reports');
            }

            setReports(data.reports || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (report) => {
        setDownloadingPDF(report.id);
        try {
            const doc = await generatePrescriptionPDF({
                data: report.diagnosis,
                symptomCount: report.symptoms.length,
            });
            if (doc) {
                const date = new Date(report.createdAt).toISOString().split('T')[0];
                downloadPDF(doc, `MediCare_Report_${date}`);
            }
        } catch (error) {
            console.error('PDF generation failed:', error);
        }
        setDownloadingPDF(null);
    };

    const getUrgencyConfig = (level) => {
        switch (level?.toLowerCase()) {
            case 'emergency': return { badge: 'badge-danger', icon: '🚨', text: 'Emergency' };
            case 'high': return { badge: 'badge-danger', icon: '⚠️', text: 'High' };
            case 'medium': return { badge: 'badge-warning', icon: '⚡', text: 'Medium' };
            default: return { badge: 'badge-success', icon: '✓', text: 'Low' };
        }
    };

    if (loading) {
        return (
            <div className="card p-12 text-center">
                <svg className="w-8 h-8 spin mx-auto mb-4 text-[#93c572]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-gray-500">Loading your reports...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card p-8">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-700 font-medium mb-2">Failed to load reports</p>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <button onClick={fetchReports} className="btn btn-secondary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="card p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-2">No previous reports</p>
                <p className="text-sm text-gray-400">Your diagnosis reports will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                    Your Health Reports ({reports.length})
                </h2>
                <button onClick={fetchReports} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {reports.map((report) => {
                const urgencyConfig = getUrgencyConfig(report.urgencyLevel);
                const isExpanded = expandedReport === report.id;
                const reportDate = new Date(report.createdAt);

                return (
                    <div key={report.id} className="card p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`badge ${urgencyConfig.badge} flex items-center gap-1`}>
                                        <span>{urgencyConfig.icon}</span>
                                        {urgencyConfig.text}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {reportDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {report.symptoms.slice(0, 3).map((symptom, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-[#eef5e9] text-[#5a8a3d] rounded-full">
                                            {symptom}
                                        </span>
                                    ))}
                                    {report.symptoms.length > 3 && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                            +{report.symptoms.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownloadPDF(report)}
                                    disabled={downloadingPDF === report.id}
                                    className="btn btn-icon btn-ghost hover:bg-[#eef5e9]"
                                    title="Download PDF"
                                >
                                    {downloadingPDF === report.id ? (
                                        <svg className="w-5 h-5 spin text-[#93c572]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-[#93c572]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                                    className="btn btn-secondary text-sm px-4 py-2"
                                >
                                    {isExpanded ? 'Hide' : 'View'} Details
                                </button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="pt-3 border-t border-gray-100 space-y-3 fade-in">
                                {/* All Symptoms */}
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-2">Symptoms Reported:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {report.symptoms.map((symptom, idx) => (
                                            <span key={idx} className="text-xs px-2 py-1 bg-[#eef5e9] text-[#5a8a3d] rounded-full">
                                                {symptom}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Conditions */}
                                {report.diagnosis.possibleConditions?.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-2">Possible Conditions:</p>
                                        <ul className="space-y-1 text-sm text-gray-700">
                                            {report.diagnosis.possibleConditions.slice(0, 3).map((cond, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-[#93c572] mt-1">•</span>
                                                    <span>{cond.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Assessment */}
                                {report.diagnosis.overallAssessment && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-2">Assessment:</p>
                                        <p className="text-sm text-gray-600">{report.diagnosis.overallAssessment}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
