import React from 'react';
import { motion } from 'framer-motion';
import { GlobalStyle } from '../types';
import { TEACHING_STYLES } from '../utils/constants';

interface GlobalStyleSelectorProps {
  selectedStyle?: GlobalStyle;
  onSelectStyle: (style: GlobalStyle) => void;
  showTitle?: boolean;
}

export const GlobalStyleSelector: React.FC<GlobalStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  showTitle = true
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-6" role="region" aria-labelledby="style-selector-main-heading">
      {showTitle && (
        <header className="text-center mb-6">
          <h3 id="style-selector-main-heading" className="text-xl font-bold text-gray-900">
          🌍 Choose Your Teaching Style
          </h3>
        </header>
      )}
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4" role="group" aria-labelledby="teaching-styles-heading">
        <h4 id="teaching-styles-heading" className="sr-only">Available Teaching Styles</h4>
        {TEACHING_STYLES.map((style, index) => (
          <motion.button
            key={style.id}
            onClick={() => onSelectStyle(style.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedStyle === style.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{style.flag}</span>
              <div>
                <h4 className="font-bold text-gray-900">{style.name}</h4>
                <p className="text-sm text-blue-600 font-medium">{style.description}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {style.approach}
            </p>
          </motion.button>
        ))}
      </main>
      
      {showTitle && (
        <footer className="mt-6 text-center" aria-label="Style selection help text">
          <p className="text-sm text-gray-500">
            Each style brings unique benefits. You can change styles anytime during the lesson!
          </p>
        </footer>
      )}
    </section>
  );
};