import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonContent, GlobalStyle, ClassLevel, Subject } from '../types';

const PROFESSIONAL_LESSON_PROMPT = `
You are ASman, an AI teaching assistant for Indian classrooms.

Create a comprehensive 500-word lesson pack for Class {classNumber} on "{topic}" in {subject}.
Make it professionally structured, culturally relevant to India, and audio-friendly.

IMPORTANT: Format as a well-structured lesson plan that can be read aloud by text-to-speech.

Structure your response as JSON:
{
  "lessonTitle": "Professional lesson title",
  "ageGroup": "Age range for this class",
  "duration": "Estimated lesson time (15-30 minutes)",
  
  "introduction": {
    "hook": "Engaging opening statement (50 words)",
    "objective": "What students will learn today"
  },
  
  "explanation": {
    "mainContent": "Detailed explanation in simple language (200 words)",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "examples": "Real-life Indian examples and analogies"
  },
  
  "interactiveSection": {
    "questions": [
      {
        "question": "Clear, simple question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Why this answer is correct"
      },
      {
        "question": "Second question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 1,
        "explanation": "Why this answer is correct"
      },
      {
        "question": "Third question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 2,
        "explanation": "Why this answer is correct"
      }
    ],
    "participation": "How students can participate actively"
  },
  
  "handsonActivity": {
    "title": "Activity name",
    "materials": "Simple materials available in Indian classrooms",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "timeNeeded": "5-10 minutes"
  },
  
  "globalMethod": {
    "style": "{globalStyle}",
    "application": "How this global teaching method enhances the lesson",
    "culturalBridge": "How it connects with Indian learning traditions"
  },
  
  "conclusion": {
    "summary": "Lesson recap (50 words)",
    "homework": "Simple take-home activity",
    "nextLesson": "What comes next in learning journey"
  },
  
  "languageSupport": {
    "hindiKeyTerms": {
      "term1": "hindi translation",
      "term2": "hindi translation",
      "term3": "hindi translation"
    },
    "pronunciationGuide": "Key Hindi words with pronunciation"
  },
  
  "teacherNotes": {
    "tips": "Teaching tips for better delivery",
    "commonMistakes": "What students often get wrong",
    "extensions": "For advanced students"
  }
}

WORD COUNT: Ensure total content is approximately 500 words.
AUDIO-FRIENDLY: Write in natural speech patterns with clear transitions.
CULTURAL CONTEXT: Include Indian examples, values, and learning traditions.
Age level: {ageRange}
Teaching style: {globalStyle}
`;

