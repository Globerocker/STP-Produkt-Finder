import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { trackPageView } from '../services/trackingService';
import { QUIZ_STEPS } from '../lib/quizData';
import { locales } from '../lib/locales';
import AdminAuth from './AdminAuth';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalViews: 0,
        totalQuizzes: 0,
        topProducts: [] as { name: string, count: number }[],
        topSoftware: [] as { name: string, count: number }[],
        percentNotary: 0,
        avgLawyers: 0,
        submissions: [] as any[], // Store raw data for export
        questionStats: {} as Record<string, Record<string, number>>
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView();

        const fetchStats = async () => {
            try {
                // 1. Get total page views
                const { count: viewCount } = await supabase
                    .from('tracking_events')
                    .select('*', { count: 'exact', head: true })
                    .eq('event_type', 'page_view');

                // 2. Get total quiz completions (unique sessions)
                const { count: quizCount, data: submissions } = await supabase
                    .from('quiz_submissions')
                    .select('*')
                    .not('result_product', 'is', null)
                    .order('created_at', { ascending: false })
                    .limit(500); // Increased limit for better stats

                // 3. Aggregate Data
                const productCounts: Record<string, number> = {};
                const softwareCounts: Record<string, number> = {};
                const qStats: Record<string, Record<string, number>> = {};

                let notaryCount = 0;
                let totalLawyers = 0;
                let lawyerResponses = 0;

                submissions?.forEach((sub: any) => {
                    // Products
                    const product = sub.result_product;
                    if (product) productCounts[product] = (productCounts[product] || 0) + 1;

                    // Software
                    const software = sub.current_software;
                    if (software) {
                        const softwareName = software === 'other' && sub.answers?.currentSoftwareOther
                            ? `Other: ${sub.answers.currentSoftwareOther}`
                            : software;
                        softwareCounts[softwareName] = (softwareCounts[softwareName] || 0) + 1;
                    }

                    // Notary
                    if (sub.notary) notaryCount++;

                    // Lawyers
                    if (sub.lawyer_count) {
                        totalLawyers += Number(sub.lawyer_count);
                        lawyerResponses++;
                    }

                    // Granular Question Stats from JSON 'answers' column
                    // Note: Schema has explicit columns for some, but 'answers' JSONB has all
                    const answers = sub.answers || {};
                    Object.keys(answers).forEach(key => {
                        if (!qStats[key]) qStats[key] = {};
                        const val = String(answers[key]); // Convert/normalize to string for grouping
                        qStats[key][val] = (qStats[key][val] || 0) + 1;
                    });
                });

                const sortedProducts = Object.entries(productCounts)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                const topSoftware = Object.entries(softwareCounts)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setStats({
                    totalViews: viewCount || 0,
                    totalQuizzes: quizCount || 0,
                    topProducts: sortedProducts,
                    topSoftware,
                    percentNotary: submissions?.length ? Math.round((notaryCount / submissions.length) * 100) : 0,
                    avgLawyers: lawyerResponses ? Math.round(totalLawyers / lawyerResponses) : 0,
                    submissions: submissions || [],
                    questionStats: qStats
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const downloadCSV = () => {
        if (!stats.submissions.length) return;

        // Helper to escape CSV values
        const quote = (str: string | number | boolean | null | undefined) => {
            if (str === null || str === undefined) return '""';
            return `"${String(str).replace(/"/g, '""')}"`;
        };

        // 1. Static Headers
        const staticHeaders = ['Session ID', 'Date', 'Time on Page (s)', 'Recommended Product', 'Language', 'Location', 'Notary', 'Lawyers', 'Software', 'Avg Hourly Rate'];

        // 2. Dynamic Headers (Full Question Text)
        const allQuestions = QUIZ_STEPS.flatMap(step => step.questions);
        const questionHeaders = allQuestions.map(q => {
            // Look up text in German locale (primary) or fall back to ID
            const qKey = q.id as keyof typeof locales.de.quizQuestions;
            return quote(locales.de.quizQuestions[qKey]?.text || q.id);
        });

        const headers = [...staticHeaders, ...questionHeaders];

        // 3. Rows
        const csvRows = stats.submissions.map(sub => {
            // Static Data
            const date = new Date(sub.created_at).toLocaleString();
            const location = sub.location || 'Unknown';

            // Calculate pseudo "Time on Page" if we don't track start time effectively yet
            const timeOnPage = '';

            const staticData = [
                quote(sub.session_id),
                quote(date),
                quote(timeOnPage),
                quote(sub.result_product),
                quote(sub.language),
                quote(location),
                sub.notary ? 'Yes' : 'No',
                sub.lawyer_count || 0,
                quote(sub.current_software),
                sub.average_hourly_rate || 0
            ];

            // Dynamic Question Answers
            const questionData = allQuestions.map(q => {
                const val = sub.answers ? sub.answers[q.id] : undefined;

                // Format booleans
                if (val === true || val === 1 || val === '1') return 'Yes';
                if (val === false || val === 0 || val === '0') return 'No';

                return quote(val);
            });

            return [...staticData, ...questionData].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `stp_quiz_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <AdminAuth>
            <div className="max-w-7xl mx-auto p-6 animate-fade-in bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">STP Analytics Dashboard</h1>
                    <button
                        onClick={downloadCSV}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Total Page Views</h3>
                        <p className="text-4xl font-bold text-brand-primary mt-2">{stats.totalViews}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Quiz Submissions</h3>
                        <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalQuizzes}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Notary Rate</h3>
                        <p className="text-4xl font-bold text-purple-600 mt-2">{stats.percentNotary}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Avg Lawyers/Firm</h3>
                        <p className="text-4xl font-bold text-orange-600 mt-2">{stats.avgLawyers}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Recommended Products</h3>
                        <ul className="space-y-3">
                            {stats.topProducts.map((p, idx) => (
                                <li key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <span className="font-medium text-gray-700">{p.name}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500">{p.count}</span>
                                        <span className="text-brand-primary font-bold w-12 text-right">
                                            {stats.totalQuizzes > 0 ? ((p.count / stats.totalQuizzes) * 100).toFixed(0) : 0}%
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Most Common Software</h3>
                        <ul className="space-y-3">
                            {stats.topSoftware.map((p, idx) => (
                                <li key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <span className="font-medium text-gray-700">{p.name}</span>
                                    <span className="text-gray-500">{p.count} users</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-12 pb-2 border-b">Detailed Response Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {QUIZ_STEPS.flatMap(step => step.questions).map((qInfo) => {
                        // We need the translated title/label for the header, not just ID
                        // For MVP we use the ID or look it up from locales if we had a flat map.
                        // Let's use ID for now and try to format it nicely.

                        const data = stats.questionStats[qInfo.id] || {};
                        const totalResponses = Object.values(data).reduce((a, b) => a + b, 0);

                        return (
                            <div key={qInfo.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 break-inside-avoid">
                                <h3 className="text-md font-bold text-brand-primary mb-3 capitalize">{qInfo.id.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                <div className="space-y-2">
                                    {Object.entries(data)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([answer, count], idx) => {
                                            // Format boolean/binary answers
                                            let label = answer;
                                            if (answer === '1' || answer === 'true') label = 'Yes';
                                            if (answer === '0' || answer === 'false') label = 'No';

                                            const pct = totalResponses ? Math.round((count / totalResponses) * 100) : 0;

                                            return (
                                                <div key={idx} className="relative">
                                                    <div className="flex justify-between text-sm mb-1 z-10 relative">
                                                        <span className="font-medium text-gray-700 truncate max-w-[70%]">{label}</span>
                                                        <span className="text-gray-500">{count} ({pct}%)</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-brand-secondary h-2 rounded-full"
                                                            style={{ width: `${pct}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    {totalResponses === 0 && <p className="text-sm text-gray-400 italic">No data yet</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminAuth>
    );
};

export default DashboardPage;
