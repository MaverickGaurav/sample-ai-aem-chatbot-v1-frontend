// frontend/src/utils/helpers.js
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getGradeColor(grade) {
  const colors = {
    'A': 'bg-green-500',
    'B': 'bg-blue-500',
    'C': 'bg-yellow-500',
    'D': 'bg-orange-500',
    'F': 'bg-red-500'
  };
  return colors[grade] || 'bg-gray-500';
}

export function calculateOverallStats(results) {
  if (!results || results.length === 0) {
    return {
      averageScore: 0,
      totalIssues: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    };
  }

  const totalScore = results.reduce((sum, r) => sum + r.overall_score, 0);
  const totalIssues = results.reduce((sum, r) => sum + r.total_issues, 0);
  const highPriority = results.reduce((sum, r) => sum + r.high_priority_issues, 0);
  const mediumPriority = results.reduce((sum, r) => sum + r.medium_priority_issues, 0);
  const lowPriority = results.reduce((sum, r) => sum + r.low_priority_issues, 0);

  return {
    averageScore: (totalScore / results.length).toFixed(2),
    totalIssues,
    highPriority,
    mediumPriority,
    lowPriority
  };
}
