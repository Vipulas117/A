import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, CheckCircle, BookOpen, Users, Globe, FileText } from 'lucide-react';
import { CurriculumStandard } from '../utils/curriculumStandards';

interface ContentGap {
  standardId: string;
  subject: string;
  grade: string;
  missingTopics: string[];
  partiallyAlignedTopics: string[];
  recommendations: string[];
  alignmentScore: number;
}

interface GapAnalysisResult {
  overallAlignment: number;
  criticalGaps: string[];
  recommendations: string[];
  subjectBreakdown: Record<string, number>;
  gradeBreakdown: Record<string, number>;
}

interface CurriculumGapAnalysisProps {
  selectedStandard: CurriculumStandard;
  onClose: () => void;
  onImplementRecommendations: (recommendations: string[]) => void;
}

export const CurriculumGapAnalysis: React.FC<CurriculumGapAnalysisProps> = ({
  selectedStandard,
  onClose,
  onImplementRecommendations
}) => {
  const [analysisResult, setAnalysisResult] = useState<GapAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const subjects = ['mathematics', 'science', 'english', 'hindi', 'social-studies', 'art'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  useEffect(() => {
    runGapAnalysis();
  }, [selectedStandard, selectedSubject, selectedGrade]);

  const runGapAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate comprehensive analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results - in production, this would analyze actual content
    const mockResult: GapAnalysisResult = {
      overallAlignment: Math.floor(Math.random() * 30) + 70, // 70-100%
      criticalGaps: [
        'Hindi language integration in STEM subjects',
        'Cultural context examples in mathematics',
        'Assessment rubrics alignment with board standards',
        'Age-appropriate content complexity',
        'Interactive elements for classroom engagement'
      ],
      recommendations: [
        'Integrate Hindi terminology for all mathematical concepts',
        'Add Indian cultural examples in science experiments',
        'Align assessment questions with CBSE/NCERT patterns',
        'Include festival-based learning activities',
        'Develop teacher training materials for new content',
        'Create bilingual glossaries for technical terms',
        'Add regional language support for state boards',
        'Implement progressive difficulty levels'
      ],
      subjectBreakdown: {
        mathematics: 85,
        science: 78,
        english: 92,
        hindi: 65,
        'social-studies': 88,
        art: 75
      },
      gradeBreakdown: {
        '1-3': 90,
        '4-6': 82,
        '7-8': 75,
        '9-10': 68
      }
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const getAlignmentColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlignmentBg = (score: number): string => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 75) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

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
              <h2 className="text-2xl font-bold mb-2">Curriculum Gap Analysis</h2>
              <p className="text-blue-100">
                Analyzing alignment with {selectedStandard.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Class {grade}</option>
              ))}
            </select>
          </div>

          {isAnalyzing ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Analyzing curriculum alignment...</p>
            </div>
          ) : analysisResult && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`rounded-xl border p-6 text-center ${getAlignmentBg(analysisResult.overallAlignment)}`}>
                  <div className={`text-4xl font-bold mb-2 ${getAlignmentColor(analysisResult.overallAlignment)}`}>
                    {analysisResult.overallAlignment}%
                  </div>
                  <div className="text-gray-700 font-medium">Overall Alignment</div>
                </div>
                <div className="bg-orange-100 border border-orange-200 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {analysisResult.criticalGaps.length}
                  </div>
                  <div className="text-gray-700 font-medium">Critical Gaps</div>
                </div>
                <div className="bg-blue-100 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {analysisResult.recommendations.length}
                  </div>
                  <div className="text-gray-700 font-medium">Recommendations</div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Alignment</h3>
                <div className="space-y-4">
                  {Object.entries(analysisResult.subjectBreakdown).map(([subject, score]) => (
                    <div key={subject} className="flex items-center space-x-4">
                      <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                        {subject.replace('-', ' ')}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                        />
                      </div>
                      <div className={`text-sm font-bold w-12 ${getAlignmentColor(score)}`}>
                        {score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Gaps */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Critical Content Gaps
                </h3>
                <div className="space-y-3">
                  {analysisResult.criticalGaps.map((gap, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-red-800">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Implementation Recommendations
                </h3>
                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-green-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => onImplementRecommendations(analysisResult.recommendations)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Implement Recommendations
                </motion.button>
                <button
                  onClick={() => runGapAnalysis()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Re-analyze
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};