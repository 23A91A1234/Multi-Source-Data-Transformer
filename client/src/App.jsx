import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';

function CandidateCard({ profile }) {
  const [showJson, setShowJson] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  const [expandedExps, setExpandedExps] = useState({});

  const toggleExp = (idx) => {
    setExpandedExps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getConfidenceBadgeColor = (score) => {
    if (score >= 0.8) return 'var(--accent-green)';
    if (score >= 0.5) return 'var(--accent-orange)';
    return '#ef4444';
  };

  const formatRangeDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present') return 'Present';
    const parts = dateStr.split('-');
    if (parts.length < 2) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const monthName = months[monthIdx] || parts[1];
    return `${monthName} ${parts[0]}`;
  };

  const email = profile.emails && profile.emails[0];
  const phone = profile.phones && profile.phones[0];



  return (
    <div className="candidate-card animate-fade-in">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-title-group">
          <h3>{profile.full_name || 'Unknown Candidate'}</h3>
          {profile.headline && (
            <div className="card-headline">
              💼 {profile.headline}
            </div>
          )}
        </div>
        <div 
          className="match-badge"
          style={{ border: `1px solid ${getConfidenceBadgeColor(profile.overall_confidence || 0)}` }}
        >
          <span 
            className="match-dot"
            style={{ backgroundColor: getConfidenceBadgeColor(profile.overall_confidence || 0) }} 
          />
          <span className="match-text">
            {Math.round((profile.overall_confidence || 0) * 100)}% Match
          </span>
        </div>
      </div>

      {/* Contact Chips */}
      <div className="contact-chips">
        {email && (
          <span className="contact-chip">
            ✉️ {email}
          </span>
        )}
        {phone && (
          <span className="contact-chip">
            📞 {phone}
          </span>
        )}
        {profile.links?.linkedin && (
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="contact-chip contact-chip-linkedin">
            🔗 LinkedIn
          </a>
        )}
        {profile.links?.github && (
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="contact-chip contact-chip-github">
            💻 GitHub
          </a>
        )}
        {profile.links?.portfolio && (
          <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" className="contact-chip contact-chip-portfolio">
            🌐 Portfolio
          </a>
        )}
      </div>

      {/* Skills Pills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="skills-container">
          <div className="skills-title">SKILLS</div>
          <div className="skills-grid">
            {profile.skills.map((skill, sIdx) => (
              <div key={sIdx} className="skill-badge">
                {skill.name} <span style={{ opacity: 0.6, fontSize: '9px' }}>({Math.round((skill.confidence || 0.4) * 100)}%)</span>
                <div 
                  className="skill-progress-bar"
                  style={{ width: `${(skill.confidence || 0.4) * 100}%` }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Timeline */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="experience-container">
          <div className="skills-title">EXPERIENCE</div>
          <div className="experience-list">
            {profile.experience.map((exp, idx) => {
              const dates = `${formatRangeDate(exp.start)} – ${formatRangeDate(exp.end)}`;
              const isExpanded = expandedExps[idx];
              const displaySummary = exp.summary ? (isExpanded ? exp.summary : (exp.summary.length > 150 ? exp.summary.substring(0, 150) + '...' : exp.summary)) : '';
              return (
                <div key={idx} className="experience-card">
                  <div className="experience-header">
                    <div className="experience-title">
                      {exp.title || 'Role'} {exp.company && <span className="experience-company">at {exp.company}</span>}
                    </div>
                    <div className="experience-dates">{dates}</div>
                  </div>
                  {exp.summary && (
                    <div className="experience-summary">
                      {displaySummary}
                      {exp.summary.length > 150 && (
                        <span 
                          onClick={() => toggleExp(idx)}
                          className="experience-toggle"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <div className="education-container">
          <div className="skills-title">EDUCATION</div>
          <div className="education-grid">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="education-card">
                <div className="education-school">{edu.institution || 'School'}</div>
                <div className="education-degree">
                  {edu.degree || 'Degree'}{edu.field ? `, ${edu.field}` : ''}
                </div>
                {edu.end_year && (
                  <div className="education-year">Graduation: {edu.end_year}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provenance Section */}
      {profile.provenance && profile.provenance.length > 0 && (
        <div className="provenance-container">
          <div 
            onClick={() => setShowProvenance(!showProvenance)}
            className="provenance-toggle"
          >
            {showProvenance ? '▼ Hide Source Provenance' : '▶ Show Source Provenance'}
          </div>
          {showProvenance && (
            <div className="provenance-panel">
              <div className="provenance-title">
                Field Deduplication Traceability Map
              </div>
              <div className="provenance-grid">
                <div className="provenance-th">Target Field</div>
                <div className="provenance-th">Resolved Source</div>
                <div className="provenance-th">Merge Method</div>
              </div>
              {profile.provenance.map((prov, pIdx) => (
                <div key={pIdx} className="provenance-row">
                  <div className="provenance-field">{prov.field}</div>
                  <div className="provenance-source">📄 {prov.source}</div>
                  <div className="provenance-method">{prov.method}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsible View Raw JSON */}
      <div className="json-container">
        <div 
          onClick={() => setShowJson(!showJson)}
          className="json-toggle"
        >
          {showJson ? '▼ Hide Raw Profile JSON' : '▶ View Raw Profile JSON'}
        </div>
        {showJson && (
          <pre className="json-panel">
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function CandidateCardSkeleton() {
  return (
    <div className="candidate-card" style={{ animation: 'pulse-soft 2s infinite ease-in-out', background: 'rgba(255, 255, 255, 0.005)' }}>
      {/* Card Header Skeleton */}
      <div className="card-header">
        <div className="card-title-group" style={{ width: '100%' }}>
          <div className="skeleton skeleton-name" />
          <div className="skeleton skeleton-sub" />
        </div>
        <div className="skeleton skeleton-badge" />
      </div>

      {/* Contact Chips Skeleton */}
      <div className="contact-chips">
        <div className="skeleton skeleton-chip" />
        <div className="skeleton skeleton-chip" style={{ width: '120px' }} />
        <div className="skeleton skeleton-chip" style={{ width: '80px' }} />
      </div>

      {/* Skills Skeleton */}
      <div className="skills-container">
        <div className="skeleton skeleton-sub" />
        <div className="skills-grid">
          <div className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '24px', width: '90px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '12px' }} />
        </div>
      </div>

      {/* Experience Skeleton */}
      <div className="experience-container">
        <div className="skeleton skeleton-sub" />
        <div className="experience-list">
          <div className="experience-card">
            <div className="skeleton skeleton-text" style={{ width: '50%' }} />
            <div className="skeleton skeleton-text" style={{ width: '90%' }} />
            <div className="skeleton skeleton-text" style={{ width: '30%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Input fields
  const [files, setFiles] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [customConfig, setCustomConfig] = useState('');
  
  // Pipeline state
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('run'); // 'run' | 'past-runs' | 'configs'

  // Past runs
  const [pastRuns, setPastRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [reprojecting, setReprojecting] = useState(false);

  // Saved configs list
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [newConfigName, setNewConfigName] = useState('');

  // DB Connection status
  const [dbStatus, setDbStatus] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const checkHealth = async () => {
    try {
      const res = await fetch(API_BASE + '/api/health');
      const data = await res.json();
      const connected = data.database?.status === 'connected';
      setDbStatus({ reachable: true, connected });
    } catch (err) {
      setDbStatus({ reachable: false, connected: false });
    }
  };

  // Reset banner dismissal state if connection status changes to degraded/unreachable
  useEffect(() => {
    if (dbStatus) {
      if (!dbStatus.reachable || !dbStatus.connected) {
        setBannerDismissed(false);
      }
    }
  }, [dbStatus?.connected, dbStatus?.reachable]);

  // Fetch initial data and setup status checking
  useEffect(() => {
    fetchPastRuns();
    fetchDefaultConfig();
    fetchSavedConfigs();
    checkHealth();

    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchPastRuns = async () => {
    checkHealth();
    try {
      const res = await fetch(API_BASE + '/api/runs');
      if (res.ok) {
        const data = await res.json();
        setPastRuns(data);
      }
    } catch (e) {
      console.error('Failed to load past runs:', e);
    }
  };

  const fetchDefaultConfig = async () => {
    try {
      const res = await fetch(API_BASE + '/api/config/default');
      if (res.ok) {
        const data = await res.json();
        setCustomConfig(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.error('Failed to load default config:', e);
    }
  };

  const fetchSavedConfigs = async () => {
    checkHealth();
    try {
      const res = await fetch(API_BASE + '/api/configs');
      if (res.ok) {
        const data = await res.json();
        setSavedConfigs(data);
      }
    } catch (e) {
      console.error('Failed to load saved configs:', e);
    }
  };

  // Set up loading stages animation
  useEffect(() => {
    let interval;
    if (loading) {
      const stages = [
        'Detecting source file formats...',
        'Extracting candidate profile records...',
        'Normalizing emails, phones, and dates...',
        'Merging duplicate profiles...',
        'Calculating field confidence scores...',
        'Applying custom projection configurations...',
        'Validating canonical output schemas...'
      ];
      let currentIdx = 0;
      setLoadingStage(stages[0]);
      interval = setInterval(() => {
        currentIdx = (currentIdx + 1) % stages.length;
        setLoadingStage(stages[currentIdx]);
      }, 900);
    } else {
      setLoadingStage('');
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const acceptedFiles = droppedFiles.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ['csv', 'json', 'pdf', 'docx', 'txt'].includes(ext);
      });
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleRunPipeline = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setWarnings([]);

    try {
      const formData = new FormData();
      
      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });

      // Append URLs
      if (githubUrl.trim()) formData.append('github_url', githubUrl.trim());
      if (linkedinUrl.trim()) formData.append('linkedin_url', linkedinUrl.trim());

      // Append config
      if (customConfig.trim()) {
        try {
          const parsed = JSON.parse(customConfig);
          formData.append('config', JSON.stringify(parsed));
        } catch (err) {
          setError({ message: 'Malformed JSON Config: ' + err.message });
          setLoading(false);
          return;
        }
      }

      const res = await fetch(API_BASE + '/api/pipeline/run', {
        method: 'POST',
        body: formData
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned invalid response format: ${text.substring(0, 150) || 'Empty body'}`);
      }

      if (!res.ok) {
        throw new Error(data.error?.message || 'Transformation pipeline failed.');
      }

      setResult(data.profiles);
      setWarnings(data.warnings || []);
      fetchPastRuns(); // refresh list
      if (data.run_id && data.run_id !== 'no-persist-run') {
        try {
          const runRes = await fetch(API_BASE + `/api/runs/${data.run_id}`);
          if (runRes.ok) {
            const runData = await runRes.json();
            setSelectedRun(runData);
          }
        } catch (e) {
          console.error('Failed to auto-select newly executed run:', e);
        }
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRun = async (runId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setWarnings([]);
    try {
      const res = await fetch(API_BASE + `/api/runs/${runId}`);
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned invalid response format: ${text.substring(0, 150) || 'Empty body'}`);
      }

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to retrieve run details.');
      }
      setSelectedRun(data);
      // set output panel with canonical profiles or default project
      setResult(data.profiles);
      setWarnings(data.run.warnings || []);
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const performReprojection = async (runId, configObj) => {
    setReprojecting(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE + `/api/pipeline/project/${runId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config: configObj })
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned invalid response: ${text.substring(0, 150) || 'Empty body'}`);
      }
      if (!res.ok) {
        throw new Error(data.error?.message || 'Reprojection failed.');
      }

      setResult(data.profiles);
      setWarnings(data.warnings || []);
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setReprojecting(false);
      setLoading(false);
    }
  };

  const handleReproject = async () => {
    if (!selectedRun) return;
    try {
      const configObj = JSON.parse(customConfig);
      await performReprojection(selectedRun.run._id, configObj);
    } catch (err) {
      setError({ message: 'Malformed JSON Config: ' + err.message });
    }
  };

  const handleSaveConfig = async () => {
    if (!newConfigName.trim() || !customConfig.trim()) return;
    try {
      let configObj;
      try {
        configObj = JSON.parse(customConfig);
      } catch (err) {
        alert('Malformed JSON config: ' + err.message);
        return;
      }

      const res = await fetch(API_BASE + '/api/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newConfigName.trim(),
          config: configObj
        })
      });

      if (res.ok) {
        setNewConfigName('');
        fetchSavedConfigs();
        alert('Configuration saved successfully!');
      } else {
        const data = await res.json();
        alert('Failed to save config: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const loadSavedConfig = async (cfgObj) => {
    setCustomConfig(JSON.stringify(cfgObj, null, 2));
    setActiveTab('run'); // Switch back to run pipeline tab to show the loaded configuration!

    let runToProject = selectedRun;

    // If no run is currently selected, check if there's any past run available
    if (!runToProject && pastRuns && pastRuns.length > 0) {
      const mostRecentRunId = pastRuns[0]._id; // pastRuns is sorted by created_at desc in backend
      setLoading(true);
      try {
        const res = await fetch(API_BASE + `/api/runs/${mostRecentRunId}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedRun(data);
          runToProject = data;
        }
      } catch (e) {
        console.error('Failed to auto-load most recent run:', e);
      } finally {
        setLoading(false);
      }
    }

    if (runToProject && runToProject.run && runToProject.run._id) {
      await performReprojection(runToProject.run._id, cfgObj);
    }
  };

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <div className="header-title">
          <h1 style={{ marginBottom: '8px' }}>
            Candidate Data <span className="gradient-text">Transformer</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Pure deterministic, traceable, multi-source deduplication pipeline.
          </p>
        </div>
        <div className="header-nav">
          <button 
            className={`btn ${activeTab === 'run' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('run'); setSelectedRun(null); setResult(null); }}
          >
            ⚡ Run Pipeline
          </button>
          <button 
            className={`btn ${activeTab === 'past-runs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('past-runs'); setResult(null); }}
          >
            🗂️ Past Runs ({pastRuns.length})
          </button>
          <button 
            className={`btn ${activeTab === 'configs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('configs')}
          >
            ⚙️ Saved Configs
          </button>
        </div>
      </header>

      {/* Database connection/backend liveness status banners */}
      {dbStatus && !dbStatus.reachable && !bannerDismissed && (
        <div className="banner banner-error">
          <div>
            <strong>⚠️ Cannot reach the backend server at all.</strong> Make sure <code>npm start</code> is running in <code>/server</code>.
          </div>
          <button 
            onClick={() => setBannerDismissed(true)}
            className="banner-close"
          >
            ×
          </button>
        </div>
      )}

      {dbStatus && dbStatus.reachable && !dbStatus.connected && !bannerDismissed && (
        <div className="banner banner-warning">
          <div>
            <strong>⚠️ Database not connected:</strong> Run Pipeline still works, but run history and saved configs won't be persisted. Start MongoDB and refresh to enable these features.
          </div>
          <button 
            onClick={() => setBannerDismissed(true)}
            className="banner-close"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="error-panel">
          <strong>⚠️ Error:</strong> {error.message}
          {error.details && (
            <pre className="error-details">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="layout-grid">
        {/* LEFT COLUMN: Input Control Panel */}
        <div>
          {activeTab === 'run' && (
            <form onSubmit={handleRunPipeline} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>Ingest Sources</h2>
              
              <div>
                <label>Upload Source Files (CSV, JSON, PDF, DOCX, TXT)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                  className={`uploader-zone ${dragOver ? 'drag-active' : ''}`}
                >
                  <input 
                    id="file-input"
                    type="file" 
                    multiple 
                    accept=".csv,.json,.pdf,.docx,.txt" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }}
                  />
                  <div className="uploader-icon">📂</div>
                  <div className="uploader-title">
                    Drag & drop files here, or <span style={{ color: 'var(--accent-cyan)' }}>browse</span>
                  </div>
                  <div className="uploader-desc">
                    Supports CSV, JSON, PDF, DOCX, TXT
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="staged-files-list">
                    <div className="staged-files-title">Staged Files ({files.length}):</div>
                    <div className="staged-files-container">
                      {files.map((file, idx) => {
                        const ext = file.name.split('.').pop().toLowerCase();
                        let icon = '📄';
                        if (ext === 'pdf') icon = '📕';
                        if (ext === 'csv') icon = '📊';
                        if (ext === 'json') icon = '📦';
                        if (ext === 'docx') icon = '📘';
                        if (ext === 'txt') icon = '📝';
                        return (
                          <div 
                            key={idx}
                            className="staged-file-chip"
                          >
                            <span>{icon} {file.name}</span>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(idx);
                              }}
                              className="file-remove-btn"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label>GitHub Username or Profile URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://github.com/octocat" 
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div>
                <label>LinkedIn Profile URL (resolves to static mock fixture)</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://linkedin.com/in/johndoe" 
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Runtime Output Projection Config (JSON)</label>
                  <button 
                    type="button" 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '12px' }}
                    onClick={fetchDefaultConfig}
                  >
                    Reset to Default
                  </button>
                </div>
                <textarea 
                  value={customConfig}
                  onChange={(e) => setCustomConfig(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '12px', minHeight: '180px' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Processing...' : '🚀 Execute Transformation Pipeline'}
              </button>
            </form>
          )}

          {activeTab === 'past-runs' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px' }}>Pipeline History</h2>
               {pastRuns.length === 0 ? (
                dbStatus && dbStatus.reachable && !dbStatus.connected ? (
                  <div style={{
                    padding: '16px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    color: 'var(--accent-orange)',
                    fontSize: '13px',
                    lineHeight: '1.4'
                  }}>
                    <strong>⚠️ Database not connected:</strong> Run history cannot be loaded or saved. Please start MongoDB to enable pipeline history.
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No past runs yet — run the pipeline to see history here.</p>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
                  {pastRuns.map((run) => {
                    const dateStr = new Date(run.started_at).toLocaleString();
                    const isActive = selectedRun?.run?._id === run._id;
                    return (
                      <div 
                        key={run._id}
                        onClick={() => handleSelectRun(run._id)}
                        className={`history-card ${isActive ? 'active' : ''}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontWeight: '750', fontSize: '14px', color: 'var(--text-primary)' }}>
                            Run #{run._id.slice(-6).toUpperCase()}
                          </span>
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: '700',
                            padding: '3px 8px', 
                            borderRadius: '12px',
                            background: run.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: run.status === 'completed' ? 'var(--accent-green)' : '#f87171',
                            border: '1px solid ' + (run.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)')
                          }}>
                            {run.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '12px', color: 'var(--text-muted)', gap: '8px' }}>
                          <div>📥 Sources: <strong style={{ color: '#fff' }}>{run.source_count}</strong></div>
                          <div>👤 Profiles: <strong style={{ color: '#fff' }}>{run.profile_count}</strong></div>
                          <div style={{ gridColumn: 'span 2', fontSize: '11px', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '6px' }}>
                            📅 {dateStr}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'configs' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px' }}>Save & Choose Projection Configurations</h2>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Configuration Name"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSaveConfig} style={{ flexShrink: 0 }}>
                  Save Current Config
                </button>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label>Saved Templates</label>
                {savedConfigs.length === 0 ? (
                  dbStatus && dbStatus.reachable && !dbStatus.connected ? (
                    <div style={{
                      padding: '16px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '8px',
                      color: 'var(--accent-orange)',
                      fontSize: '13px',
                      lineHeight: '1.4'
                    }}>
                      <strong>⚠️ Database not connected:</strong> Custom configurations cannot be loaded or saved. Please start MongoDB to enable configurations persistence.
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No saved configurations yet — create one above to see it here.</p>
                  )
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {savedConfigs.map(cfg => (
                      <div 
                        key={cfg._id} 
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>{cfg.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Fields: {cfg.config?.fields?.length || 0}
                          </div>
                        </div>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => loadSavedConfig(cfg.config)}
                        >
                          Load Template
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Output Preview & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedRun && (
            <div className="active-selection-banner">
              <h3 className="active-selection-title">⚡ Active Selection: Run Details</h3>
              <div className="active-selection-grid">
                <div>ID: <strong style={{ color: '#fff', wordBreak: 'break-all' }}>{selectedRun.run._id}</strong></div>
                <div>Status: <strong style={{ color: 'var(--accent-green)' }}>{selectedRun.run.status}</strong></div>
                <div>Sources: <strong>{selectedRun.sources?.length || 0}</strong></div>
                <div>Profiles: <strong>{selectedRun.profiles?.length || 0}</strong></div>
              </div>
              
              {selectedRun.sources && selectedRun.sources.length > 0 && (
                <div style={{ marginTop: '12px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ingested Files:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {selectedRun.sources.map(src => (
                      <span 
                        key={src._id}
                        className="staged-source-tag"
                      >
                        📄 {src.source_id} ({src.source_type})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="glass-panel output-container">
            <div className="output-header">
              <h2 className="output-header-title">Transformation Output</h2>
              {loading && <span style={{ color: 'var(--accent-cyan)', fontSize: '14px' }}>⚡ Processing...</span>}
            </div>

            {warnings.length > 0 && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid var(--accent-orange)',
                color: 'var(--accent-orange)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚠️ Pipeline Warnings ({warnings.length})
                </div>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {warnings.map((w, idx) => <li key={idx} style={{ opacity: 0.9 }}>{w}</li>)}
                </ul>
              </div>
            )}

            <div className="output-box">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', height: '100%', overflow: 'hidden' }}>
                  <div className="loader-content" style={{ zIndex: 10, background: 'rgba(10, 15, 29, 0.75)', backdropFilter: 'blur(2px)' }}>
                    <div className="loader-spinner" />
                    <div className="loader-title">Executing Deduplication Pipeline</div>
                    <div className="loader-stage">
                      ⚡ {loadingStage}
                    </div>
                    <div className="loader-progress-bg">
                      <div className="loader-progress-fill" />
                    </div>
                  </div>
                  <CandidateCardSkeleton />
                  <CandidateCardSkeleton />
                </div>
              ) : result ? (
                result.length === 0 ? (
                  <div className="empty-view">
                    <span className="empty-view-icon">👤</span>
                    <div className="empty-view-title">No Candidate Profiles Resolved</div>
                    <p className="empty-view-desc">
                      The ingested sources did not contain any valid candidate records or could not be successfully resolved.
                    </p>
                  </div>
                ) : (
                  <div className="output-scroll">
                    {result.map((profile) => (
                      <CandidateCard key={profile.candidate_id} profile={profile} />
                    ))}
                  </div>
                )
              ) : (
                <div className="empty-view">
                  <div className="standby-illustration">
                    <div className="standby-file standby-file-1">📊</div>
                    <div className="standby-file standby-file-2">📕</div>
                    <div className="standby-file standby-file-3">📦</div>
                    <div className="standby-transformer">⚡</div>
                  </div>
                  <div className="empty-view-title">Ready to transform candidate profiles.</div>
                  <span className="empty-view-desc">
                    Upload files, add profile URLs, and click Execute.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
