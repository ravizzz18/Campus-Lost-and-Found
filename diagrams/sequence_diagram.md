# UML Sequence Diagram
## Campus Lost and Found Management System
### Use Case: Ownership Claim Management

## 1. Introduction

The UML Sequence Diagram illustrates the interaction between the student, frontend application, backend services, database and administrator during the ownership claim process.

It represents the sequence of messages exchanged during claim submission, validation, administrative review and status notification.


# UML Sequence Diagram
## Campus Lost and Found Management System
### Use Case: Ownership Claim Management

```mermaid
sequenceDiagram
    autonumber

    actor Student
    participant Frontend as React Frontend
    participant Backend as FastAPI Backend
    participant DB as SQLite Database
    actor Admin as Administrator
    participant Notify as Notification System

    Student->>Frontend: Open item details
    Frontend->>Backend: Request item information
    Backend->>DB: Retrieve item details
    DB-->>Backend: Return item information
    Backend-->>Frontend: Send item details
    Frontend-->>Student: Display item information

    Student->>Frontend: Submit ownership claim
    Frontend->>Backend: Send claim request
    Backend->>Backend: Validate claim details

    alt Invalid or incomplete claim
        Backend-->>Frontend: Return validation error
        Frontend-->>Student: Display error message
    else Valid claim
        Backend->>DB: Retrieve user and item records
        DB-->>Backend: Return user and item information

        Backend->>DB: Save claim with Pending status
        DB-->>Backend: Confirm claim saved

        Backend-->>Frontend: Return submission confirmation
        Frontend-->>Student: Display claim submitted message

        Backend->>Admin: Notify administrator of new claim
        Admin->>Backend: Review claim details

        alt Claim approved
            Admin->>Backend: Submit approval decision
            Backend->>DB: Update claim status to Approved
            DB-->>Backend: Confirm status update
            Backend->>Notify: Send approval notification
            Notify-->>Student: Claim approved notification

        else Claim rejected
            Admin->>Backend: Submit rejection decision
            Backend->>DB: Update claim status to Rejected
            DB-->>Backend: Confirm status update
            Backend->>Notify: Send rejection notification
            Notify-->>Student: Claim rejected notification
        end

        Student->>Frontend: Check claim status
        Frontend->>Backend: Request claim status
        Backend->>DB: Retrieve updated claim
        DB-->>Backend: Return claim status
        Backend-->>Frontend: Send updated status
        Frontend-->>Student: Display final claim status
    end
```

## 3. Participant Descriptions

| Participant | Responsibility |
|---|---|
| Student | Submits an ownership claim and checks its status |
| React Frontend | Displays item details, claim forms and status information |
| FastAPI Backend | Validates requests and manages claim processing |
| SQLite Database | Stores user, item and claim information |
| Administrator | Reviews claims and submits approval or rejection decisions |
| Notification System | Communicates claim status updates to students |

## 4. Sequence Explanation

1. The student opens an item listing and views its details.
2. The student submits an ownership claim through the frontend.
3. The frontend sends the claim request to the FastAPI backend.
4. The backend validates the submitted information.
5. Invalid claims are returned with an error message.
6. Valid claims are checked against user and item records.
7. The backend stores the claim with Pending status.
8. The administrator receives and reviews the claim.
9. The administrator approves or rejects the claim.
10. The backend updates the claim status in the database.
11. The notification system communicates the decision to the student.
12. The student can view the updated claim status.

## 5. Alternate and Error Flows

### A. Invalid Claim Submission
If the submitted claim information is incomplete or invalid, the backend returns a validation error and the frontend displays an appropriate message.

### B. Approved Claim
If the administrator approves the request, the claim status is updated to Approved and the student receives an approval notification.

### C. Rejected Claim
If the administrator rejects the request, the claim status is updated to Rejected and the student receives a rejection notification.

## 6. State Transitions

The ownership claim follows these states:

- Pending: Claim submitted and awaiting administrator review.
- Approved: Administrator has accepted the ownership claim.
- Rejected: Administrator has declined the ownership claim.

The claim begins in Pending state and transitions to either Approved or Rejected after administrative review.

## 7. Conclusion

The UML Sequence Diagram describes the time-ordered interactions involved in ownership claim management. It demonstrates normal processing, validation errors, administrator decisions and claim status updates.