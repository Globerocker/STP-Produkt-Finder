import React from 'react';
import { PRODUCT_FEATURES } from '../lib/productData';
import { Product } from '../types';
import { CheckmarkIcon, XIcon, MinusIcon } from './IconComponents';
import { useLanguage } from '../contexts/LanguageContext';
import { locales } from '../lib/locales';

interface ProductComparisonTableProps {
  topProductId: string;
  productsToDisplay: Product[];
}

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ topProductId, productsToDisplay }) => {
  const { language } = useLanguage();
  const t = locales[language].comparison;
    
  if (productsToDisplay.length === 0) {
    return null;
  }
    
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? <CheckmarkIcon className="h-5 w-5 text-green-600 mx-auto" /> : <XIcon className="h-5 w-5 text-red-500 mx-auto" />;
    }
    if(typeof value === 'string' && value.trim() !== '') {
        return <span className="text-xs text-center text-brand-text">{value}</span>
    }
    return <MinusIcon className="h-5 w-5 text-gray-400 mx-auto" />;
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl mt-12 w-full overflow-x-auto">
      <h3 className="text-2xl font-bold text-brand-primary mb-6 text-center">{t.title}</h3>
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-4 font-bold text-brand-text w-1/3">{t.feature}</th>
            {productsToDisplay.map(product => (
              <th key={product.id} className={`p-4 font-bold text-center ${product.id === topProductId ? 'text-brand-accent' : 'text-brand-primary'}`}>
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRODUCT_FEATURES.map(category => (
            <React.Fragment key={category.id}>
              <tr>
                <td colSpan={productsToDisplay.length + 1} className="p-4 bg-brand-light-bg font-bold text-brand-primary">
                  {/* FIX: Cast featureCategories to allow indexing by a string variable. */}
                  {(locales[language].featureCategories as Record<string, string>)[category.id]}
                </td>
              </tr>
              {category.features.map(feature => (
                <tr key={feature.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  {/* FIX: Cast features object to allow indexing by a string variable. */}
                  <td className="p-4 text-brand-text">{(locales[language].features as Record<string, { name: string }>)[feature.id].name}</td>
                  {productsToDisplay.map(product => (
                    <td key={`${feature.id}-${product.id}`} className={`p-4 text-center ${product.id === topProductId ? 'bg-brand-accent-light/30' : ''}`}>
                       {renderFeatureValue(feature[product.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparisonTable;