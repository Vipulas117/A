import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, AlertCircle, CheckCircle, Globe, Users } from 'lucide-react';
import { 
  INDIAN_CURRICULUM_STANDARDS, 
  INTERNATIONAL_STANDARDS, 
  analyzeCurriculumGaps, 
  generateAlignmentReport,
  CURRICULUM_QA_CHECKLIST 
} from '../utils/curriculumStandards';

interface CurriculumAlignmentDashboardProps {
  onClose: () => void;
}

export const CurriculumAlignmentDashboard: React.FC<CurriculumAlignmentDashboardProps> = ({
  onClose
}) => {
  const [selectedStandard, setSelectedStandard] = useState(INDIAN_CURRICULUM_STANDARDS[0]);
  const [alignmentData, setAlignmentData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'qa'>('overview');

  useEffect(() => {
    runAlignmentAnalysis();
  }, [selectedStandard]);

  const runAlignmentAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis - in production, this would analyze actual content
    const mockGaps = [
      analyzeCurriculumGaps([], selectedStandard, '5', 'mathematics'),
      analyzeCurriculumGaps([], selectedStandard, '8', 'science'),
      analyzeCurriculumGaps([], selectedStandard, '3', 'english')
    ];
    
    const report = generateAlignmentReport(mockGaps, selectedStandard);
    setAlignmentData(report);
    setIsAnalyzing(false);
  };

  const allStandards = [...INDIAN_CURRICULUM_STANDARDS, ...INTERNATIONAL_STANDARDS];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Curriculum Alignment Dashboard</h2>
              <p className="text-blue-100">Analyze and improve content alignment with educational standards</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Standards Selection */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Educational Standards</h3>
              
              {/* Indian Standards */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">🇮🇳</span>
                  Indian Standards (Primary)
                </h4>
                <div className="space-y-2">
                  {INDIAN_CURRICULUM_STANDARDS.map((standard) => (
                    <button
                      key={standard.id}
                      onClick={() => setSelectedStandard(standard)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedStandard.id === standard.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{standard.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{standard.nameHindi}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* International Standards */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  International Standards
                </h4>
                <div className="space-y-2">
                  {INTERNATIONAL_STANDARDS.map((standard) => (
                    <button
                      key={standard.id}
                      onClick={() => setSelectedStandard(standard)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedStandard.id === standard.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{standard.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{standard.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Target },
                  { id: 'gaps', label: 'Gap Analysis', icon: AlertCircle },
                  { id: 'qa', label: 'Quality Assurance', icon: CheckCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content based on active tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Selected Standard Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-2">
                          {selectedStandard.name}
                        </h3>
                        <p className="text-blue-700 mb-3">{selectedStandard.nameHindi}</p>
                        <p className="text-blue-800">{selectedStandard.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-blue-600 mb-1">Priority Level</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedStandard.priority === 'primary' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedStandard.priority.charAt(0).toUpperCase() + selectedStandard.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alignment Score */}
                  {alignmentData && !isAnalyzing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {alignmentData.overallScore}%
                        </div>
                        <div className="text-gray-600">Overall Alignment</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {alignmentData.criticalGaps.length}
                        </div>
                        <div className="text-gray-600">Critical Gaps</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {alignmentData.recommendations.length}
                        </div>
                        <div className="text-gray-600">Recommendations</div>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {isAnalyzing && (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-600">Analyzing curriculum alignment...</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gaps' && alignmentData && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-900 mb-4">Critical Content Gaps</h3>
                    <div className="space-y-3">
                      {alignmentData.criticalGaps.map((gap: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <span className="text-red-800">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-4">Recommended Actions</h3>
                    <div className="space-y-3">
                      {alignmentData.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-green-800">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-6">
                  {Object.entries(CURRICULUM_QA_CHECKLIST).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="space-y-3">
                        {items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                              defaultChecked={Math.random() > 0.3} // Mock some as checked
                            />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};