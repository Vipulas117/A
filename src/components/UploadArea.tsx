import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClassLevel, Subject } from '../types';

interface UploadAreaProps {
  onBack: () => void;
  onFileUpload: (files: File[]) => void;
  selectedClass?: ClassLevel | null;
  selectedSubject?: Subject | null;
  acceptedTypes?: string;
  maxFiles?: number;
  className?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onBack,
  onFileUpload,
  selectedClass,
  selectedSubject,
  acceptedTypes = ".pdf,.doc,.docx,.txt",
  maxFiles = 5,
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files].slice(0, maxFiles));
      onFileUpload(files);
    }
  }, [onFileUpload, maxFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files].slice(0, maxFiles));
      onFileUpload(files);
    }
  }, [onFileUpload, maxFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 ${className}`} role="main">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <nav className="flex items-center mb-8" role="navigation" aria-label="Breadcrumb navigation">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </nav>

        {/* Title */}
        <header className="text-center mb-12" role="banner">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Educational Content
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload images, documents, or audio files for AI analysis and lesson creation.
            </p>
          </motion.div>
        </header>

        {/* Upload Section */}
        <section role="region" aria-labelledby="upload-section-heading">
          <h2 id="upload-section-heading" className="sr-only">File Upload Area</h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              aria-label="File upload area - drag and drop files here or click to browse"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('file-upload')?.click();
                }
              }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports: {acceptedTypes.replace(/\./g, '').toUpperCase()}
                </p>
                <p className="text-xs text-gray-400">
                  Maximum {maxFiles} files, 10MB each
                </p>
              </div>
              <input
                type="file"
                multiple
                accept={acceptedTypes}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                aria-describedby="file-upload-description"
              />
              <p id="file-upload-description" className="sr-only">
                Upload educational files including images, documents, and audio for AI analysis
              </p>
              <label
                htmlFor="file-upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Choose Files
              </label>
            </div>
          </motion.div>
        </section>

        {uploadedFiles.length > 0 && (
          <section role="region" aria-labelledby="uploaded-files-heading">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 id="uploaded-files-heading" className="text-lg font-bold text-gray-900 mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="space-y-3" role="list" aria-label="List of uploaded files">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    role="listitem"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      aria-label={`Remove file ${file.name}`}
                    >
                      <X className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* Helper Information */}
        <aside role="complementary" aria-labelledby="upload-help-heading">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-blue-100 rounded-2xl p-6 max-w-3xl mx-auto text-center"
          >
            <h4 id="upload-help-heading" className="font-semibold text-blue-900 mb-2">
              💡 Upload Tips
            </h4>
            <p className="text-blue-800">
              ASman can analyze images for visual learning, documents for content extraction, 
              and audio files for listening activities. All content will be processed to create 
              engaging, curriculum-aligned lessons for your students.
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

        </div>
        <input
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Choose Files
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};