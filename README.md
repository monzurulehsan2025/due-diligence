# Veritas Risk - Due Diligence MVP Frontend

A premium, interactive background screening and risk assessment dashboard MVP.

This frontend compiles and runs purely in the browser using React 18, Babel Standalone, and custom HSL/glassmorphic CSS. It contains a built-in **Live API Console** on the right side of the screen that logs mock RESTful API network payloads in real-time as you click and navigate around the system.

## Setup and How to Run

Since the application is designed to be fully self-contained to run under strict sandboxed environment conditions:
1. Simply double-click on `index.html` to open it directly in any modern web browser via the `file://` protocol.
2. Alternatively, you can serve the directory using a simple local web server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node (if npm is configured)
   npx serve .
   ```
3. Open `http://localhost:8000` in your web browser.

---

## Simulated RESTful API Endpoints

Below are the detailed schemas, requests, and responses for the 5 RESTful API endpoints consumed by this frontend.

### 1. Retrieve Active Cases (`GET /api/cases`)
*   **Description**: Retrieves the list of active due diligence screening cases.
*   **HTTP Method**: `GET`
*   **Path**: `/api/cases`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**: None
*   **Response Payload**:
    ```json
    [
      {
        "id": "case_001",
        "subjectName": "Alistair Vance",
        "subjectType": "Individual",
        "companyAssociation": "Apex Wealth Management",
        "riskLevel": "High",
        "status": "In Progress",
        "createdAt": "2026-07-01T10:00:00Z",
        "investigationScope": "Enhanced Profile"
      },
      {
        "id": "case_002",
        "subjectName": "Vortex Energy Corp",
        "subjectType": "Entity",
        "companyAssociation": "N/A",
        "riskLevel": "Medium",
        "status": "Review Required",
        "createdAt": "2026-07-03T14:30:00Z",
        "investigationScope": "Corporate Integrity"
      }
    ]
    ```

### 2. Create Screening Case (`POST /api/cases`)
*   **Description**: Initiates a new background screening and risk investigation profile.
*   **HTTP Method**: `POST`
*   **Path**: `/api/cases`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "subjectName": "Eleanor Sterling",
      "subjectType": "Individual",
      "companyAssociation": "Nova Tech Ventures",
      "investigationScope": "Enhanced Profile"
    }
    ```
*   **Response Payload**:
    ```json
    {
      "id": "case_003",
      "subjectName": "Eleanor Sterling",
      "subjectType": "Individual",
      "companyAssociation": "Nova Tech Ventures",
      "riskLevel": "Low",
      "status": "In Progress",
      "createdAt": "2026-07-07T20:12:28.081Z",
      "investigationScope": "Enhanced Profile"
    }
    ```

### 3. Fetch Background Records (`GET /api/cases/:id/screening`)
*   **Description**: Fetches watchlist results (PEP matches, sanctions checks) and credential verifications for a specific case ID.
*   **HTTP Method**: `GET`
*   **Path**: `/api/cases/case_001/screening`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**: None
*   **Response Payload**:
    ```json
    {
      "caseId": "case_001",
      "watchlists": {
        "pepStatus": "Confirmed Match (Tier 2)",
        "sanctionsList": "No matches",
        "adverseMedia": [
          {
            "title": "Apex Wealth CEO Alistair Vance Investigated for Offshore Tax Avoidance",
            "source": "Financial Herald",
            "date": "2025-11-12",
            "sentiment": "Negative",
            "url": "#"
          }
        ]
      },
      "verificationChecks": {
        "identityVerified": true,
        "educationVerified": true,
        "employmentVerified": true
      }
    }
    ```

### 4. Trigger AI Risk Assessment (`POST /api/cases/:id/ai-analyze`)
*   **Description**: Integrates practical AI-based risk profiling to parse adverse media, analyze political connections, and provide review guidance.
*   **HTTP Method**: `POST`
*   **Path**: `/api/cases/case_001/ai-analyze`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "analysisDepth": "Deep Search",
      "focusAreas": [
        "Financial Crimes",
        "Political Exposure",
        "Sanctions"
      ]
    }
    ```
*   **Response Payload**:
    ```json
    {
      "caseId": "case_001",
      "aiSummary": "Subject Alistair Vance exhibits elevated political exposure risk through connections to foreign ministries. The adverse media match regarding offshore tax avoidance is highly relevant and requires senior-level review.",
      "flagsDetected": [
        {
          "severity": "High",
          "category": "Adverse Media",
          "description": "Tax avoidance investigation published by Financial Herald."
        },
        {
          "severity": "Medium",
          "category": "PEP Connection",
          "description": "Second-degree relation to Minister of Energy."
        }
      ],
      "recommendedAction": "Escalate to Compliance Committee"
    }
    ```

### 5. Update Investigation Status (`PUT /api/cases/:id/status`)
*   **Description**: Transitions a case status and updates the verification review workflow history.
*   **HTTP Method**: `PUT`
*   **Path**: `/api/cases/case_001/status`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "status": "Review Required",
      "notes": "User updated status to Review Required on the MVP Frontend UI dashboard."
    }
    ```
*   **Response Payload**:
    ```json
    {
      "caseId": "case_001",
      "status": "Review Required",
      "updatedAt": "2026-07-07T20:12:54.314Z",
      "notes": "User updated status to Review Required on the MVP Frontend UI dashboard."
    }
    ```
