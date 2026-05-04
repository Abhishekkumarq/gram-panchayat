// Shared status helper functions
// Used across multiple components for consistency

export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase();
  
  const colorMap = {
    approved: '#228b22',
    verified: '#228b22',
    accepted: '#228b22',
    success: '#228b22',
    
    rejected: '#d32f2f',
    denied: '#d32f2f',
    failed: '#d32f2f',
    
    pending: '#f57c00',
    waiting: '#f57c00',
    
    processing: '#003d7a',
    in_progress: '#003d7a',
    'in-progress': '#003d7a'
  };

  return colorMap[statusLower] || '#666';
};

export const getStatusIcon = (status) => {
  const statusLower = status?.toLowerCase();
  
  const iconMap = {
    approved: '✓',
    verified: '✓',
    accepted: '✓',
    success: '✓',
    
    rejected: '✕',
    denied: '✕',
    failed: '✕',
    
    pending: '⏱',
    waiting: '⏱',
    
    processing: '⌛',
    in_progress: '⌛',
    'in-progress': '⌛'
  };

  return iconMap[statusLower] || '?';
};

export const getStatusLabel = (status) => {
  const statusLower = status?.toLowerCase();
  
  const labelMap = {
    approved: 'Approved',
    verified: 'Verified',
    accepted: 'Accepted',
    rejected: 'Rejected',
    denied: 'Denied',
    pending: 'Pending',
    processing: 'Processing',
    in_progress: 'In Progress'
  };

  return labelMap[statusLower] || status;
};
