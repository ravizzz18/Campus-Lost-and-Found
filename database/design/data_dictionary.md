# DATA DICTIONARY
## Campus Lost and Found Management System

## 1. Introduction

A Data Dictionary is a collection of definitions describing the data elements, data flows and data stores used in the Campus Lost and Found Management System.

It provides a common understanding of the information processed and stored by the system.

This Data Dictionary is prepared based on the system's DFD Level 0, Level 1 and Level 2 diagrams.

---

## 2. Data Store Definitions

### D1 - User Database

Stores information about students, college staff and administrators registered in the system.

| Field Name | Data Type | Key | Description |
|---|---|---|---|
| user_id | Integer | PK | Unique identifier for each user |
| full_name | Varchar(100) | - | Full name of the user |
| email | Varchar(150) | Unique | User's email address |
| password_hash | Varchar(255) | - | Securely stored password hash |
| role | Varchar(20) | - | User role: Student, Staff or Administrator |
| created_at | Datetime | - | Account creation date and time |

### D2 - Item Database

Stores information about lost and found items reported by users.

| Field Name | Data Type | Key | Description |
|---|---|---|---|
| item_id | Integer | PK | Unique identifier for each item |
| user_id | Integer | FK | ID of the user who submitted the report |
| item_name | Varchar(100) | - | Name of the lost or found item |
| description | Text | - | Detailed description of the item |
| category | Varchar(50) | - | Category of the reported item |
| location | Varchar(150) | - | Location where the item was lost or found |
| report_type | Varchar(10) | - | Indicates Lost or Found |
| report_date | Date | - | Date of the incident or report |
| image_path | Varchar(255) | - | File path or reference to the item image |
| status | Varchar(20) | - | Current status of the reported item |

### D3 - Claim Database

Stores ownership claim requests and their review information.

| Field Name | Data Type | Key | Description |
|---|---|---|---|
| claim_id | Integer | PK | Unique identifier for each claim |
| item_id | Integer | FK | ID of the item being claimed |
| user_id | Integer | FK | ID of the user submitting the claim |
| claim_details | Text | - | Information provided to establish ownership |
| claim_date | Datetime | - | Date and time the claim was submitted |
| claim_status | Varchar(20) | - | Pending, Approved or Rejected |
| reviewed_by | Integer | FK | ID of the administrator reviewing the claim |
| review_date | Datetime | - | Date and time of the review |

---

## 3. Data Element Definitions

| Data Element | Description | Example |
|---|---|---|
| User ID | Unique user identification number | 101 |
| Full Name | Registered user's full name | Rahul Sharma |
| Email | Registered email address | student@example.com |
| User Role | Type of registered user | Student |
| Item ID | Unique item identification number | 205 |
| Item Name | Name of the reported item | Black Wallet |
| Category | Classification of the item | Accessories |
| Location | Campus location associated with the item | Library |
| Report Type | Type of item report | Lost |
| Item Status | Current status of the reported item | Open |
| Claim ID | Unique claim identification number | 301 |
| Claim Status | Current ownership claim decision status | Pending |

---

## 4. Data Flow Definitions

| Data Flow | Source | Destination | Description |
|---|---|---|---|
| Registration Details | Student | User Authentication | Information submitted to create an account |
| Login Details | Student / Staff / Administrator | User Authentication | Credentials submitted for authentication |
| Authentication Result | User Authentication | User | Result of the login or registration process |
| Lost / Found Item Details | Student / Staff | Manage Item Reports | Information about lost or found belongings |
| Search Criteria | Student | Search and Filter Items | Keywords and filters used to find items |
| Search Results | Search and Filter Items | Student | Matching item records returned by the system |
| Ownership Claim Request | Student | Manage Ownership Claims | Request to establish ownership of an item |
| Claim Details for Review | Manage Ownership Claims | Administration and Verification | Claim information submitted for administrative review |
| Claim Decision | Administration and Verification | Manage Ownership Claims | Administrator's approval or rejection decision |
| Claim Status | Manage Ownership Claims | Student | Updated status of the ownership claim |
| Item Status Update | Administrator | Administration and Verification | Request to update an item's status |

---

## 5. Data Validation and Constraints

| Data Element | Validation Rule |
|---|---|
| User ID | Must be unique and automatically generated |
| Full Name | Cannot be empty |
| Email | Must follow a valid email format and be unique |
| Password | Must be securely hashed before storage |
| User Role | Must be Student, Staff or Administrator |
| Item ID | Must be unique and automatically generated |
| Item Name | Cannot be empty |
| Report Type | Must be Lost or Found |
| Item Status | Must be Open, Claimed, Recovered or Closed |
| Claim ID | Must be unique and automatically generated |
| Claim Status | Must be Pending, Approved or Rejected |
| User ID in Item Database | Must reference an existing user |
| User ID in Claim Database | Must reference an existing user |
| Item ID in Claim Database | Must reference an existing item |
| Reviewed By | Must reference an existing administrator account |

---

## 6. Relationships Between Data Stores

1. A user can submit multiple lost or found item reports.
2. Each item report is associated with the user who submitted it.
3. A user can submit multiple ownership claims.
4. Each claim is associated with a specific item and user.
5. An administrator reviews claims and records the decision.
6. The claim status is updated based on the administrator's decision.
7. The reviewed_by field identifies the administrator responsible for reviewing a claim.

### Relationship Summary

| Relationship | Type |
|---|---|
| User to Item | One-to-Many |
| User to Claim | One-to-Many |
| Item to Claim | One-to-Many |
| Administrator to Reviewed Claims | One-to-Many |

---

## 7. Key Definitions

- **PK (Primary Key):** A field that uniquely identifies each record in a database table.
- **FK (Foreign Key):** A field that references the primary key of another database table.
- **Unique:** A field that must contain a distinct value for every record.
- **Varchar:** A variable-length character data type.
- **Text:** A data type used for longer text descriptions.
- **Integer:** A whole-number data type.
- **Datetime:** Stores date and time information.

---

## 8. Conclusion

The Data Dictionary defines the data elements, data stores and data flows used in the Campus Lost and Found Management System.

It helps maintain consistency between system requirements, DFD diagrams and database design. It also provides a reference for developers during database implementation, testing and system integration.

**Note:** The data types, field definitions, relationships and status values represent the proposed logical database structure. They should be aligned with the actual database implementation before final deployment.