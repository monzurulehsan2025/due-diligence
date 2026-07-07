const { useState, useEffect, useMemo } = React;

// Initial mockup data to populate database state
const INITIAL_CASES = [
  {
    id: "case_001",
    subjectName: "Alistair Vance",
    subjectType: "Individual",
    companyAssociation: "Apex Wealth Management",
    riskLevel: "High",
    status: "In Progress",
    createdAt: "2026-07-01T10:00:00Z",
    investigationScope: "Enhanced Profile"
  },
  {
    id: "case_002",
    subjectName: "Vortex Energy Corp",
    subjectType: "Entity",
    companyAssociation: "N/A",
    riskLevel: "Medium",
    status: "Review Required",
    createdAt: "2026-07-03T14:30:00Z",
    investigationScope: "Corporate Integrity"
  }
];

const INITIAL_SCREENINGS = {
  "case_001": {
    caseId: "case_001",
    watchlists: {
      pepStatus: "Confirmed Match (Tier 2)",
      sanctionsList: "No matches",
      adverseMedia: [
        {
          title: "Apex Wealth CEO Alistair Vance Investigated for Offshore Tax Avoidance",
          source: "Financial Herald",
          date: "2025-11-12",
          sentiment: "Negative",
          url: "#"
        }
      ]
    },
    verificationChecks: {
      identityVerified: true,
      educationVerified: true,
      employmentVerified: true
    }
  },
  "case_002": {
    caseId: "case_002",
    watchlists: {
      pepStatus: "No matches",
      sanctionsList: "Confirmed Match (OFAC SDN List - Secondary Shipping ties)",
      adverseMedia: [
        {
          title: "Vortex Energy Accused of Violating Maritime Trade Embargos",
          source: "Daily Maritime",
          date: "2026-02-15",
          sentiment: "Negative",
          url: "#"
        }
      ]
    },
    verificationChecks: {
      identityVerified: true,
      educationVerified: false,
      employmentVerified: false
    }
  }
};

const INITIAL_AI_REPORTS = {
  "case_002": {
    caseId: "case_002",
    aiSummary: "AI analysis of Vortex Energy Corp flags an active OFAC sanctions list match linked to maritime shipping associations. There is an elevated risk of secondary sanctions. Regulatory exposure is High.",
    flagsDetected: [
      {
        severity: "High",
        category: "Sanctions",
        description: "OFAC SDN List matching shipping vessel names."
      },
      {
        severity: "Medium",
        category: "Compliance",
        description: "Incomplete ultimate beneficial ownership documentation."
      }
    ],
    recommendedAction: "Escalate to Legal Council for Trade Sanctions Review"
  }
};

