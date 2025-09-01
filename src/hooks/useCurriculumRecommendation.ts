import { useState, useEffect } from 'react';
import { CurriculumStandard, INDIAN_CURRICULUM_STANDARDS, INTERNATIONAL_STANDARDS } from '../utils/curriculumStandards';

interface UserContext {
  location: string;
  schoolType: 'government' | 'private' | 'international';
  language: 'english' | 'hindi';
  gradeLevel?: string;
  previousSelections?: string[];
  teachingExperience?: 'beginner' | 'intermediate' | 'expert';
  classSize?: 'small' | 'medium' | 'large';
  resourceAvailability?: 'limited' | 'moderate' | 'abundant';
}

interface RecommendationResult {
  standard: CurriculumStandard;
  confidence: number;
  reasons: string[];
  priority: 'primary' | 'secondary' | 'alternative';
  implementationComplexity: 'low' | 'medium' | 'high';
  expectedOutcomes: string[];
}

interface RecommendationAnalytics {
  totalRecommendations: number;
  averageConfidence: number;
  topCategory: string;
  userSatisfactionPrediction: number;
  implementationTimeEstimate: string;
}

export const useCurriculumRecommendation = (userContext: UserContext) => {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [analytics, setAnalytics] = useState<RecommendationAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<CurriculumStandard | null>(null);

  // Advanced recommendation engine with machine learning-like logic
  const generateRecommendations = async (context: UserContext): Promise<RecommendationResult[]> => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const allStandards = [...INDIAN_CURRICULUM_STANDARDS, ...INTERNATIONAL_STANDARDS];
    const results: RecommendationResult[] = [];

    for (const standard of allStandards) {
      const analysis = analyzeStandardFit(standard, context);
      if (analysis.confidence >= 30) { // Minimum threshold
        results.push(analysis);
      }
    }

    // Sort by confidence and priority
    results.sort((a, b) => {
      const priorityWeight = { primary: 100, secondary: 50, alternative: 10 };
      const aScore = a.confidence + priorityWeight[a.priority];
      const bScore = b.confidence + priorityWeight[b.priority];
      return bScore - aScore;
    });

    setIsAnalyzing(false);
    return results;
  };

  const analyzeStandardFit = (standard: CurriculumStandard, context: UserContext): RecommendationResult => {
    let confidence = 0;
    const reasons: string[] = [];
    let priority: 'primary' | 'secondary' | 'alternative' = 'alternative';
    let implementationComplexity: 'low' | 'medium' | 'high' = 'medium';
    const expectedOutcomes: string[] = [];

    // Geographic and cultural alignment (40% weight)
    if (context.location.toLowerCase().includes('india') || context.location === 'in') {
      if (standard.region === 'national') {
        confidence += 35;
        reasons.push('Designed specifically for Indian educational ecosystem');
        priority = 'primary';
        implementationComplexity = 'low';
        expectedOutcomes.push('Seamless integration with existing Indian school systems');
      } else {
        confidence += 15;
        reasons.push('Provides valuable international perspective');
        priority = 'secondary';
        implementationComplexity = 'high';
        expectedOutcomes.push('Enhanced global awareness for students');
      }
    } else {
      if (standard.region === 'international') {
        confidence += 30;
        reasons.push('International standard suitable for global schools');
        priority = 'primary';
      }
    }

    // School type alignment (25% weight)
    if (context.schoolType === 'government') {
      if (standard.id === 'ncert') {
        confidence += 25;
        reasons.push('NCERT is the official framework for government schools');
        expectedOutcomes.push('Direct alignment with government education policies');
      } else if (standard.id === 'cbse') {
        confidence += 15;
        reasons.push('CBSE builds upon NCERT foundation');
      }
    } else if (context.schoolType === 'private') {
      if (standard.id === 'cbse' || standard.id === 'icse') {
        confidence += 20;
        reasons.push('Widely adopted by private schools for board exam preparation');
        expectedOutcomes.push('Strong board exam performance');
      }
    } else if (context.schoolType === 'international') {
      if (standard.id === 'ib' || standard.id === 'cambridge') {
        confidence += 25;
        reasons.push('Internationally recognized for student mobility');
        implementationComplexity = 'high';
        expectedOutcomes.push('Global university admission advantages');
      }
    }

    // Language preference alignment (20% weight)
    if (context.language === 'hindi') {
      if (standard.region === 'national') {
        confidence += 20;
        reasons.push('Strong Hindi language support and cultural integration');
        expectedOutcomes.push('Better student comprehension in native language');
      }
    } else if (context.language === 'english') {
      if (standard.region === 'international') {
        confidence += 15;
        reasons.push('English-medium instruction with global perspective');
      }
    }

    // Grade level considerations (10% weight)
    if (context.gradeLevel) {
      const gradeNum = parseInt(context.gradeLevel);
      if (gradeNum <= 5 && standard.id === 'ncert') {
        confidence += 10;
        reasons.push('NCERT provides excellent foundation for primary education');
        expectedOutcomes.push('Strong conceptual foundation building');
      } else if (gradeNum >= 9 && (standard.id === 'cbse' || standard.id === 'icse')) {
        confidence += 10;
        reasons.push('Optimized for board exam preparation');
        expectedOutcomes.push('Enhanced board exam performance');
      }
    }

    // Teaching experience factor (5% weight)
    if (context.teachingExperience === 'beginner' && standard.id === 'ncert') {
      confidence += 5;
      reasons.push('NCERT provides comprehensive teacher support materials');
      implementationComplexity = 'low';
    } else if (context.teachingExperience === 'expert' && standard.region === 'international') {
      confidence += 5;
      reasons.push('International standards offer advanced pedagogical approaches');
    }

    // Resource availability factor
    if (context.resourceAvailability === 'limited' && standard.region === 'national') {
      confidence += 5;
      reasons.push('Designed for diverse resource environments in India');
      implementationComplexity = 'low';
    } else if (context.resourceAvailability === 'abundant' && standard.region === 'international') {
      confidence += 5;
      reasons.push('Can leverage advanced resources for international curriculum');
    }

    return {
      standard,
      confidence: Math.min(confidence, 100),
      reasons,
      priority,
      implementationComplexity,
      expectedOutcomes
    };
  };

  const generateAnalytics = (recommendations: RecommendationResult[]): RecommendationAnalytics => {
    const totalRecommendations = recommendations.length;
    const averageConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / totalRecommendations;
    
    const categoryCount = recommendations.reduce((acc, rec) => {
      const category = rec.standard.region === 'national' ? 'Indian' : 'International';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryCount).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    const userSatisfactionPrediction = Math.min(averageConfidence + 10, 95);
    
    const implementationTimeEstimate = recommendations[0]?.implementationComplexity === 'low' ? '1-2 weeks' :
                                     recommendations[0]?.implementationComplexity === 'medium' ? '3-4 weeks' : '6-8 weeks';

    return {
      totalRecommendations,
      averageConfidence,
      topCategory,
      userSatisfactionPrediction,
      implementationTimeEstimate
    };
  };

  useEffect(() => {
    const runAnalysis = async () => {
      const results = await generateRecommendations(userContext);
      setRecommendations(results);
      setAnalytics(generateAnalytics(results));
      
      // Auto-select top recommendation
      if (results.length > 0 && !selectedStandard) {
        setSelectedStandard(results[0].standard);
      }
    };

    runAnalysis();
  }, [userContext]);

  const selectStandard = (standard: CurriculumStandard) => {
    setSelectedStandard(standard);
  };

  const getRecommendationReasoning = (standardId: string): string[] => {
    const recommendation = recommendations.find(r => r.standard.id === standardId);
    return recommendation?.reasons || [];
  };

  const getImplementationGuidance = (standardId: string): {
    complexity: string;
    timeEstimate: string;
    steps: string[];
    resources: string[];
  } => {
    const recommendation = recommendations.find(r => r.standard.id === standardId);
    
    if (!recommendation) {
      return {
        complexity: 'Unknown',
        timeEstimate: 'Not available',
        steps: [],
        resources: []
      };
    }

    const complexityMap = {
      low: 'Low - Minimal changes required',
      medium: 'Medium - Moderate integration effort',
      high: 'High - Significant restructuring needed'
    };

    const timeMap = {
      low: '1-2 weeks',
      medium: '3-4 weeks', 
      high: '6-8 weeks'
    };

    const stepMap = {
      low: [
        'Update content templates with new standard requirements',
        'Train teachers on new curriculum elements',
        'Implement gradual rollout across classes'
      ],
      medium: [
        'Conduct comprehensive content audit',
        'Develop new assessment frameworks',
        'Create teacher training programs',
        'Implement phased rollout with feedback collection'
      ],
      high: [
        'Complete curriculum restructuring',
        'Develop new content from scratch',
        'Extensive teacher retraining programs',
        'Pilot testing with select schools',
        'Full implementation with ongoing support'
      ]
    };

    const resourceMap = {
      low: ['Existing teaching materials', 'Basic training sessions', 'Online documentation'],
      medium: ['New curriculum guides', 'Teacher workshops', 'Assessment tools', 'Student materials'],
      high: ['Complete curriculum overhaul', 'Extensive training programs', 'New technology platforms', 'Ongoing support systems']
    };

    return {
      complexity: complexityMap[recommendation.implementationComplexity],
      timeEstimate: timeMap[recommendation.implementationComplexity],
      steps: stepMap[recommendation.implementationComplexity],
      resources: resourceMap[recommendation.implementationComplexity]
    };
  };

  return {
    recommendations,
    analytics,
    isAnalyzing,
    selectedStandard,
    selectStandard,
    getRecommendationReasoning,
    getImplementationGuidance,
    refreshRecommendations: () => generateRecommendations(userContext)
  };
};