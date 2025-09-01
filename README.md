# ASman Learning - AI Teaching Assistant

A production-ready AI-powered teaching assistant designed specifically for Indian classrooms. ASman helps teachers create engaging, culturally-relevant lessons using global teaching methodologies.

## 🌟 Features

### Core Functionality
- **No Login Required**: Instant access for teachers
- **Class-Based Learning**: Supports Classes 1-10 with age-appropriate content
- **Multi-Subject Support**: Mathematics, Science, English, Hindi, Social Studies, and Art
- **Global Teaching Styles**: Choose from Chinese, Japanese, American, or European methodologies
- **File Upload & Analysis**: Support for images, documents, and voice notes
- **Bilingual Support**: English ↔ Hindi translation for key terms

### AI-Powered Features
- **Google Gemini Integration**: Advanced AI lesson generation
- **Cultural Context**: Indian curriculum alignment and cultural examples
- **Interactive Content**: Automatic generation of questions, activities, and assessments
- **Adaptive Difficulty**: Content automatically adjusted for class level

### User Experience
- **Responsive Design**: Optimized for phones, tablets, and smartboards
- **Session Management**: Chat history with easy resume functionality
- **Teacher Controls**: Play/pause, language toggle, style switching
- **Beautiful UI**: Apple-level design aesthetics with smooth animations

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your Google Gemini API key to .env
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Google Gemini API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP (max 10MB)
- **Documents**: PDF, Word, Text files (max 10MB)
- **Audio**: MP3, WAV, WebM (max 10MB)

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Dashboard.tsx          # Main landing page
│   ├── ChatSidebar.tsx        # Session history management
│   ├── ClassSelection.tsx     # Class 1-10 selection grid
│   ├── SubjectSelection.tsx   # 6 subject cards
│   ├── TopicInput.tsx         # Topic entry with suggestions
│   ├── GlobalStyleSelector.tsx # Teaching methodology selector
│   ├── UploadArea.tsx         # File upload with drag-drop
│   ├── LessonPlayer.tsx       # Main lesson presentation
│   ├── LoadingScreen.tsx      # AI generation loading state
│   ├── ErrorScreen.tsx        # Error handling and recovery
│   └── ASmanCharacter.tsx     # Brand mascot component
├── hooks/
│   ├── useChatSessions.ts     # Session state management
│   ├── useGemini.ts          # AI integration
│   └── useFileUpload.ts      # File handling logic
├── utils/
│   ├── gemini.ts             # Gemini API configuration
│   ├── constants.ts          # App-wide constants
│   └── helpers.ts            # Utility functions
└── types/
    └── index.ts              # TypeScript definitions
```

### State Management
- **Session-based**: In-memory chat history during browser session
- **React Hooks**: useState, useEffect for local state
- **Context-free**: No global state management needed for MVP

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (#1E3A8A) to Sky Blue (#0EA5E9)
- **Secondary**: Warm Gold (#F59E0B) for accents
- **Subject Colors**: Unique colors for each subject area
- **Semantic**: Success (Green), Warning (Yellow), Error (Red)

### Typography
- **Headings**: Poppins (Indian education preference)
- **Body**: Inter (excellent readability)
- **Hindi**: Noto Sans Devanagari support
- **Responsive**: 14px mobile, 16px desktop base

### Responsive Breakpoints
- **Mobile**: 320px-768px (teacher's phone)
- **Tablet**: 768px-1024px (classroom tablet)  
- **Desktop**: 1024px+ (smartboard, TV display)

## 🧪 Teaching Methodologies

### Chinese Style (中国方式)
- **Focus**: Repetitive practice and mastery
- **Approach**: Structured drills and systematic progression
- **Best For**: Mathematics, foundational skills

### Japanese Style (日本の方法)
- **Focus**: Discipline and structured learning
- **Approach**: Step-by-step methodology with respect for process
- **Best For**: Science experiments, detailed procedures

### American Style (American Method)
- **Focus**: Curiosity-driven exploration
- **Approach**: Question-based learning and discovery
- **Best For**: English, creative subjects

### European Style (European Approach)
- **Focus**: Creativity and collaboration
- **Approach**: Artistic expression and group activities
- **Best For**: Art, social studies, creative writing

## 📱 Usage Guide

### For Teachers
1. **Start**: Click "New Chat" from dashboard
2. **Select**: Choose your class (1-10) and subject
3. **Specify**: Enter the topic you want to teach
4. **Choose**: Pick a global teaching style
5. **Teach**: Use the interactive lesson player in your classroom

### For Content Upload
1. **Access**: Click "Upload Content" from dashboard
2. **Upload**: Drag-drop or browse for files
3. **Analyze**: Let ASman analyze your content
4. **Integrate**: Use insights for lesson creation

## 🔒 Privacy & Security

- **No User Data**: No login or personal information required
- **Session-Only**: Chat history stored locally during session
- **File Safety**: Uploaded files processed securely
- **API Security**: Gemini API calls use environment variables

## 🌍 Cultural Considerations

### Indian Context Integration
- **Curriculum Alignment**: Follows Indian education standards
- **Cultural Examples**: Uses familiar references (cricket, festivals, Bollywood)
- **Language Support**: Bilingual English-Hindi interface
- **Age Appropriateness**: Content calibrated for Indian classroom norms

### Global Perspective
- **International Methods**: Learn from worldwide teaching excellence
- **Cultural Sensitivity**: Respectful representation of different approaches
- **Adaptable Content**: Flexible methodology application

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_GEMINI_API_KEY=your_production_api_key
VITE_APP_TITLE=ASman Learning
```

## 🤝 Contributing

ASman Learning is designed to grow with the Indian education community. Future enhancements may include:

- **Offline Mode**: Local lesson caching
- **Multi-language**: Support for regional Indian languages
- **Assessment Tools**: Built-in quiz and test generation
- **Teacher Analytics**: Lesson effectiveness tracking
- **Student Interaction**: Direct student engagement features

## 📄 License

Built for Indian educators with ❤️ by the ASman Learning team.

---

**Ready to transform your classroom?** Start creating amazing lessons with ASman today!