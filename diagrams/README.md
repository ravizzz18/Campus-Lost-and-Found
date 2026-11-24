
# System Design Diagrams

This directory contains the design diagrams for the Campus Lost and Found Management System.

## Architecture Diagram

The system follows a three-tier architecture:

1. Presentation Layer – React and TypeScript frontend.
2. Application Layer – Python and FastAPI backend.
3. Data Layer – SQLite database.

The architecture diagram illustrates the interaction between users, frontend components, backend modules and database entities.

### Files
- `architecture.md` – Editable Mermaid source.
- `architecture.png` – Rendered architecture diagram.

## DFD Level 0 – Context Diagram

The Level 0 Data Flow Diagram represents the Campus Lost and Found
Management System as a single process.

It identifies three external entities:
- Student
- College Staff
- Administrator

The diagram illustrates the exchange of registration details,
item reports, search requests, claim requests, verification updates
and notifications between the external entities and the system.

File: `DFD_Level_0.png`
Source: `dfd_level_0.md`

## DFD Level 1 – System Processes

The Level 1 Data Flow Diagram decomposes the Campus Lost and Found Management System into five major processes:

1. User Authentication
2. Manage Item Reports
3. Search and Filter Items
4. Manage Ownership Claims
5. Administration and Verification

The diagram also identifies three data stores:

- D1 – User Database
- D2 – Item Database
- D3 – Claim Database

It illustrates the flow of information between students, college staff, administrators, system processes and data stores.

**Files:**
- `dfd_level_1.md` – Mermaid source code
- `DFD_Level_1.png` – Rendered diagram

## DFD Level 2 – Ownership Claim Management

The Level 2 DFD expands Process 4.0 – Manage Ownership Claims into six subprocesses:

1. Receive Claim Request
2. Validate Claim Details
3. Retrieve User and Item Information
4. Create and Forward Claim for Review
5. Process Administrator Decision
6. Update Claim Status and Notify Student

The diagram illustrates claim validation, retrieval of user and item records, administrator review, database updates and communication of claim decisions.

**Files:**
- `dfd_level_2.md` – Mermaid source code
- `DFD_Level_2.png` – Rendered diagram

## UML Sequence Diagram – Ownership Claim Management

The UML Sequence Diagram illustrates the interaction between the student, React frontend, FastAPI backend, SQLite database, administrator and notification system.

It represents the ownership claim submission, validation, database storage, administrator review, approval or rejection, and student notification processes.

The diagram includes alternate flows for invalid claim submissions and administrator decisions.

**Files:**
- `sequence_diagram.md` – Editable Mermaid source.
- `UML_Sequence_Diagram.png` – Rendered sequence diagram.