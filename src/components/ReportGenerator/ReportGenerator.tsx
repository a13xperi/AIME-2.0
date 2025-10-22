import React, { useState, useEffect } from 'react';
import { Project, Session, ReportTemplate, GeneratedReport, ExportOptions } from '../../types';
import './ReportGenerator.css';

interface ReportGeneratorProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  projects,
  sessions,
  onClose
}) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeImages: true,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0] // today
    },
    filters: {}
  });
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockTemplates: ReportTemplate[] = [
      {
        id: 'template-1',
        name: 'Project Summary Report',
        description: 'Comprehensive overview of project status and progress',
        category: 'project',
        isDefault: true,
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateData: {
          title: 'Project Summary Report',
          sections: [
            {
              id: 'summary',
              type: 'summary',
              title: 'Executive Summary',
              dataSource: 'projects',
              configuration: {},
              order: 1,
              visible: true
            },
            {
              id: 'metrics',
              type: 'metrics',
              title: 'Key Metrics',
              dataSource: 'projects',
              configuration: {},
              order: 2,
              visible: true
            },
            {
              id: 'timeline',
              type: 'timeline',
              title: 'Project Timeline',
              dataSource: 'projects',
              configuration: {},
              order: 3,
              visible: true
            }
          ],
          filters: [],
          format: 'pdf',
          styling: {
            theme: 'corporate',
            colors: {
              primary: '#3b82f6',
              secondary: '#6b7280',
              accent: '#10b981',
              background: '#ffffff',
              text: '#1f2937'
            },
            fonts: {
              heading: 'Inter',
              body: 'Inter',
              monospace: 'JetBrains Mono'
            },
            layout: {
              orientation: 'portrait',
              margins: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }
            }
          }
        }
      },
      {
        id: 'template-2',
        name: 'Session Analytics Report',
        description: 'Detailed analysis of work sessions and productivity',
        category: 'session',
        isDefault: true,
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateData: {
          title: 'Session Analytics Report',
          sections: [
            {
              id: 'charts',
              type: 'charts',
              title: 'Productivity Charts',
              dataSource: 'sessions',
              configuration: {},
              order: 1,
              visible: true
            },
            {
              id: 'tables',
              type: 'tables',
              title: 'Session Details',
              dataSource: 'sessions',
              configuration: {},
              order: 2,
              visible: true
            }
          ],
          filters: [],
          format: 'pdf',
          styling: {
            theme: 'minimal',
            colors: {
              primary: '#10b981',
              secondary: '#6b7280',
              accent: '#3b82f6',
              background: '#ffffff',
              text: '#1f2937'
            },
            fonts: {
              heading: 'Inter',
              body: 'Inter',
              monospace: 'JetBrains Mono'
            },
            layout: {
              orientation: 'landscape',
              margins: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }
            }
          }
        }
      },
      {
        id: 'template-3',
        name: 'Team Productivity Report',
        description: 'Team performance and collaboration metrics',
        category: 'team',
        isDefault: true,
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateData: {
          title: 'Team Productivity Report',
          sections: [
            {
              id: 'summary',
              type: 'summary',
              title: 'Team Overview',
              dataSource: 'team',
              configuration: {},
              order: 1,
              visible: true
            },
            {
              id: 'metrics',
              type: 'metrics',
              title: 'Performance Metrics',
              dataSource: 'team',
              configuration: {},
              order: 2,
              visible: true
            }
          ],
          filters: [],
          format: 'pdf',
          styling: {
            theme: 'corporate',
            colors: {
              primary: '#8b5cf6',
              secondary: '#6b7280',
              accent: '#f59e0b',
              background: '#ffffff',
              text: '#1f2937'
            },
            fonts: {
              heading: 'Inter',
              body: 'Inter',
              monospace: 'JetBrains Mono'
            },
            layout: {
              orientation: 'portrait',
              margins: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }
            }
          }
        }
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `report-${Date.now()}`,
        templateId: selectedTemplate.id,
        name: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        generatedAt: new Date().toISOString(),
        generatedBy: 'current-user',
        data: {
          projects: projects.filter(p => 
            new Date(p.updatedAt) >= new Date(exportOptions.dateRange.start) &&
            new Date(p.updatedAt) <= new Date(exportOptions.dateRange.end)
          ),
          sessions: sessions.filter(s => 
            new Date(s.date) >= new Date(exportOptions.dateRange.start) &&
            new Date(s.date) <= new Date(exportOptions.dateRange.end)
          )
        },
        format: exportOptions.format === 'excel' ? 'csv' : exportOptions.format as any,
        filePath: `/reports/report-${Date.now()}.${exportOptions.format}`,
        fileSize: Math.floor(Math.random() * 1000000) + 50000,
        status: 'completed',
        metadata: {
          recordCount: projects.length + sessions.length,
          dateRange: exportOptions.dateRange,
          filters: []
        }
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleExportReport = (report: GeneratedReport) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = report.filePath || '#';
    link.download = `${report.name}.${report.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'csv': return '📊';
      case 'json': return '🔧';
      case 'excel': return '📈';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'generating': return '#3b82f6';
      case 'failed': return '#dc2626';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="report-generator-overlay">
      <div className="report-generator-modal">
        <div className="generator-header">
          <h2>📊 Report Generator</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="generator-content">
          <div className="generator-tabs">
            <button 
              className={`tab-button ${!showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(false)}
            >
              Generate Report
            </button>
            <button 
              className={`tab-button ${showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(true)}
            >
              Generated Reports ({generatedReports.length})
            </button>
          </div>

          {!showPreview ? (
            <div className="generator-form">
              <div className="form-section">
                <h3>Select Template</h3>
                <div className="template-grid">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="template-header">
                        <h4>{template.name}</h4>
                        <span className="template-category">{template.category}</span>
                      </div>
                      <p className="template-description">{template.description}</p>
                      <div className="template-sections">
                        <span className="section-count">
                          {template.templateData.sections.length} sections
                        </span>
                      </div>
                    </div>
                  ))}
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
                      <option value="pdf">PDF Document</option>
                      <option value="csv">CSV Spreadsheet</option>
                      <option value="json">JSON Data</option>
                      <option value="excel">Excel Workbook</option>
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
                  onClick={handleGenerateReport}
                  disabled={!selectedTemplate || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      📊 Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="reports-list">
              <div className="reports-header">
                <h3>Generated Reports</h3>
                <span className="reports-count">{generatedReports.length} reports</span>
              </div>

              {generatedReports.length === 0 ? (
                <div className="no-reports">
                  <p>No reports generated yet.</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowPreview(false)}
                  >
                    Generate First Report
                  </button>
                </div>
              ) : (
                <div className="reports-grid">
                  {generatedReports.map(report => (
                    <div key={report.id} className="report-card">
                      <div className="report-header">
                        <div className="report-title">
                          <h4>{report.name}</h4>
                          <span className="report-format">
                            {getFormatIcon(report.format)} {report.format.toUpperCase()}
                          </span>
                        </div>
                        <div className="report-status">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(report.status) }}
                          >
                            {report.status}
                          </span>
                        </div>
                      </div>

                      <div className="report-meta">
                        <div className="meta-item">
                          <span className="meta-label">Generated:</span>
                          <span className="meta-value">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Records:</span>
                          <span className="meta-value">{report.metadata.recordCount}</span>
                        </div>
                        {report.fileSize && (
                          <div className="meta-item">
                            <span className="meta-label">Size:</span>
                            <span className="meta-value">{formatFileSize(report.fileSize)}</span>
                          </div>
                        )}
                      </div>

                      <div className="report-actions">
                        <button 
                          className="btn btn-outline btn-small"
                          onClick={() => handleExportReport(report)}
                          disabled={report.status !== 'completed'}
                        >
                          📥 Download
                        </button>
                        <button 
                          className="btn btn-secondary btn-small"
                          disabled={report.status !== 'completed'}
                        >
                          👁️ Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