const GLOBAL_VERSION_PROMPT = `
You are ASman, creating an ENHANCED global lesson for Indian classrooms.

Build upon the Indian foundation with comprehensive international perspectives for Class {classNumber} on "{topic}" in {subject}.

Create an 800-word enhanced lesson pack with the same JSON structure but expanded content:

ENHANCED GLOBAL APPROACH:
- Cross-cultural examples from different countries (USA, UK, China, Japan, Singapore, Finland)
- Global best practices and international educational standards
- Real-world case studies from various cultures
- Comparative analysis showing different approaches worldwide
- International applications and connections
- How other countries teach the same concepts
- Global research findings and educational innovations

CONTENT REQUIREMENTS:
- Include specific examples from at least 4 different countries
- Reference international educational research
- Provide comparative analysis between Indian and global approaches
- Maintain relevance to Indian students while expanding global awareness
- Include practical ways to implement global best practices in Indian classrooms
- Showcase how the topic connects students to the wider world

Use the same JSON structure but with significantly expanded content in each section.
Age level: {ageRange}
Teaching style: {globalStyle}
`;

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private globalModel: any = null;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. Using demo mode.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      });
      this.globalModel = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 3072,
        }
      });
    } catch (error) {
      console.error('Error initializing Gemini:', error);
    }
  }

  async generateLesson(
    classLevel: ClassLevel,
    subject: Subject,
    topic: string,
    globalStyle: GlobalStyle,
    isGlobalVersion: boolean = false
  ): Promise<LessonContent> {
    const modelToUse = isGlobalVersion ? this.globalModel : this.model;
    
    if (!modelToUse) {
      return this.getDemoLesson(classLevel, subject, topic, globalStyle, isGlobalVersion);
    }

    try {
      const classNumber = classLevel.replace('class-', '');
      const ageRange = this.getAgeRange(classNumber);
      
      const promptTemplate = isGlobalVersion ? GLOBAL_VERSION_PROMPT : PROFESSIONAL_LESSON_PROMPT;
      const prompt = promptTemplate
        .replace(/{classNumber}/g, classNumber)
        .replace(/{topic}/g, topic)
        .replace(/{subject}/g, subject)
        .replace(/{globalStyle}/g, globalStyle)
        .replace(/{ageRange}/g, ageRange);

      const result = await modelToUse.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse JSON response
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      const lessonData = JSON.parse(cleanedText);
      
      // Convert to our LessonContent format
      return this.convertToLessonContent(lessonData, isGlobalVersion);
    } catch (error) {
      console.error('Error generating lesson:', error);
      return this.getDemoLesson(classLevel, subject, topic, globalStyle, isGlobalVersion);
    }
  }

  private convertToLessonContent(lessonData: any, isGlobalVersion: boolean): LessonContent {
    // Combine all content into a comprehensive explanation
    const fullExplanation = `
## ${lessonData.lessonTitle}
**Duration:** ${lessonData.duration} | **Age Group:** ${lessonData.ageGroup}

### 🎯 Learning Objective
${lessonData.introduction.objective}

### 📖 Lesson Introduction
${lessonData.introduction.hook}

### 📚 Main Content
${lessonData.explanation.mainContent}

#### Key Learning Points:
${lessonData.explanation.keyPoints.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n')}

#### Real-Life Examples
${lessonData.explanation.examples}

### 🎯 Hands-On Activity: ${lessonData.handsonActivity.title}
**Materials Needed:** ${lessonData.handsonActivity.materials}
**Time Required:** ${lessonData.handsonActivity.timeNeeded}

**Steps:**
${lessonData.handsonActivity.steps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')}

### 🌍 Global Teaching Method
**Style:** ${lessonData.globalMethod.style.charAt(0).toUpperCase() + lessonData.globalMethod.style.slice(1)}
${lessonData.globalMethod.application}

**Cultural Connection:** ${lessonData.globalMethod.culturalBridge}

### 📝 Lesson Summary
${lessonData.conclusion.summary}

**Take-Home Activity:** ${lessonData.conclusion.homework}
**Next Lesson Preview:** ${lessonData.conclusion.nextLesson}

### 👨‍🏫 Teacher Notes
**Teaching Tips:** ${lessonData.teacherNotes.tips}
**Common Student Mistakes:** ${lessonData.teacherNotes.commonMistakes}
**For Advanced Students:** ${lessonData.teacherNotes.extensions}

### 🗣️ Student Participation
${lessonData.interactiveSection.participation}
    `.trim();

    return {
      explanation: fullExplanation,
      questions: lessonData.interactiveSection.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation
      })),
      activity: `**${lessonData.handsonActivity.title}**\n\n**Materials:** ${lessonData.handsonActivity.materials}\n\n**Instructions:**\n${lessonData.handsonActivity.steps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')}`,
      globalMethod: lessonData.globalMethod.application,
      hindiTranslation: lessonData.languageSupport.hindiKeyTerms,
      isGlobalVersion,
      lessonData // Store full structured data for enhanced features
    };
  }

  async analyzeUpload(file: File, classLevel: ClassLevel, subject: Subject): Promise<string> {
    const classNumber = classLevel.replace('class-', '');
    
    if (!this.model) {
      return this.getDemoAnalysis(file, classNumber, subject);
    }

    try {
      let fileContent = '';
      let analysisPrompt = '';

      // Handle different file types
      if (file.type.startsWith('image/')) {
        // For images, we'll analyze based on filename and type
        analysisPrompt = `
Analyze this image file "${file.name}" for Class ${classNumber} ${subject} lessons in Indian schools.

Provide a detailed analysis including:
1. Educational potential and learning objectives
2. Age-appropriate activities that can be created
3. Curriculum alignment with Indian standards
4. Interactive classroom activities
5. Assessment questions that can be generated
6. Cultural relevance for Indian students
7. Integration with existing lesson plans

Be specific, practical, and encouraging for Indian teachers.
        `;
      } else if (file.type === 'text/plain') {
        // Read text content for analysis
        fileContent = await file.text();
        analysisPrompt = `
Analyze this text content for Class ${classNumber} ${subject} lessons in Indian schools:

Content: "${fileContent.substring(0, 1000)}..."

Provide detailed insights:
1. Key concepts that can be extracted for lessons
2. Age-appropriate simplification strategies
3. Interactive activities based on this content
4. Questions and assessments that can be created
5. Cultural connections to Indian context
6. Curriculum standard alignment
7. Practical classroom implementation tips

Be specific and actionable for Indian teachers.
        `;
      } else if (file.type.includes('pdf') || file.type.includes('word')) {
        analysisPrompt = `
Analyze this document "${file.name}" (${file.type}) for Class ${classNumber} ${subject} lessons.

Based on the document type and name, provide:
1. Likely educational content and learning objectives
2. Lesson plan suggestions for Indian classrooms
3. Interactive activities that can be developed
4. Assessment strategies
5. Cultural adaptation for Indian students
6. Technology integration possibilities
7. Teacher preparation recommendations

Focus on practical, implementable suggestions for Indian educators.
        `;
      } else if (file.type.startsWith('audio/')) {
        analysisPrompt = `
Analyze this audio file "${file.name}" for Class ${classNumber} ${subject} lessons.

Provide analysis for:
1. Audio-based learning activities
2. Listening comprehension exercises
3. Language development opportunities
4. Cultural and musical integration
5. Classroom presentation strategies
6. Student engagement techniques
7. Assessment through audio content

Focus on practical classroom implementation in Indian schools.
        `;
      }

      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      console.error('Error analyzing upload:', error);
      return this.getDemoAnalysis(file, classNumber, subject);
    }
  }

  private getDemoAnalysis(file: File, classNumber: string, subject: string): string {
    const fileType = file.type.includes('image') ? 'image' : 
                    file.type.includes('audio') ? 'audio' : 'document';
    
    const analysisMap = {
      image: `📸 **Image Analysis for Class ${classNumber} ${subject.charAt(0).toUpperCase() + subject.slice(1)}**

**Educational Potential:**
• Visual learning enhancement for ${subject} concepts
• Perfect for creating engaging classroom discussions
• Can be used for observation-based activities
• Supports visual learners in your classroom

**Suggested Activities:**
1. **Observation Exercise**: Students describe what they see and connect to ${subject} concepts
2. **Question Generation**: Create "What if?" scenarios based on the image
3. **Cultural Connection**: Relate image content to Indian context and daily life
4. **Creative Writing**: Use as inspiration for stories or explanations

**Assessment Ideas:**
• Ask students to identify ${subject}-related elements
• Create multiple-choice questions about the image content
• Use for vocabulary building exercises
• Develop critical thinking questions

**Implementation Tips:**
• Display on classroom projector or print for group work
• Encourage students to share their observations in both English and Hindi
• Connect to real-life examples from students' experiences
• Use for both individual and group activities`,

      audio: `🎵 **Audio Analysis for Class ${classNumber} ${subject.charAt(0).toUpperCase() + subject.slice(1)}**

**Educational Potential:**
• Excellent for auditory learners and listening skills
• Can enhance pronunciation and language development
• Perfect for creating immersive learning experiences
• Supports multi-sensory learning approach

**Suggested Activities:**
1. **Listening Comprehension**: Create questions about audio content
2. **Sound Identification**: Students identify and categorize sounds
3. **Cultural Integration**: Connect audio to Indian music, languages, or sounds
4. **Creative Response**: Students create stories or explanations based on audio

**Assessment Ideas:**
• Listening comprehension quizzes
• Audio-based vocabulary exercises
• Sound pattern recognition activities
• Cultural context discussions

**Implementation Tips:**
• Ensure good classroom acoustics for clear playback
• Provide transcripts for students with hearing difficulties
• Use audio in short segments for better attention
• Encourage active listening with note-taking`,

      document: `📄 **Document Analysis for Class ${classNumber} ${subject.charAt(0).toUpperCase() + subject.slice(1)}**

**Educational Potential:**
• Rich source material for comprehensive lesson development
• Can provide structured content for multiple class sessions
• Excellent for developing reading and comprehension skills
• Supports research and analytical thinking

**Suggested Activities:**
1. **Content Extraction**: Identify key concepts for lesson planning
2. **Comprehension Exercises**: Create reading activities with questions
3. **Summary Writing**: Students practice summarization skills
4. **Research Projects**: Use as starting point for deeper exploration

**Assessment Ideas:**
• Reading comprehension tests based on document content
• Vocabulary exercises from document text
• Critical analysis questions
• Application of concepts to real-world scenarios

**Implementation Tips:**
• Break content into age-appropriate segments
• Create visual aids to support text content
• Provide Hindi translations for key terms
• Use interactive reading strategies for engagement`
    };

    return analysisMap[fileType] + `

**Next Steps:**
✅ Use this analysis to create targeted lesson plans
✅ Develop interactive activities based on the content
✅ Create assessment materials aligned with curriculum
✅ Integrate with your existing teaching materials

**Cultural Integration:**
🇮🇳 Connect content to Indian festivals, traditions, and daily life
🗣️ Provide Hindi translations for key concepts
📚 Align with NCERT/CBSE curriculum standards
👥 Design for typical Indian classroom sizes and resources`;
  }

  private getAgeRange(classNumber: string): string {
    const ageMap: Record<string, string> = {
      '1': '6-7 years', '2': '7-8 years', '3': '8-9 years', '4': '9-10 years', '5': '10-11 years',
      '6': '11-12 years', '7': '12-13 years', '8': '13-14 years', '9': '14-15 years', '10': '15-16 years'
    };
    return ageMap[classNumber] || '6-16 years';
  }

  private getDemoLesson(
    classLevel: ClassLevel, 
    subject: Subject, 
    topic: string, 
    globalStyle: GlobalStyle,
    isGlobalVersion: boolean = false
  ): LessonContent {
    const classNumber = classLevel.replace('class-', '');
    const ageRange = this.getAgeRange(classNumber);
    
    const baseContent = isGlobalVersion ? 
      `## Enhanced Global Lesson: ${topic} for Class ${classNumber}
**Duration:** 25-30 minutes | **Age Group:** ${ageRange}

### 🎯 Learning Objective
Students will understand ${topic} through global perspectives and develop cross-cultural awareness while mastering core concepts.

### 📖 Lesson Introduction
Welcome to our exciting journey exploring ${topic}! Today we'll discover how students around the world learn about this fascinating subject.

### 📚 Main Content
${topic} is a fundamental concept that connects students globally. In India, we approach this topic with our rich educational traditions, while learning from international best practices.

#### Key Learning Points:
1. **Foundation Concepts**: Understanding the basics of ${topic} with Indian examples
2. **Global Connections**: How ${topic} is taught and applied worldwide
3. **Cultural Integration**: Connecting local knowledge with international perspectives
4. **Practical Applications**: Real-world uses in Indian and global contexts

#### International Examples
• **China**: Students learn ${topic} through systematic practice and repetition
• **Japan**: Emphasis on detailed observation and step-by-step methodology
• **USA**: Question-based exploration and hands-on discovery
• **Europe**: Creative expression and collaborative group activities
• **Singapore**: Integration of technology and traditional methods
• **Finland**: Student-centered approach with emphasis on understanding

### 🎯 Hands-On Activity: Global ${topic} Explorer
**Materials Needed:** Chart paper, colored pencils, world map, everyday objects
**Time Required:** 10-15 minutes

**Steps:**
1. Create a ${topic} chart showing Indian examples
2. Add international examples from different countries
3. Compare and contrast different approaches
4. Present findings to the class

### 🌍 Global Teaching Method
**Style:** ${globalStyle.charAt(0).toUpperCase() + globalStyle.slice(1)}
This international teaching approach enhances our lesson by bringing proven methods from around the world while respecting Indian educational values.

**Cultural Connection:** We honor our Indian learning traditions while embracing global best practices to give students the best of both worlds.

### 📝 Lesson Summary
Today we explored ${topic} through both Indian and international lenses, discovering how this concept connects us to students worldwide while building strong foundational knowledge.

**Take-Home Activity:** Research how ${topic} is used in one other country and share with the class tomorrow
**Next Lesson Preview:** We'll dive deeper into advanced applications of ${topic}

### 👨‍🏫 Teacher Notes
**Teaching Tips:** Use visual aids and encourage students to share their own cultural examples
**Common Student Mistakes:** Watch for confusion between local and global applications
**For Advanced Students:** Encourage research into international educational systems

### 🗣️ Student Participation
Students actively engage through questioning, group discussions, and hands-on exploration while connecting with global perspectives.` :
      
      `## ${topic} Lesson for Class ${classNumber}
**Duration:** 20-25 minutes | **Age Group:** ${ageRange}

### 🎯 Learning Objective
Students will understand the fundamentals of ${topic} and be able to apply this knowledge in their daily lives.

### 📖 Lesson Introduction
Welcome to our exciting lesson on ${topic}! This is a wonderful topic that will help you understand the world around you better.

### 📚 Main Content
${topic} is an important concept that we use every day. Let's explore it together using examples from our Indian culture and daily life.

#### Key Learning Points:
1. **Basic Understanding**: What ${topic} means and why it's important
2. **Indian Examples**: How we see ${topic} in our daily life in India
3. **Practical Uses**: Where and how we use ${topic}

#### Real-Life Examples
In India, we can see ${topic} everywhere - from our festivals to our daily routines. For example, during Diwali, we use mathematical concepts for rangoli patterns, or in cooking, we use measurements and proportions.

### 🎯 Hands-On Activity: Discover ${topic}
**Materials Needed:** Paper, pencils, everyday classroom objects
**Time Required:** 8-10 minutes

**Steps:**
1. Observe examples of ${topic} around the classroom
2. Work in pairs to identify more examples
3. Share discoveries with the class

### 🌍 Global Teaching Method
**Style:** ${globalStyle.charAt(0).toUpperCase() + globalStyle.slice(1)}
${this.getStyleDescription(globalStyle)} This approach helps students learn more effectively while respecting Indian educational values.

### 📝 Lesson Summary
Today we learned about ${topic} and discovered how it connects to our daily lives. Remember to look for examples of ${topic} around you!

**Take-Home Activity:** Find three examples of ${topic} at home and draw them
**Next Lesson Preview:** We'll explore more advanced concepts related to ${topic}

### 👨‍🏫 Teacher Notes
**Teaching Tips:** Use local examples and encourage student participation
**Common Student Mistakes:** Students may confuse basic concepts - provide clear examples
**For Advanced Students:** Encourage them to find more complex examples

### 🗣️ Student Participation
Students participate through observation, discussion, and hands-on activities that make learning fun and memorable.`;

    return {
      explanation: baseContent,
      questions: [
        {
          question: `What is the main concept we're learning about ${topic}?`,
          options: ['Basic understanding', 'Advanced concepts', 'Historical facts', 'Fun activities'],
          correct: 0,
          explanation: 'We start with basic understanding to build a strong foundation.'
        },
        {
          question: `How can we apply ${topic} in daily life?`,
          options: ['Only in school', 'At home and school', 'Never needed', 'Only for exams'],
          correct: 1,
          explanation: 'Learning is most effective when we can apply it both at home and school.'
        },
        {
          question: isGlobalVersion ? `How do students in other countries learn about ${topic}?` : `What makes ${topic} interesting to learn?`,
          options: isGlobalVersion ? ['Same as India', 'Different methods worldwide', 'Only in English', 'Not taught elsewhere'] : ['It\'s boring', 'It\'s challenging but fun', 'Too difficult', 'Not useful'],
          correct: isGlobalVersion ? 1 : 1,
          explanation: isGlobalVersion ? 'Different countries use various creative methods to teach the same concepts.' : 'Learning is most effective when it\'s both challenging and enjoyable.'
        }
      ],
      activity: `**Discover ${topic} Around Us**\n\n**Materials:** Chart paper, colored pencils, everyday objects\n\n**Instructions:**\n1. Look around the classroom for examples of ${topic}\n2. Work with a partner to create a list\n3. Draw your favorite example\n4. Share with the class and explain why you chose it\n\n**Learning Goal:** Connect classroom learning with real-world applications`,
      globalMethod: `**${globalStyle.charAt(0).toUpperCase() + globalStyle.slice(1)} Teaching Approach**\n\n${this.getStyleDescription(globalStyle)}\n\nThis method helps students learn more effectively by ${this.getStyleBenefit(globalStyle)}.`,
      hindiTranslation: {
        [topic]: `${topic} (विषय)`,
        'learning': 'सीखना',
        'students': 'छात्र',
        'activity': 'गतिविधि',
        'example': 'उदाहरण',
        ...(isGlobalVersion && {
          'global': 'वैश्विक',
          'international': 'अंतर्राष्ट्रीय',
          'culture': 'संस्कृति',
          'world': 'संसार'
        })
      },
      isGlobalVersion,
      lessonData: {
        lessonTitle: `${topic} for Class ${classNumber}`,
        ageGroup: ageRange,
        duration: isGlobalVersion ? '25-30 minutes' : '20-25 minutes'
      }
    };
  }

  private getStyleDescription(style: GlobalStyle): string {
    const descriptions = {
      chinese: 'Systematic practice with repetition for mastery. Students work through structured exercises to build strong foundations.',
      japanese: 'Disciplined, step-by-step approach with respect for process. Each step is carefully explained and practiced.',
      american: 'Question-based exploration that encourages curiosity. Students discover concepts through guided inquiry.',
      european: 'Creative expression through collaborative activities. Students learn through artistic and group-based methods.'
    };
    return descriptions[style];
  }

  private getStyleBenefit(style: GlobalStyle): string {
    const benefits = {
      chinese: 'building strong foundational skills through consistent practice',
      japanese: 'developing discipline and attention to detail in learning',
      american: 'encouraging critical thinking and natural curiosity',
      european: 'fostering creativity and collaborative learning skills'
    };
    return benefits[style];
  }
}

export const geminiService = new GeminiService();