import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Globe, MapPin, Users, BookOpen, Award, Shield } from 'lucide-react';
import { INDIAN_CURRICULUM_STANDARDS, INTERNATIONAL_STANDARDS, CurriculumStandard } from '../utils/curriculumStandards';

interface CurriculumSelectorProps {
  selectedStandard?: CurriculumStandard;
  onSelectStandard: (standard: CurriculumStandard) => void;
  userLocation?: string;
  schoolType?: 'government' | 'private' | 'international';
  language?: 'english' | 'hindi';
  gradeLevel?: string;
  showRecommendations?: boolean;
}

interface RecommendationContext {
  standard: CurriculumStandard;
  confidence: number;
  reasons: string[];
  priority: 'primary' | 'secondary' | 'alternative';
}

export const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({
  selectedStandard,
  onSelectStandard,
  userLocation = 'india',
  schoolType = 'government',
  language = 'english',
  gradeLevel,
  showRecommendations = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationContext[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Smart recommendation engine
  useEffect(() => {
    if (showRecommendations) {
      generateRecommendations();
    }
  }, [userLocation, schoolType, language, gradeLevel, showRecommendations]);

  const generateRecommendations = async (): Promise<void> => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const allStandards = [...INDIAN_CURRICULUM_STANDARDS, ...INTERNATIONAL_STANDARDS];
    const contextualRecommendations: RecommendationContext[] = [];

    allStandards.forEach(standard => {
      let confidence = 0;
      const reasons: string[] = [];
      let priority: 'primary' | 'secondary' | 'alternative' = 'alternative';

      // Location-based scoring
      if (userLocation.toLowerCase().includes('india') || userLocation === 'in') {
        if (standard.region === 'national') {
          confidence += 40;
          reasons.push('Designed specifically for Indian educational system');
          priority = 'primary';
        } else {
          confidence += 10;
          reasons.push('International perspective valuable for global awareness');
          priority = 'secondary';
        }
      } else {
        if (standard.region === 'international') {
          confidence += 35;
          reasons.push('International standard suitable for global schools');
          priority = 'primary';
        }
      }

      // School type scoring
      if (schoolType === 'government' && standard.id === 'ncert') {
        confidence += 30;
        reasons.push('NCERT is the foundation for government school curriculum');
      } else if (schoolType === 'private' && standard.id === 'cbse') {
        confidence += 25;
        reasons.push('CBSE widely adopted by private schools in India');
      } else if (schoolType === 'international' && (standard.id === 'ib' || standard.id === 'cambridge')) {
        confidence += 30;
        reasons.push('Internationally recognized curriculum for global mobility');
      }

      // Language preference scoring
      if (language === 'hindi' && standard.region === 'national') {
        confidence += 15;
        reasons.push('Strong Hindi language support and cultural integration');
      } else if (language === 'english' && standard.region === 'international') {
        confidence += 10;
        reasons.push('English-medium instruction with global perspective');
      }

      // Grade level considerations
      if (gradeLevel) {
        const gradeNum = parseInt(gradeLevel);
        if (gradeNum <= 5 && standard.id === 'ncert') {
          confidence += 10;
          reasons.push('NCERT provides excellent foundation for primary grades');
        } else if (gradeNum >= 9 && (standard.id === 'cbse' || standard.id === 'icse')) {
          confidence += 15;
          reasons.push('Strong board exam preparation for secondary grades');
        }
      }

      // Ensure minimum confidence for inclusion
      if (confidence >= 20) {
        contextualRecommendations.push({
          standard,
          confidence: Math.min(confidence, 100),
          reasons,
          priority
        });
      }
    });

    // Sort by confidence and priority
    contextualRecommendations.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { primary: 3, secondary: 2, alternative: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });

    setRecommendations(contextualRecommendations);
    
    // Auto-select top recommendation if no standard is selected
    if (!selectedStandard && contextualRecommendations.length > 0) {
      onSelectStandard(contextualRecommendations[0].standard);
    }
    
    setIsAnalyzing(false);
  };

  const getDisplayName = (standard: CurriculumStandard): string => {
    return language === 'hindi' ? standard.nameHindi : standard.name;
  };

  const getDisplayDescription = (standard: CurriculumStandard): string => {
    return language === 'hindi' ? standard.descriptionHindi : standard.description;
  };

  const topRecommendation = recommendations[0];

  return (
    <section className="space-y-4" role="region" aria-labelledby="curriculum-selector-heading">
      <h3 id="curriculum-selector-heading" className="sr-only">Curriculum Standard Selection</h3>
      {/* AI Recommendation Banner */}
      {showRecommendations && topRecommendation && selectedStandard?.id !== topRecommendation.standard.id && !isAnalyzing && (
        <aside role="complementary" aria-labelledby="ai-recommendation-heading">
          <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 id="ai-recommendation-heading" className="font-semibold text-blue-900 mb-1">
                🤖 AI Recommendation ({topRecommendation.confidence}% match)
              </h4>
              <p className="text-blue-800 mb-2">
                {language === 'hindi' 
                  ? `${getDisplayName(topRecommendation.standard)} आपके संदर्भ के लिए सबसे उपयुक्त है`
                  : `${getDisplayName(topRecommendation.standard)} is most suitable for your context`
                }
              </p>
              <div className="text-sm text-blue-700 space-y-1">
                {topRecommendation.reasons.slice(0, 2).map((reason, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onSelectStandard(topRecommendation.standard)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {language === 'hindi' ? 'इसे चुनें' : 'Select This'}
              </button>
            </div>
          </div>
          </motion.div>
        </aside>
      )}

      {/* Loading State for Recommendations */}
      {isAnalyzing && showRecommendations && (
        <div role="status" aria-live="polite">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <span className="text-gray-600">
              {language === 'hindi' ? 'AI सुझाव तैयार कर रहा है...' : 'AI analyzing best curriculum match...'}
            </span>
          </div>
          </motion.div>
        </div>
      )}

      {/* Main Selector */}
      <main className="relative" aria-labelledby="main-selector-heading">
        <h4 id="main-selector-heading" className="sr-only">Curriculum Standard Selector</h4>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {selectedStandard?.priority === 'primary' ? (
                <span className="text-lg">🇮🇳</span>
              ) : (
                <Globe className="w-5 h-5 text-blue-600" />
              )}
              {selectedStandard?.priority === 'primary' && (
                <Award className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">
                {selectedStandard ? getDisplayName(selectedStandard) : 
                 (language === 'hindi' ? 'पाठ्यक्रम मानक चुनें' : 'Select Curriculum Standard')}
              </div>
              {selectedStandard && (
                <div className="text-sm text-gray-600">
                  {getDisplayDescription(selectedStandard)}
                </div>
              )}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              {/* Indian Standards Section */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">🇮🇳</span>
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {language === 'hindi' ? 'भारतीय मानक (प्राथमिक)' : 'Indian Standards (Primary)'}
                  </span>
                </div>
                <div className="space-y-1">
                  {INDIAN_CURRICULUM_STANDARDS.map((standard) => {
                    const recommendation = recommendations.find(r => r.standard.id === standard.id);
                    
                    return (
                      <button
                        key={standard.id}
                        onClick={() => {
                          onSelectStandard(standard);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedStandard?.id === standard.id
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium text-gray-900">
                                {getDisplayName(standard)}
                              </div>
                              {recommendation && recommendation.priority === 'primary' && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {getDisplayDescription(standard)}
                            </div>
                            {recommendation && (
                              <div className="text-xs text-blue-600 mt-1">
                                {recommendation.confidence}% match • {recommendation.reasons[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* International Standards Section */}
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {language === 'hindi' ? 'अंतर्राष्ट्रीय मानक' : 'International Standards'}
                  </span>
                </div>
                <div className="space-y-1">
                  {INTERNATIONAL_STANDARDS.map((standard) => {
                    const recommendation = recommendations.find(r => r.standard.id === standard.id);
                    
                    return (
                      <button
                        key={standard.id}
                        onClick={() => {
                          onSelectStandard(standard);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedStandard?.id === standard.id
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium text-gray-900">
                                {getDisplayName(standard)}
                              </div>
                              {recommendation && recommendation.priority === 'primary' && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {getDisplayDescription(standard)}
                            </div>
                            {recommendation && (
                              <div className="text-xs text-blue-600 mt-1">
                                {recommendation.confidence}% match • {recommendation.reasons[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Context Information */}
      <footer className="p-3 bg-gray-50 rounded-lg" role="contentinfo" aria-label="Selection context information">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>
                {userLocation === 'india' ? (language === 'hindi' ? 'भारत' : 'India') : userLocation}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>
                {schoolType === 'government' ? (language === 'hindi' ? 'सरकारी स्कूल' : 'Government School') : 
                 schoolType === 'private' ? (language === 'hindi' ? 'निजी स्कूल' : 'Private School') : 
                 (language === 'hindi' ? 'अंतर्राष्ट्रीय स्कूल' : 'International School')}
              </span>
            </div>
            {gradeLevel && (
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>
                  {language === 'hindi' ? `कक्षा ${gradeLevel}` : `Class ${gradeLevel}`}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>
              {language === 'hindi' ? 'AI सुझाव सक्रिय' : 'AI recommendations active'}
            </span>
          </div>
        </div>
      </footer>

      {/* Top Recommendations Summary */}
      {showRecommendations && recommendations.length > 0 && !isAnalyzing && (
        <aside role="complementary" aria-labelledby="top-recommendations-heading">
          <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h4 id="top-recommendations-heading" className="font-semibold text-blue-900 mb-3">
            {language === 'hindi' ? '🎯 शीर्ष सुझाव' : '🎯 Top Recommendations'}
          </h4>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={rec.standard.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-blue-800 font-medium">
                    {getDisplayName(rec.standard)}
                  </span>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {rec.confidence}%
                </div>
              </div>
            ))}
          </div>
          </motion.div>
        </aside>
      )}
    </section>
  );
};