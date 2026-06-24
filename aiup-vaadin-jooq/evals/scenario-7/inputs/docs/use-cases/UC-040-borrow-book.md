# UC-040: Borrow Book

**Use Case ID:** UC-040
**Use Case Name:** Borrow Book
**Actor:** Library Member

## Description

A library member borrows a book from the library. The member provides their name and selects the desired book from the catalog. Upon successful submission, the system records the borrowing and notifies the member.

## Preconditions

- At least one book is available in the catalog.

## Main Success Scenario

1. The member opens the Borrow Book view.
2. The member enters their name in the Borrower Name field.
3. The member selects a book from the Book drop-down.
4. The member clicks Save.
5. The system records the borrowing.
6. The system displays a success notification.

## Alternative Flows

### A1: Missing Borrower Name

1. Member leaves the Borrower Name field empty and clicks Save.
2. The system marks the Borrower Name field as invalid.
3. The borrowing is not recorded.

### A2: No Book Selected

1. Member does not select a book and clicks Save.
2. The system marks the Book field as invalid.
3. The borrowing is not recorded.

## Business Rules

### BR-001

The Borrower Name field is mandatory.

### BR-002

A book must be selected before the borrowing can be saved.