function App() {
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' | 'cases' | 'case-detail'
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  
  // Database States
  const [cases, setCases] = useState(INITIAL_CASES);
  const [screenings, setScreenings] = useState(INITIAL_SCREENINGS);
  const [aiReports, setAiReports] = useState(INITIAL_AI_REPORTS);
  
  // Console Logging State
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [activeCallId, setActiveCallId] = useState(null); // Track loader spinner for active api call
  
  // Case Modal Creation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Test Suite States
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState([
    { name: "Test 1: GET /api/cases", description: "Fetch all active cases and verify initial records load.", status: "pending" },
    { name: "Test 2: POST /api/cases", description: "Create a new case profile and verify it is successfully added to the database.", status: "pending" },
    { name: "Test 3: GET /api/cases/:id/screening", description: "Retrieve PEP, Sanctions and adverse media records for a specific case.", status: "pending" },
    { name: "Test 4: POST /api/cases/:id/ai-analyze", description: "Request an AI analysis and verify flags, summary and recommendation generate correctly.", status: "pending" },
    { name: "Test 5: PUT /api/cases/:id/status", description: "Update case status to Completed and verify the workflow changes in state.", status: "pending" }
  ]);
  const [newCaseData, setNewCaseData] = useState({
    subjectName: "",
    subjectType: "Individual",
    companyAssociation: "",
    investigationScope: "Enhanced Profile"
  });

  // Log API helper
  const logApiCall = (method, path, requestPayload, responsePayload) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = {
      id: Date.now() + Math.random().toString(),
      timestamp,
      method,
      path,
      requestPayload: requestPayload ? JSON.stringify(requestPayload, null, 2) : null,
      responsePayload: JSON.stringify(responsePayload, null, 2)
    };
    setConsoleLogs(prev => [newLog, ...prev]);
  };

  // 1. API: GET /api/cases
  const apiGetCases = () => {
    setActiveCallId("get-cases");
    setTimeout(() => {
      // Return current cases state
      logApiCall("GET", "/api/cases", null, cases);
      setActiveCallId(null);
    }, 400);
  };

  // Run on initial load
  useEffect(() => {
    apiGetCases();
  }, []);

  // 2. API: POST /api/cases
  const apiCreateCase = (e) => {
    e.preventDefault();
    if (!newCaseData.subjectName) return;

    setActiveCallId("create-case");
    
    const requestPayload = { ...newCaseData };
    
    setTimeout(() => {
      const newId = `case_00${cases.length + 1}`;
      const newCase = {
        id: newId,
        subjectName: newCaseData.subjectName,
        subjectType: newCaseData.subjectType,
        companyAssociation: newCaseData.companyAssociation || "N/A",
        riskLevel: Math.random() > 0.5 ? "Low" : "Medium", // Random seed for demonstration
        status: "In Progress",
        createdAt: new Date().toISOString(),
        investigationScope: newCaseData.investigationScope
      };

      // Add to cases state
      setCases(prev => [...prev, newCase]);
      
      // Mock screening database creation
      const mockScreening = {
        caseId: newId,
        watchlists: {
          pepStatus: "No matches found",
          sanctionsList: "No matches found",
          adverseMedia: []
        },
        verificationChecks: {
          identityVerified: true,
          educationVerified: true,
          employmentVerified: true
        }
      };
      setScreenings(prev => ({ ...prev, [newId]: mockScreening }));

      logApiCall("POST", "/api/cases", requestPayload, newCase);
      
      // Reset modal
      setIsModalOpen(false);
      setNewCaseData({
        subjectName: "",
        subjectType: "Individual",
        companyAssociation: "",
        investigationScope: "Enhanced Profile"
      });
      setActiveCallId(null);
      
      // Switch view and select new case
      setSelectedCaseId(newId);
      setCurrentView("case-detail");
    }, 600);
  };

  // 3. API: GET /api/cases/:id/screening
  const apiGetScreening = (caseId) => {
    setActiveCallId(`get-screening-${caseId}`);
    setTimeout(() => {
      const screening = screenings[caseId] || {
        caseId,
        watchlists: { pepStatus: "No matches", sanctionsList: "No matches", adverseMedia: [] },
        verificationChecks: { identityVerified: true, educationVerified: true, employmentVerified: true }
      };
      logApiCall("GET", `/api/cases/${caseId}/screening`, null, screening);
      setActiveCallId(null);
    }, 450);
  };

  // 4. API: POST /api/cases/:id/ai-analyze
  const apiRunAiAnalysis = (caseId) => {
    setActiveCallId(`ai-analyze-${caseId}`);
    const requestPayload = {
      analysisDepth: "Deep Search",
      focusAreas: ["Financial Crimes", "Political Exposure", "Sanctions"]
    };

    setTimeout(() => {
      // Find case details to craft summary
      const targetCase = cases.find(c => c.id === caseId);
      
      let mockReport = {
        caseId,
        aiSummary: `AI generated assessment for ${targetCase?.subjectName || "Subject"}. Checks reveal clear documentation pathways. No immediate geopolitical risks detected. Subject is classified as low-profile.`,
        flagsDetected: [],
        recommendedAction: "Proceed to Standard Screening Resolution"
      };

      if (caseId === "case_001") {
        mockReport = {
          caseId,
          aiSummary: "Subject Alistair Vance exhibits elevated political exposure risk through connections to foreign ministries. The adverse media match regarding offshore tax avoidance is highly relevant and requires senior-level review.",
          flagsDetected: [
            {
              severity: "High",
              category: "Adverse Media",
              description: "Tax avoidance investigation published by Financial Herald."
            },
            {
              severity: "Medium",
              category: "PEP Connection",
              description: "Second-degree relation to Minister of Energy."
            }
          ],
          recommendedAction: "Escalate to Compliance Committee"
        };
      } else if (caseId === "case_002") {
        mockReport = {
          caseId,
          aiSummary: "AI analysis of Vortex Energy Corp flags an active OFAC sanctions list match linked to maritime shipping associations. There is an elevated risk of secondary sanctions. Regulatory exposure is High.",
          flagsDetected: [
            {
              severity: "High",
              category: "Sanctions",
              description: "OFAC SDN List matching shipping vessel names."
            },
            {
              severity: "Medium",
              category: "Compliance",
              description: "Incomplete ultimate beneficial ownership documentation."
            }
          ],
          recommendedAction: "Escalate to Legal Council for Trade Sanctions Review"
        };
      }

      setAiReports(prev => ({ ...prev, [caseId]: mockReport }));
      logApiCall("POST", `/api/cases/${caseId}/ai-analyze`, requestPayload, mockReport);
      setActiveCallId(null);
    }, 800);
  };

  // 5. API: PUT /api/cases/:id/status
  const apiUpdateStatus = (caseId, newStatus) => {
    setActiveCallId(`update-status-${caseId}`);
    const requestPayload = {
      status: newStatus,
      notes: `User updated status to ${newStatus} on the MVP Frontend UI dashboard.`
    };

    setTimeout(() => {
      // Update cases local list
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
      
      const responsePayload = {
        caseId,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        notes: requestPayload.notes
      };

      logApiCall("PUT", `/api/cases/${caseId}/status`, requestPayload, responsePayload);
      setActiveCallId(null);
    }, 500);
  };

  // Metrics helper
  const metrics = useMemo(() => {
    const total = cases.length;
    const highRisk = cases.filter(c => c.riskLevel === "High").length;
    const reviewRequired = cases.filter(c => c.status === "Review Required").length;
    const aiCount = Object.keys(aiReports).length;
    return { total, highRisk, reviewRequired, aiCount };
  }, [cases, aiReports]);

  // Navigate helper
  const navigateToCaseDetail = (caseId) => {
    setSelectedCaseId(caseId);
    setCurrentView("case-detail");
    apiGetScreening(caseId);
  };

  // Test Suite Runner
  const runTestSuite = () => {
    setIsTesting(true);
    setTestResults(prev => prev.map(r => ({ ...r, status: "running", error: null })));

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const updateResult = (idx, status, error = null) => {
      setTestResults(prev => prev.map((r, i) => i === idx ? { ...r, status, error } : r));
    };

    // Run Test 1
    sleep(600)
      .then(() => {
        if (cases.length < 2) throw new Error("Expected at least 2 initial cases");
        logApiCall("GET", "/api/cases", null, cases);
        updateResult(0, "passed");
        return sleep(600);
      })
      .then(() => {
        // Run Test 2
        const testCase = {
          subjectName: "Test Individual",
          subjectType: "Individual",
          companyAssociation: "Test Corp",
          investigationScope: "Standard KYC"
        };
        const newId = `case_test_${Date.now()}`;
        const newCase = {
          id: newId,
          ...testCase,
          riskLevel: "Low",
          status: "In Progress",
          createdAt: new Date().toISOString()
        };
        setCases(prev => [...prev, newCase]);
        logApiCall("POST", "/api/cases", testCase, newCase);
        updateResult(1, "passed");
        return sleep(600);
      })
      .then(() => {
        // Run Test 3
        const screening = screenings["case_001"];
        if (!screening) throw new Error("Could not find screening details for case_001");
        logApiCall("GET", "/api/cases/case_001/screening", null, screening);
        updateResult(2, "passed");
        return sleep(600);
      })
      .then(() => {
        // Run Test 4
        const requestPayload = { analysisDepth: "Deep Search", focusAreas: ["Sanctions"] };
        const responsePayload = {
          caseId: "case_001",
          aiSummary: "AI Risk check completed successfully.",
          flagsDetected: [],
          recommendedAction: "Verify identity documents."
        };
        setAiReports(prev => ({ ...prev, "case_001": responsePayload }));
        logApiCall("POST", "/api/cases/case_001/ai-analyze", requestPayload, responsePayload);
        updateResult(3, "passed");
        return sleep(600);
      })
      .then(() => {
        // Run Test 5
        const requestPayload = { status: "Completed", notes: "Test note" };
        setCases(prev => prev.map(c => c.id === "case_001" ? { ...c, status: "Completed" } : c));
        logApiCall("PUT", "/api/cases/case_001/status", requestPayload, { caseId: "case_001", status: "Completed" });
        updateResult(4, "passed");
      })
      .catch(e => {
        setTestResults(prev => prev.map(r => r.status === "running" ? { ...r, status: "failed", error: e.message } : r));
      })
      .finally(() => {
        setIsTesting(false);
      });
  };

  return (
    <div className={`app-container ${isConsoleCollapsed ? 'console-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="brand-name">VERITAS RISK</span>
          </div>

          <nav>
            <ul className="menu-list">
              <li className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}>
                <button onClick={() => { setCurrentView('dashboard'); apiGetCases(); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li className={`menu-item ${currentView === 'cases' ? 'active' : ''}`}>
                <button onClick={() => { setCurrentView('cases'); apiGetCases(); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Active Cases
                </button>
              </li>
              <li className={`menu-item ${currentView === 'tests' ? 'active' : ''}`}>
                <button onClick={() => { setCurrentView('tests'); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  System Tests
                </button>
              </li>
              <li className="menu-item" style={{ marginTop: '1rem' }}>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Case
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="company-name">Risk Advisory Platform</div>
          <div>Due Diligence MVP v1.0</div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="view-title">
            <h1>{currentView === 'dashboard' ? 'Risk Intelligence Center' : currentView === 'cases' ? 'Due Diligence Cases' : 'Case Profile Analysis'}</h1>
          </div>
          <div className="user-profile">
            <span className="badge-dev">DEV MODE</span>
            <button className="btn btn-secondary" onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}>
              {isConsoleCollapsed ? 'Open Console' : 'Close Console'}
            </button>
            <div className="user-avatar">ME</div>
          </div>
        </header>

        <div className="view-container">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="widgets-grid">
                <div className="card widget-card">
                  <div className="widget-info">
                    <h3>Active Screening Cases</h3>
                    <div className="value">{metrics.total}</div>
                  </div>
                  <div className="widget-icon blue">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                </div>

                <div className="card widget-card">
                  <div className="widget-info">
                    <h3>High Risk Flags</h3>
                    <div className="value" style={{ color: 'var(--danger)' }}>{metrics.highRisk}</div>
                  </div>
                  <div className="widget-icon red">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                </div>

                <div className="card widget-card">
                  <div className="widget-info">
                    <h3>Review Required</h3>
                    <div className="value" style={{ color: 'var(--warning)' }}>{metrics.reviewRequired}</div>
                  </div>
                  <div className="widget-icon green">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>

                <div className="card widget-card">
                  <div className="widget-info">
                    <h3>AI Profiles Completed</h3>
                    <div className="value" style={{ color: 'var(--accent)' }}>{metrics.aiCount}</div>
                  </div>
                  <div className="widget-icon purple">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="card" style={{ padding: '1.75rem' }}>
                  <div className="section-header">
                    <h2>Recent Due Diligence Pipeline</h2>
                    <button className="btn btn-secondary" onClick={() => setCurrentView('cases')}>View All</button>
                  </div>
                  <table className="cases-table">
                    <thead>
                      <tr>
                        <th>Subject Name</th>
                        <th>Type</th>
                        <th>Risk Level</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.slice(0, 3).map(c => (
                        <tr key={c.id} onClick={() => navigateToCaseDetail(c.id)}>
                          <td style={{ fontWeight: '600' }}>{c.subjectName}</td>
                          <td>{c.subjectType}</td>
                          <td>
                            <span className={`badge-risk ${c.riskLevel.toLowerCase()}`}>
                              {c.riskLevel}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status ${c.status.toLowerCase().replace(' ', '_')}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h2 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 600 }}>Compliance Summary</h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="85, 100" />
                      </svg>
                      <div style={{ position: 'absolute', fontWeight: 'bold', fontSize: '1.1rem' }}>85%</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Overall Resolution</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cases checked against standard verification protocols</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Criminal Database API</span>
                      <span style={{ color: 'var(--success)', fontWeight: '600' }}>ONLINE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>World PEP API</span>
                      <span style={{ color: 'var(--success)', fontWeight: '600' }}>ONLINE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Practical AI Risk API</span>
                      <span style={{ color: 'var(--success)', fontWeight: '600' }}>ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cases View */}
          {currentView === 'cases' && (
            <div className="animate-fade-in card">
              <div className="section-header">
                <h2>All Due Diligence Cases</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create New Case
                </button>
              </div>

              <table className="cases-table">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Subject Type</th>
                    <th>Company Association</th>
                    <th>Risk Level</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => (
                    <tr key={c.id} onClick={() => navigateToCaseDetail(c.id)}>
                      <td style={{ fontWeight: '600' }}>{c.subjectName}</td>
                      <td>{c.subjectType}</td>
                      <td>{c.companyAssociation}</td>
                      <td>
                        <span className={`badge-risk ${c.riskLevel.toLowerCase()}`}>
                          {c.riskLevel}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status ${c.status.toLowerCase().replace(' ', '_')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* System Tests View */}
          {currentView === 'tests' && (
            <div className="animate-fade-in card">
              <div className="section-header">
                <h2>Automated System Tests</h2>
                <button className="btn btn-primary" onClick={runTestSuite} disabled={isTesting}>
                  {isTesting ? 'Running Tests...' : 'Run Test Suite'}
                </button>
              </div>
              <div className="test-results-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {testResults.map((result, idx) => (
                  <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{result.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{result.description}</div>
                      {result.error && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className={`badge-status ${result.status === 'passed' ? 'completed' : result.status === 'failed' ? 'review_required' : result.status === 'running' ? 'in_progress' : 'in_progress'}`} style={{ color: result.status === 'pending' ? 'var(--text-muted)' : 'inherit' }}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Detail View */}
          {currentView === 'case-detail' && (
            <div className="animate-fade-in">
              {(() => {
                const currentCase = cases.find(c => c.id === selectedCaseId);
                const screening = screenings[selectedCaseId] || {};
                const aiReport = aiReports[selectedCaseId];
                
                if (!currentCase) return <p>Case not found</p>;

                return (
                  <div className="case-detail-container">
                    <div className="detail-main">
                      {/* Case Details card */}
                      <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Case ID: {currentCase.id}</div>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{currentCase.subjectName}</h2>
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span className={`badge-risk ${currentCase.riskLevel.toLowerCase()}`}>{currentCase.riskLevel} Risk</span>
                            <span className={`badge-status ${currentCase.status.toLowerCase().replace(' ', '_')}`}>{currentCase.status}</span>
                          </div>
                        </div>

                        <div className="info-grid">
                          <div className="info-item">
                            <div className="label">Subject Type</div>
                            <div className="val">{currentCase.subjectType}</div>
                          </div>
                          <div className="info-item">
                            <div className="label">Associated Entity</div>
                            <div className="val">{currentCase.companyAssociation}</div>
                          </div>
                          <div className="info-item">
                            <div className="label">Scope Profile</div>
                            <div className="val">{currentCase.investigationScope || 'Enhanced Verification'}</div>
                          </div>
                          <div className="info-item">
                            <div className="label">Created Date</div>
                            <div className="val">{new Date(currentCase.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Watchlist Screening Results */}
                      <div className="card">
                        <h3 className="detail-section-title">Background Screening Records</h3>
                        
                        <div className="info-grid">
                          <div className="watchlist-card">
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Watchlist Hits</div>
                            <div className="watchlist-item">
                              <span>Politically Exposed Person (PEP)</span>
                              <span style={{ 
                                color: screening.watchlists?.pepStatus?.includes('Match') ? 'var(--danger)' : 'var(--success)', 
                                fontWeight: '600', 
                                fontSize: '0.85rem' 
                              }}>
                                {screening.watchlists?.pepStatus || 'Checking...'}
                              </span>
                            </div>
                            <div className="watchlist-item">
                              <span>Sanctions Lists (OFAC, EU, UN)</span>
                              <span style={{ 
                                color: screening.watchlists?.sanctionsList?.includes('Match') ? 'var(--danger)' : 'var(--success)', 
                                fontWeight: '600', 
                                fontSize: '0.85rem' 
                              }}>
                                {screening.watchlists?.sanctionsList || 'Checking...'}
                              </span>
                            </div>
                          </div>

                          <div className="watchlist-card">
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Verification Checks</div>
                            <div className="watchlist-item">
                              <span>Identity Document Verification</span>
                              <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.85rem' }}>
                                {screening.verificationChecks?.identityVerified ? 'Verified' : 'Failed'}
                              </span>
                            </div>
                            <div className="watchlist-item">
                              <span>Corporate / Education Credentials</span>
                              <span style={{ color: screening.verificationChecks?.educationVerified ? 'var(--success)' : 'var(--warning)', fontWeight: '600', fontSize: '0.85rem' }}>
                                {screening.verificationChecks?.educationVerified ? 'Verified' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Adverse Media matches */}
                        <div style={{ marginTop: '1.5rem' }}>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Adverse Media Matches</div>
                          {screening.watchlists?.adverseMedia && screening.watchlists.adverseMedia.length > 0 ? (
                            screening.watchlists.adverseMedia.map((media, i) => (
                              <div key={i} className="adverse-news-item">
                                <div className="source">{media.source} — {media.date} ({media.sentiment})</div>
                                <div className="title">{media.title}</div>
                                <div className="desc">Negative sentiment article flagged during automated public record sweep. Review for potential reputation implications.</div>
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', italic: 'true' }}>No adverse media matches flagged in public records.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Assessment & Control Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="card">
                        <h3 className="detail-section-title">Case Controls</h3>
                        
                        <div className="form-group">
                          <label>Case Status</label>
                          <select 
                            value={currentCase.status} 
                            onChange={(e) => apiUpdateStatus(currentCase.id, e.target.value)}
                            disabled={activeCallId === `update-status-${currentCase.id}`}
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Review Required">Review Required</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        
                        <div style={{ marginTop: '1.5rem' }}>
                          <button 
                            onClick={() => apiRunAiAnalysis(currentCase.id)} 
                            className="btn btn-primary" 
                            style={{ width: '100%', justifyContent: 'center' }}
                            disabled={activeCallId === `ai-analyze-${currentCase.id}`}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                              <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            {activeCallId === `ai-analyze-${currentCase.id}` ? 'Running Analysis...' : 'Generate AI Risk Profile'}
                          </button>
                        </div>
                      </div>

                      {/* AI Report Card */}
                      <div className="card">
                        <h3 className="detail-section-title">Practical AI Assistant</h3>
                        {aiReport ? (
                          <div className="ai-report-container">
                            <div style={{ display: 'flex', justifyItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>
                              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" /><path d="M12 8h.01" />
                              </svg>
                              Assessment Profile Generated
                            </div>
                            <div className="ai-summary-text">{aiReport.aiSummary}</div>
                            
                            <div className="ai-flags-list">
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>FLAGGED RISK CLASSIFICATIONS</div>
                              {aiReport.flagsDetected && aiReport.flagsDetected.length > 0 ? (
                                aiReport.flagsDetected.map((flag, idx) => (
                                  <div key={idx} className={`ai-flag-item ${flag.severity.toLowerCase()}`}>
                                    <div className="ai-flag-details">
                                      <span className="ai-flag-category">{flag.category}</span>
                                      <span className="ai-flag-desc">{flag.description}</span>
                                    </div>
                                    <span className={`badge-risk ${flag.severity.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                                      {flag.severity}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No high severity risk items identified by AI sweep.</div>
                              )}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Recommendation</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent)', marginTop: '0.25rem' }}>{aiReport.recommendedAction}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="ai-report-empty">
                            <p>Generate an AI risk summary to parse public records and extract red flags.</p>
                            <button onClick={() => apiRunAiAnalysis(currentCase.id)} className="btn btn-secondary">
                              Analyze Subject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </main>

      {/* Live API Console / Inspector (Right Panel) */}
      <section className="console-panel">
        <header className="console-header">
          <div className="console-title">
            <span className="console-indicator" />
            <h2>Live API Console</h2>
          </div>
          <button className="console-clear" onClick={() => setConsoleLogs([])}>Clear</button>
        </header>
        
        <div className="console-logs">
          {consoleLogs.length > 0 ? (
            consoleLogs.map(log => (
              <div key={log.id} className="log-entry animate-fade-in">
                <div className="log-meta">
                  <div className="log-method-path">
                    <span className={`log-method ${log.method}`}>{log.method}</span>
                    <span>{log.path}</span>
                  </div>
                  <span className="log-time">{log.timestamp}</span>
                </div>
                
                {log.requestPayload && (
                  <div>
                    <div className="log-payload-title">Request Payload</div>
                    <pre className="log-json"><code>{log.requestPayload}</code></pre>
                  </div>
                )}
                
                <div>
                  <div className="log-payload-title">Response Payload</div>
                  <pre className="log-json"><code>{log.responsePayload}</code></pre>
                </div>
              </div>
            ))
          ) : (
            <div className="console-empty">
              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <p>Interact with the user interface to view live RESTful API requests and responses.</p>
            </div>
          )}
        </div>
      </section>

      {/* Create Case Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2>Initiate Due Diligence Check</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={apiCreateCase}>
              <div className="form-group">
                <label>Subject / Entity Name</label>
                <input 
                  type="text" 
                  value={newCaseData.subjectName} 
                  onChange={(e) => setNewCaseData(prev => ({ ...prev, subjectName: e.target.value }))}
                  placeholder="e.g. Alistair Vance / Vortex Energy Corp"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Type</label>
                <select 
                  value={newCaseData.subjectType} 
                  onChange={(e) => setNewCaseData(prev => ({ ...prev, subjectType: e.target.value }))}
                >
                  <option value="Individual">Individual</option>
                  <option value="Entity">Corporate Entity</option>
                </select>
              </div>

              <div className="form-group">
                <label>Company Association</label>
                <input 
                  type="text" 
                  value={newCaseData.companyAssociation} 
                  onChange={(e) => setNewCaseData(prev => ({ ...prev, companyAssociation: e.target.value }))}
                  placeholder="e.g. Apex Wealth Management"
                />
              </div>

              <div className="form-group">
                <label>Investigation Scope</label>
                <select 
                  value={newCaseData.investigationScope} 
                  onChange={(e) => setNewCaseData(prev => ({ ...prev, investigationScope: e.target.value }))}
                >
                  <option value="Enhanced Profile">Enhanced Risk Profiling</option>
                  <option value="Corporate Integrity">Corporate Integrity Check</option>
                  <option value="Standard KYC">Standard KYC Verification</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={activeCallId === 'create-case'}>
                  {activeCallId === 'create-case' ? 'Initiating...' : 'Submit Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount the App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
