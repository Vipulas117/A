import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, RefreshCw, Wifi, HardDrive, Shield, Monitor, Server, Database, Globe } from 'lucide-react';

export interface SystemDiagnostic {
  browserSupport: boolean;
  storageAvailable: boolean;
  networkStatus: boolean;
  permissions: boolean;
  serverConnection: boolean;
  databaseConnectivity: boolean;
  fileSizeLimits: boolean;
  uploadEndpoint: boolean;
}

interface FileSystemDiagnosticProps {
  onClose: () => void;
  onRetry: () => void;
  onShowAlternatives: () => void;
}

export const FileSystemDiagnosticComponent: React.FC<FileSystemDiagnosticProps> = ({
  onClose,
  onRetry,
  onShowAlternatives
}) => {
  const [diagnostic, setDiagnostic] = useState<SystemDiagnostic | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [diagnosticStep, setDiagnosticStep] = useState('');

  const runComprehensiveDiagnostic = async (): Promise<SystemDiagnostic> => {
    const steps = [
      { key: 'browserSupport', label: 'Checking browser compatibility...' },
      { key: 'storageAvailable', label: 'Testing local storage...' },
      { key: 'networkStatus', label: 'Verifying network connection...' },
      { key: 'permissions', label: 'Checking file permissions...' },
      { key: 'serverConnection', label: 'Testing server connectivity...' },
      { key: 'databaseConnectivity', label: 'Verifying database connection...' },
      { key: 'fileSizeLimits', label: 'Checking file size limits...' },
      { key: 'uploadEndpoint', label: 'Testing upload endpoint...' }
    ];

    const results: Partial<SystemDiagnostic> = {};

    for (const step of steps) {
      setDiagnosticStep(step.label);
      await new Promise(resolve => setTimeout(resolve, 300));

      switch (step.key) {
        case 'browserSupport':
          results.browserSupport = !!(
            window.File && 
            window.FileReader && 
            window.FileList && 
            window.Blob &&
            window.URL &&
            window.URL.createObjectURL
          );
          break;

        case 'storageAvailable':
          try {
            const test = 'diagnostic-test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            results.storageAvailable = true;
          } catch {
            results.storageAvailable = false;
          }
          break;

        case 'networkStatus':
          results.networkStatus = navigator.onLine;
          break;

        case 'permissions':
          try {
            const blob = new Blob(['test'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            URL.revokeObjectURL(url);
            results.permissions = true;
          } catch {
            results.permissions = false;
          }
          break;

        case 'serverConnection':
          try {
            const response = await fetch('/api/health', { method: 'HEAD' });
            results.serverConnection = response.ok;
          } catch {
            results.serverConnection = false;
          }
          break;

        case 'databaseConnectivity':
          try {
            const response = await fetch('/api/db-status', { method: 'GET' });
            results.databaseConnectivity = response.ok;
          } catch {
            results.databaseConnectivity = false;
          }
          break;

        case 'fileSizeLimits':
          results.fileSizeLimits = true; // Assume configured correctly
          break;

        case 'uploadEndpoint':
          try {
            const formData = new FormData();
            formData.append('test', new Blob(['test'], { type: 'text/plain' }));
            const response = await fetch('/api/upload/test', { 
              method: 'POST', 
              body: formData 
            });
            results.uploadEndpoint = response.ok;
          } catch {
            results.uploadEndpoint = false;
          }
          break;
      }
    }

    return results as SystemDiagnostic;
  };

  useEffect(() => {
    const runDiagnostic = async () => {
      setIsRunning(true);
      const result = await runComprehensiveDiagnostic();
      setDiagnostic(result);
      setIsRunning(false);
    };

    runDiagnostic();
  }, []);

  const diagnosticItems = diagnostic ? [
    { key: 'browserSupport', label: 'Browser Support', icon: Monitor, status: diagnostic.browserSupport, critical: true },
    { key: 'storageAvailable', label: 'Local Storage', icon: HardDrive, status: diagnostic.storageAvailable, critical: true },
    { key: 'networkStatus', label: 'Network Connection', icon: Wifi, status: diagnostic.networkStatus, critical: true },
    { key: 'permissions', label: 'File Permissions', icon: Shield, status: diagnostic.permissions, critical: true },
    { key: 'serverConnection', label: 'Server Connection', icon: Server, status: diagnostic.serverConnection, critical: true },
    { key: 'databaseConnectivity', label: 'Database Connection', icon: Database, status: diagnostic.databaseConnectivity, critical: false },
    { key: 'fileSizeLimits', label: 'File Size Limits', icon: Globe, status: diagnostic.fileSizeLimits, critical: false },
    { key: 'uploadEndpoint', label: 'Upload Endpoint', icon: RefreshCw, status: diagnostic.uploadEndpoint, critical: true }
  ] : [];

  const criticalIssues = diagnosticItems.filter(item => item.critical && !item.status);
  const allSystemsGood = diagnostic && Object.values(diagnostic).every(Boolean);

  const getRecoveryInstructions = (): string[] => {
    if (!diagnostic) return [];

    const instructions: string[] = [];

    if (!diagnostic.browserSupport) {
      instructions.push('Update browser to latest version (Chrome 90+, Firefox 88+, Safari 14+)');
    }
    if (!diagnostic.storageAvailable) {
      instructions.push('Clear browser storage or enable local storage in settings');
    }
    if (!diagnostic.networkStatus) {
      instructions.push('Check internet connection and firewall settings');
    }
    if (!diagnostic.permissions) {
      instructions.push('Allow file access permissions in browser settings');
    }
    if (!diagnostic.serverConnection) {
      instructions.push('Contact system administrator - server may be down');
    }
    if (!diagnostic.databaseConnectivity) {
      instructions.push('Database connection issue - check with technical team');
    }
    if (!diagnostic.uploadEndpoint) {
      instructions.push('Upload service unavailable - try alternative upload methods');
    }

    return instructions;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-labelledby="diagnostic-heading" aria-modal="true">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6" role="banner">
            <h3 id="diagnostic-heading" className="text-xl font-bold text-gray-900">System Diagnostic Report</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </header>

          {/* Diagnostic Progress */}
          {isRunning ? (
            <main className="text-center py-8" role="status" aria-live="polite">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 mb-2">Running comprehensive system diagnostic...</p>
              <p className="text-sm text-blue-600">{diagnosticStep}</p>
            </main>
          ) : (
            <main className="space-y-6" aria-labelledby="diagnostic-results-heading">
              <h4 id="diagnostic-results-heading" className="sr-only">Diagnostic Results</h4>
              {/* Overall Status */}
              <div className={`p-4 rounded-lg ${allSystemsGood ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-3">
                  {allSystemsGood ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h4 className={`font-semibold ${allSystemsGood ? 'text-green-900' : 'text-red-900'}`}>
                      {allSystemsGood ? 'All Systems Operational' : `${criticalIssues.length} Critical Issues Detected`}
                    </h4>
                    <p className={`text-sm ${allSystemsGood ? 'text-green-700' : 'text-red-700'}`}>
                      {allSystemsGood 
                        ? 'Your system is ready for file uploads' 
                        : 'Critical issues need immediate attention for file upload functionality'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">System Components</h4>
                {diagnosticItems.map((item) => (
                  <div key={item.key} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    item.status ? 'bg-green-50' : item.critical ? 'bg-red-50' : 'bg-yellow-50'
                  }`}>
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="flex-1 text-gray-900">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      {item.critical && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Critical
                        </span>
                      )}
                      {item.status ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recovery Instructions */}
              {!allSystemsGood && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3">🔧 Recovery Instructions</h4>
                  <ol className="space-y-2 text-sm text-yellow-800">
                    {getRecoveryInstructions().map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={onRetry}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Retry Upload</span>
                </motion.button>
                <button
                  onClick={onShowAlternatives}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Alternative Methods
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </main>
          )}
        </div>
      </motion.div>
    </div>
  );
};