// Comprehensive file validation and error handling utilities

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export interface FileSystemDiagnostic {
  browserSupport: boolean;
  storageAvailable: boolean;
  networkStatus: boolean;
  permissions: boolean;
}

// Enhanced file validation with Indian context
export const validateEducationalFile = (file: File): FileValidationResult => {
  const warnings: string[] = [];
  
  // Basic validation
  const basicValidation = validateBasicFile(file);
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  // Educational content specific validation
  if (file.type.startsWith('image/')) {
    // Check for educational appropriateness
    if (file.name.toLowerCase().includes('inappropriate')) {
      return { isValid: false, error: 'File name suggests inappropriate content for educational use' };
    }
    
    // Warn about very large images
    if (file.size > 5 * 1024 * 1024) {
      warnings.push('Large image files may take longer to process in classroom settings');
    }
  }
  
  // Document validation
  if (file.type.includes('pdf') || file.type.includes('word')) {
    if (file.size > 8 * 1024 * 1024) {
      warnings.push('Large documents may be difficult to process on mobile devices commonly used in Indian schools');
    }
  }
  
  // Audio validation for Indian classroom context
  if (file.type.startsWith('audio/')) {
    if (file.size > 15 * 1024 * 1024) {
      return { isValid: false, error: 'Audio files over 15MB may not work well in low-bandwidth school environments' };
    }
    warnings.push('Ensure audio is clear and appropriate for classroom playback');
  }
  
  return { isValid: true, warnings };
};

const validateBasicFile = (file: File): FileValidationResult => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'audio/mpeg', 'audio/wav', 'audio/webm'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size === 0) {
    return { isValid: false, error: 'File appears to be empty or corrupted' };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds 10MB limit` 
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type "${file.type}" not supported` 
    };
  }
  
  return { isValid: true };
};

// System diagnostic functions
export const runFileSystemDiagnostic = (): FileSystemDiagnostic => {
  return {
    browserSupport: checkBrowserSupport(),
    storageAvailable: checkStorageAvailability(),
    networkStatus: navigator.onLine,
    permissions: checkFilePermissions()
  };
};

const checkBrowserSupport = (): boolean => {
  return !!(
    window.File && 
    window.FileReader && 
    window.FileList && 
    window.Blob &&
    window.URL &&
    window.URL.createObjectURL
  );
};

const checkStorageAvailability = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

const checkFilePermissions = (): boolean => {
  // Check if we can create object URLs (basic file handling permission)
  try {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
};

// Recovery and troubleshooting utilities
export const getRecoveryInstructions = (diagnostic: FileSystemDiagnostic): string[] => {
  const instructions: string[] = [];
  
  if (!diagnostic.browserSupport) {
    instructions.push('Update your browser to the latest version for full file upload support');
  }
  
  if (!diagnostic.storageAvailable) {
    instructions.push('Clear browser storage or enable local storage in browser settings');
  }
  
  if (!diagnostic.networkStatus) {
    instructions.push('Check your internet connection and try again');
  }
  
  if (!diagnostic.permissions) {
    instructions.push('Allow file access permissions in your browser settings');
  }
  
  if (instructions.length === 0) {
    instructions.push('Try refreshing the page and uploading again');
    instructions.push('If issues persist, try uploading one file at a time');
    instructions.push('Contact technical support if problems continue');
  }
  
  return instructions;
};

// Alternative upload methods for fallback
export const getAlternativeUploadMethods = (): Array<{
  method: string;
  description: string;
  instructions: string[];
}> => {
  return [
    {
      method: 'Single File Upload',
      description: 'Upload files one at a time to avoid conflicts',
      instructions: [
        'Select only one file at a time',
        'Wait for each upload to complete before adding the next',
        'This method works better on slower connections'
      ]
    },
    {
      method: 'Reduced File Size',
      description: 'Compress files before uploading',
      instructions: [
        'For images: Use online compression tools to reduce file size',
        'For documents: Save as PDF with reduced quality',
        'For audio: Use MP3 format with lower bitrate'
      ]
    },
    {
      method: 'Browser Reset',
      description: 'Clear browser data and try again',
      instructions: [
        'Clear browser cache and cookies',
        'Disable browser extensions temporarily',
        'Try using an incognito/private browsing window'
      ]
    }
  ];
};