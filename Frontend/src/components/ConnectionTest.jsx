import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendData, setBackendData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setBackendStatus('checking');
      setError(null);
      
      // Test the health endpoint
      const response = await api.get('/health');
      setBackendData(response);
      setBackendStatus('connected');
      
      console.log('✅ Backend connection successful:', response);
    } catch (err) {
      console.error('❌ Backend connection failed:', err);
      setBackendStatus('failed');
      setError(err.message || 'Failed to connect to backend');
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return '✅ Connected';
      case 'failed': return '❌ Failed';
      default: return '🔄 Checking...';
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Status</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Backend URL:</span>
          <span className="text-sm text-gray-800">
            {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
          </span>
        </div>
        
        {backendData && (
          <div className="mt-4 p-3 bg-green-50 rounded border">
            <h4 className="font-medium text-green-800 mb-2">Response Data:</h4>
            <pre className="text-xs text-green-700 overflow-auto">
              {JSON.stringify(backendData, null, 2)}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded border">
            <h4 className="font-medium text-red-800 mb-2">Error:</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <button
          onClick={testConnection}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Test Connection Again
        </button>
      </div>
    </div>
  );
};

export default ConnectionTest;
