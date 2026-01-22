import React from 'react';
import { Product, ProductFeature } from '../types';
import { locales } from '../lib/locales';
import { useLanguage } from '../contexts/LanguageContext';

interface ComparisonPageProps {
    products: Product[];
    features: ProductFeature[];
    onBack: () => void;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ products, features, onBack }) => {
    const { language } = useLanguage();
    const t = locales[language];

    // Limit to 3 products securely
    const compareProducts = products.slice(0, 3);

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-brand-primary hover:text-brand-light-primary transition-colors flex items-center gap-2"
                >
                    ← {t.app.backToResults || 'Back to Results'}
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{t.app.productComparison || 'Produktvergleich'}</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left border-b bg-gray-50 min-w-[200px]">Feature</th>
                            {compareProducts.map(product => (
                                <th key={product.id} className="p-4 text-center border-b min-w-[200px]">
                                    <div className="font-bold text-lg text-brand-primary">{product.name}</div>
                                    {product.website_url && (
                                        <a
                                            href={product.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-gray-500 hover:text-brand-primary underline"
                                        >
                                            Website ↗
                                        </a>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Firmographics Row */}
                        <tr>
                            <td className="p-4 border-b font-medium text-gray-700 bg-gray-50">Beschreibung</td>
                            {compareProducts.map(product => (
                                <td key={product.id} className="p-4 border-b text-sm text-gray-600 align-top">
                                    {product.description}
                                </td>
                            ))}
                        </tr>

                        {/* Features Rows */}
                        {features.map(feature => (
                            <tr key={feature.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 border-b font-medium text-gray-700">{feature.name}</td>
                                {compareProducts.map(product => {
                                    const hasFeature = feature[product.id];
                                    return (
                                        <td key={product.id} className="p-4 border-b text-center align-middle">
                                            {hasFeature === true ? (
                                                <span className="text-green-500 text-xl">✓</span>
                                            ) : hasFeature === false || hasFeature === undefined ? (
                                                <span className="text-gray-300 text-xl">-</span>
                                            ) : (
                                                <span className="text-sm text-gray-600">{String(hasFeature)}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonPage;
