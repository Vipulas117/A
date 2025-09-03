import React from 'react';
import { Upload, FileText, Image, Music, X } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  onAnalysisComplete: (analysis: string) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, onAnalysisComplete }) => {
  const {
    isDragOver,
    uploadedFiles,
    isUploading,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    clearError
  } = useFileUpload({ onFileSelect, onAnalysisComplete });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    if (type.startsWith('audio/')) return <Music className="w-8 h-8 text-green-500" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  return (
    <section role="region" aria-labelledby="upload-heading" className="w-full max-w-2xl mx-auto">
      <h2 id="upload-heading" className="sr-only">File Upload Area</h2>
      
      {error && (
        <div 
          role="alert" 
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          aria-live="polite"
        >
          <p className="text-red-700">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 underline"
            aria-label="Dismiss error message"
          >
            Dismiss
          </button>
        </div>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-indigo-400 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="File upload area. Drag and drop files here or click to select files."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('file-input')?.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-describedby="upload-instructions"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${isDragOver ? 'text-indigo-500' : 'text-gray-400'}`} />
          </div>
          
          <div id="upload-instructions">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Educational Content
            </h3>
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports images, audio files, PDFs, and documents
            </p>
          </div>

          {isUploading && (
            <div role="status" aria-live="polite" className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="text-sm text-gray-600">Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6" role="region" aria-labelledby="uploaded-files-heading">
          <h3 id="uploaded-files-heading" className="text-lg font-medium text-gray-900 mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                role="listitem"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};