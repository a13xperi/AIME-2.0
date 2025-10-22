import React, { useState, useEffect } from 'react';
import { Project, Session, ExportOptions } from '../../types';
import './DataExport.css';

interface DataExportProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const DataExport: React.FC<DataExportProps> = ({
  projects,
  sessions,
  onClose
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCharts: false,
    includeImages: false,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    filters: {}
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<{
    projects: boolean;
    sessions: boolean;
    analytics: boolean;
  }>({
    projects: true,
    sessions: true,
    analytics: false
  });

  // Mock export history
  useEffect(() => {
    const mockHistory = [
      {
        id: 'export-1',
        name: 'Projects & Sessions Export',
        format: 'csv',
        exportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        recordCount: 45,
        fileSize: 125000
      },
      {
        id: 'export-2',
        name: 'Analytics Data Export',
        format: 'json',
        exportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        recordCount: 23,
        fileSize: 89000
      }
    ];
    setExportHistory(mockHistory);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const exportData = {
        projects: selectedData.projects ? projects.filter(p => 
          new Date(p.lastUpdated) >= new Date(exportOptions.dateRange.start) &&
          new Date(p.lastUpdated) <= new Date(exportOptions.dateRange.end)
        ) : [],
        sessions: selectedData.sessions ? sessions.filter(s => 
          new Date(s.date) >= new Date(exportOptions.dateRange.start) &&
          new Date(s.date) <= new Date(exportOptions.dateRange.end)
        ) : [],
        analytics: selectedData.analytics ? {
          totalProjects: projects.length,
          totalSessions: sessions.length,
          averageSessionDuration: sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / sessions.length,
          mostActiveCategory: 'Development'
        } : null
      };

      // Create and download file
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (exportOptions.format) {
        case 'csv':
          content = convertToCSV(exportData);
          filename = `agent-alex-export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          filename = `agent-alex-export-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        case 'excel':
          // For Excel, we'll create a CSV that can be opened in Excel
          content = convertToCSV(exportData);
          filename = `agent-alex-export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'pdf':
          // For PDF, we'll create a simple text representation
          content = convertToText(exportData);
          filename = `agent-alex-export-${new Date().toISOString().split('T')[0]}.txt`;
          mimeType = 'text/plain';
          break;
      }

      downloadFile(content, filename, mimeType);
      
      // Add to history
      const newExport = {
        id: `export-${Date.now()}`,
        name: `Data Export - ${new Date().toLocaleDateString()}`,
        format: exportOptions.format,
        exportedAt: new Date().toISOString(),
        recordCount: (exportData.projects?.length || 0) + (exportData.sessions?.length || 0),
        fileSize: new Blob([content]).size
      };
      
      setExportHistory(prev => [newExport, ...prev]);
      setIsExporting(false);
    }, 2000);
  };

  const convertToCSV = (data: any) => {
    let csv = '';
    
    if (data.projects && data.projects.length > 0) {
      csv += 'PROJECTS\n';
      csv += 'ID,Name,Description,Category,Status,Priority,Created At,Updated At\n';
      data.projects.forEach((project: Project) => {
        csv += `"${project.id}","${project.name}","${project.description || ''}","${project.type || ''}","${project.status || ''}","${project.priority || ''}","${project.lastUpdated}","${project.lastUpdated}"\n`;
      });
      csv += '\n';
    }
    
    if (data.sessions && data.sessions.length > 0) {
      csv += 'SESSIONS\n';
      csv += 'ID,Title,Date,Duration,Project,Status,Summary,AI Agent,Workspace\n';
      data.sessions.forEach((session: Session) => {
        csv += `"${session.id}","${session.title}","${session.date}","${session.duration || 0}","${session.projectName || ''}","${session.status || ''}","${(session.summary || '').replace(/"/g, '""')}","${session.aiAgent || ''}","${session.workspace || ''}"\n`;
      });
      csv += '\n';
    }
    
    if (data.analytics) {
      csv += 'ANALYTICS\n';
      csv += 'Metric,Value\n';
      csv += `"Total Projects","${data.analytics.totalProjects}"\n`;
      csv += `"Total Sessions","${data.analytics.totalSessions}"\n`;
      csv += `"Average Session Duration","${data.analytics.averageSessionDuration.toFixed(2)} minutes"\n`;
      csv += `"Most Active Category","${data.analytics.mostActiveCategory}"\n`;
    }
    
    return csv;
  };

  const convertToText = (data: any) => {
    let text = 'AGENT ALEX DATA EXPORT\n';
    text += '='.repeat(50) + '\n\n';
    
    if (data.projects && data.projects.length > 0) {
      text += 'PROJECTS\n';
      text += '-'.repeat(20) + '\n';
      data.projects.forEach((project: Project) => {
        text += `• ${project.name} (${project.type || 'No type'})\n`;
        text += `  Status: ${project.status || 'Unknown'}\n`;
        text += `  Priority: ${project.priority || 'Unknown'}\n`;
        text += `  Created: ${new Date(project.lastUpdated).toLocaleDateString()}\n\n`;
      });
    }
    
    if (data.sessions && data.sessions.length > 0) {
      text += 'SESSIONS\n';
      text += '-'.repeat(20) + '\n';
      data.sessions.forEach((session: Session) => {
        text += `• ${session.title}\n`;
        text += `  Date: ${session.date}\n`;
        text += `  Duration: ${session.duration || 0} minutes\n`;
        text += `  Project: ${session.projectName || 'No project'}\n`;
        text += `  Status: ${session.status || 'Unknown'}\n\n`;
      });
    }
    
    if (data.analytics) {
      text += 'ANALYTICS\n';
      text += '-'.repeat(20) + '\n';
      text += `Total Projects: ${data.analytics.totalProjects}\n`;
      text += `Total Sessions: ${data.analytics.totalSessions}\n`;
      text += `Average Session Duration: ${data.analytics.averageSessionDuration.toFixed(2)} minutes\n`;
      text += `Most Active Category: ${data.analytics.mostActiveCategory}\n`;
    }
    
    return text;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return '📊';
      case 'json': return '🔧';
      case 'excel': return '📈';
      case 'pdf': return '📄';
      default: return '📋';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="data-export-overlay">
      <div className="data-export-modal">
        <div className="export-header">
          <h2>📤 Data Export</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="export-content">
          <div className="export-tabs">
            <button className="tab-button active">Export Data</button>
            <button className="tab-button">Export History</button>
          </div>

          <div className="export-form">
            <div className="form-section">
              <h3>Select Data to Export</h3>
              <div className="data-selection">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedData.projects}
                    onChange={(e) => setSelectedData(prev => ({ ...prev, projects: e.target.checked }))}
                  />
                  <span className="checkbox-content">
                    <strong>Projects</strong>
                    <span className="checkbox-description">Export all project data ({projects.length} projects)</span>
                  </span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedData.sessions}
                    onChange={(e) => setSelectedData(prev => ({ ...prev, sessions: e.target.checked }))}
                  />
                  <span className="checkbox-content">
                    <strong>Sessions</strong>
                    <span className="checkbox-description">Export all session data ({sessions.length} sessions)</span>
                  </span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedData.analytics}
                    onChange={(e) => setSelectedData(prev => ({ ...prev, analytics: e.target.checked }))}
                  />
                  <span className="checkbox-content">
                    <strong>Analytics</strong>
                    <span className="checkbox-description">Export calculated analytics and metrics</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Export Options</h3>
              <div className="options-grid">
                <div className="option-group">
                  <label>Format</label>
                  <select
                    value={exportOptions.format}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      format: e.target.value as any 
                    }))}
                    className="form-select"
                  >
                    <option value="csv">CSV Spreadsheet</option>
                    <option value="json">JSON Data</option>
                    <option value="excel">Excel Workbook</option>
                    <option value="pdf">PDF Document</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Date Range</label>
                  <div className="date-range">
                    <input
                      type="date"
                      value={exportOptions.dateRange.start}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="form-input"
                    />
                    <span>to</span>
                    <input
                      type="date"
                      value={exportOptions.dateRange.end}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="option-group">
                  <label>Include Options</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeCharts}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeCharts: e.target.checked
                        }))}
                      />
                      Include Charts
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeImages}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeImages: e.target.checked
                        }))}
                      />
                      Include Images
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleExport}
                disabled={!selectedData.projects && !selectedData.sessions && !selectedData.analytics || isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="spinner"></div>
                    Exporting Data...
                  </>
                ) : (
                  <>
                    📤 Export Data
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="export-history">
            <h3>Recent Exports</h3>
            {exportHistory.length === 0 ? (
              <div className="no-exports">
                <p>No exports yet.</p>
              </div>
            ) : (
              <div className="history-list">
                {exportHistory.map(exportItem => (
                  <div key={exportItem.id} className="history-item">
                    <div className="history-header">
                      <div className="history-title">
                        <h4>{exportItem.name}</h4>
                        <span className="history-format">
                          {getFormatIcon(exportItem.format)} {exportItem.format.toUpperCase()}
                        </span>
                      </div>
                      <div className="history-meta">
                        <span className="history-date">{formatDate(exportItem.exportedAt)}</span>
                        <span className="history-size">{formatFileSize(exportItem.fileSize)}</span>
                      </div>
                    </div>
                    <div className="history-details">
                      <span className="detail-item">{exportItem.recordCount} records</span>
                      <span className="detail-item">{formatFileSize(exportItem.fileSize)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
