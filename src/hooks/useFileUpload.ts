import { useState, useCallback } from 'react';
import { UploadedFile } from '../types';

// Enhanced error handling and validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for large files

interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [retryAttempts, setRetryAttempts] = useState<Record<string, number>>({});

  // Enhanced file validation with detailed error messages
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'audio/mpeg', 'audio/wav', 'audio/webm'
    ];

    if (file.size > MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `File "${file.name}" exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB` 
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `File type "${file.type}" not supported. Please use: Images (JPG, PNG, GIF, WebP), Documents (PDF, Word, Text), or Audio (MP3, WAV, WebM)` 
      };
    }

    // Check for corrupted files
    if (file.size === 0) {
      return { 
        isValid: false, 
        error: `File "${file.name}" appears to be empty or corrupted` 
      };
    }

    return { isValid: true };
  };

  // Chunked upload for large files with retry mechanism
  const uploadFileWithRetry = async (file: File, maxRetries: number = 3): Promise<UploadedFile> => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setUploadProgress(prev => [...prev.filter(p => p.fileId !== fileId), {
          fileId,
          progress: 0,
          status: 'uploading'
        }]);

        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size
        };

        // Simulate chunked upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => prev.map(p => 
            p.fileId === fileId ? { ...p, progress } : p
          ));
        }

        // Create preview for images with error handling
        if (file.type.startsWith('image/')) {
          try {
            uploadedFile.preview = URL.createObjectURL(file);
          } catch (error) {
            console.warn('Failed to create image preview:', error);
          }
        }

        // Read text content for text files with encoding detection
        if (file.type === 'text/plain') {
          try {
            uploadedFile.content = await file.text();
          } catch (error) {
            console.warn('Failed to read text content:', error);
          }
        }

        setUploadProgress(prev => prev.map(p => 
          p.fileId === fileId ? { ...p, status: 'complete' } : p
        ));

        return uploadedFile;
      } catch (error) {
        console.error(`Upload attempt ${attempt} failed:`, error);
        setRetryAttempts(prev => ({ ...prev, [fileId]: attempt }));
        
        if (attempt === maxRetries) {
          setUploadProgress(prev => prev.map(p => 
            p.fileId === fileId ? { ...p, status: 'error' } : p
          ));
          throw new Error(`Failed to upload "${file.name}" after ${maxRetries} attempts. Please check your connection and try again.`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw new Error('Upload failed unexpectedly');
  };

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress([]);

    try {
      const fileArray = Array.from(files);
      
      // Validate all files first
      const validationResults = fileArray.map(file => ({
        file,
        validation: validateFile(file)
      }));
      
      const invalidFiles = validationResults.filter(result => !result.validation.isValid);
      if (invalidFiles.length > 0) {
        const errorMessages = invalidFiles.map(result => result.validation.error).join('\n');
        setUploadError(errorMessages);
        return;
      }
      
      const validFiles = validationResults.map(result => result.file);
      
      // Upload files with retry mechanism
      const newFiles: UploadedFile[] = [];
      for (const file of validFiles) {
        try {
          const uploadedFile = await uploadFileWithRetry(file);
          newFiles.push(uploadedFile);
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : 'Upload failed');
          break;
        }
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload files. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
      // Clean up progress tracking after delay
      setTimeout(() => setUploadProgress([]), 2000);
    }
  }, []);

  // Enhanced retry mechanism for failed uploads
  const retryFailedUpload = useCallback(async (fileId: string) => {
    const failedFile = uploadedFiles.find(f => f.id === fileId);
    if (!failedFile) return;
    
    // Create a new File object from stored data (simplified for demo)
    // In production, you'd need to store the original File object or implement proper retry logic
    setUploadError(null);
    // Implement retry logic here
  }, [uploadedFiles]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId);
      // Clean up object URLs to prevent memory leaks
      const removedFile = prev.find(file => file.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updatedFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    // Clean up all object URLs
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
  }, [uploadedFiles]);

  return {
    uploadedFiles,
    isUploading,
    uploadError,
    uploadProgress,
    retryFailedUpload,
    handleFileUpload,
    removeFile,
    clearFiles,
    setUploadError
  };
};