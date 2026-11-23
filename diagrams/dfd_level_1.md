# Data Flow Diagram – Level 1
## Campus Lost and Found Management System

### 1. Introduction

The Level 1 Data Flow Diagram decomposes the main system process into five major subprocesses. It illustrates the flow of information between students, college staff, administrators, internal processes and data stores.

### 2. DFD Level 1 Diagram

```mermaid
flowchart TB

    %% EXTERNAL ENTITIES
    STUDENT["STUDENT"]
    STAFF["COLLEGE STAFF"]
    ADMIN["ADMINISTRATOR"]

    %% SYSTEM PROCESSES
    P1(["1.0 User Authentication"])
    P2(["2.0 Manage Item Reports"])
    P3(["3.0 Search and Filter Items"])
    P4(["4.0 Manage Ownership Claims"])
    P5(["5.0 Administration and Verification"])

    %% DATA STORES
    D1[("D1: User Database")]
    D2[("D2: Item Database")]
    D3[("D3: Claim Database")]

    %% AUTHENTICATION FLOWS
    STUDENT -->|"Registration / Login Details"| P1
    STAFF -->|"Login Details"| P1
    ADMIN -->|"Login Details"| P1

    P1 -->|"Authentication Result"| STUDENT
    P1 -->|"Authentication Result"| STAFF
    P1 -->|"Authentication Result"| ADMIN

    P1 <-->|"User Information"| D1

    %% ITEM REPORTING FLOWS
    STUDENT -->|"Lost / Found Item Details"| P2
    STAFF -->|"Found Item Details"| P2

    P2 -->|"Item Records"| D2
    D2 -->|"Stored Item Information"| P2

    P2 -->|"Report Submission Confirmation"| STUDENT
    P2 -->|"Report Submission Confirmation"| STAFF

    %% SEARCH FLOWS
    STUDENT -->|"Search Criteria and Filters"| P3
    P3 <-->|"Item Information"| D2
    P3 -->|"Search Results and Item Listings"| STUDENT

    %% CLAIM MANAGEMENT FLOWS
    STUDENT -->|"Ownership Claim Request"| P4
    P4 -->|"New Claim Details"| D3
    D3 -->|"Claim Information"| P4
    P4 -->|"Claim Details for Review"| P5

    P5 -->|"Claim Decision and Updated Status"| P4
    P4 -->|"Claim Status and Notification"| STUDENT

    %% ADMINISTRATION FLOWS
    ADMIN -->|"Review Decisions and Management Requests"| P5
    P5 <-->|"User Records"| D1
    P5 <-->|"Item Records and Status"| D2
    P5 <-->|"Claim Records"| D3

    P5 -->|"User Records, Item Reports and Claim Details"| ADMIN
    P5 -->|"Operation Confirmation and Status Updates"| ADMIN

    %% STAFF VERIFICATION
    STAFF -->|"Item Verification Information"| P5
    P5 -->|"Verification Updates"| STAFF

    %% STYLING
    style STUDENT fill:#DCEEFF,stroke:#1565C0,color:#123B65
    style STAFF fill:#DFF5E5,stroke:#2E7D32,color:#174D22
    style ADMIN fill:#FFF0D9,stroke:#EF6C00,color:#713900

    style P1 fill:#E8EAF6,stroke:#3949AB,color:#1A237E
    style P2 fill:#E8EAF6,stroke:#3949AB,color:#1A237E
    style P3 fill:#E8EAF6,stroke:#3949AB,color:#1A237E
    style P4 fill:#E8EAF6,stroke:#3949AB,color:#1A237E
    style P5 fill:#E8EAF6,stroke:#3949AB,color:#1A237E

    style D1 fill:#FFF3E0,stroke:#EF6C00,color:#713900
    style D2 fill:#FFF3E0,stroke:#EF6C00,color:#713900
    style D3 fill:#FFF3E0,stroke:#EF6C00,color:#713900
```

### 3. Process Descriptions

**1.0 User Authentication**

Handles registration and login requests from students, college staff and administrators. User information is checked against the User Database.

**2.0 Manage Item Reports**

Receives lost and found item information, processes submissions and stores item records in the Item Database.

**3.0 Search and Filter Items**

Accepts search criteria and filters from students, retrieves matching item information and displays the results.

**4.0 Manage Ownership Claims**

Receives ownership claim requests, stores claim details and coordinates with the administration process for claim decisions.

**5.0 Administration and Verification**

Allows administrators to review users, item reports and claims. It processes verification decisions and updates relevant records and statuses.

### 4. Data Store Descriptions

| Data Store | Information Stored |
|---|---|
| D1 – User Database | User IDs, names, email addresses, roles and login information |
| D2 – Item Database | Item IDs, descriptions, categories, locations, dates and statuses |
| D3 – Claim Database | Claim IDs, user IDs, item IDs, claim details and decisions |

### 5. Conclusion

The Level 1 DFD provides a more detailed representation of the Campus Lost and Found Management System. It explains the major internal processes and their interaction with external entities and data stores.
```

### Step 3 — Visualise it

1. Open [Mermaid Live Editor](https://mermaid.live/).
2. Copy only the code inside the `mermaid` section.
3. Paste it into the left editor.
4. Check the rendered diagram on the right.
5. Export it as PNG.

Save the image as:

`DFD_Level_1.png`

inside your `diagrams/` folder.

### Step 4 — Expected folder structure

```text
diagrams/
├── README.md
├── architecture.md
├── Architecture Diagram.png
├── dfd_level_0.md
├── DFD_Level_0.png
├── dfd_level_1.md
└── DFD_Level_1.png
```

**Important:** Before pushing to GitHub, send me a screenshot of the rendered Level 1 diagram. I'll check the process flows, database connections and consistency with Level 0. Then we'll commit it and update Jira.