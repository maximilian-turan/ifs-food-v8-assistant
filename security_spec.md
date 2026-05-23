# Security Specification - IFS Food v8 Assistant

## Data Invariants
1. An audit must always have an `ownerId` that matches the authenticated user's UID.
2. Requirement results can only be created/updated within an audit that the user owns.
3. The `status` of an audit can only be 'draft' or 'completed'.
4. Timestamps (`createdAt`, `updatedAt`) must be server-validated.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create an audit with someone else's `ownerId`.
2. **Privilege Escalation**: Attempt to read an audit belonging to another user.
3. **Shadow Field Injection**: Attempt to add an `isAdmin: true` field to a user profile.
4. **Orphaned Write**: Attempt to add a requirement result to a non-existent or unowned audit.
5. **ID Poisoning**: Use a 2KB string as an audit ID.
6. **Immutable Violation**: Attempt to change the `ownerId` of an existing audit.
7. **Status Bypass**: Attempt to set an invalid status like `approved`.
8. **Timestamp Spoofing**: Provide a manually crafted `createdAt` in the past.
9. **Type Validation Failure**: Send a number for the `companyName` string field.
10. **Resource Exhaustion**: Send a 1MB string in a comment field (rules should limit size).
11. **PII Breach**: Authenticated user trying to list all user emails.
12. **Relationship Breach**: Updating a requirement result after the audit is marked 'completed' (Terminal state locking).

## Test Cases
- `testIdentitySpoofing`: `setDoc(doc(db, 'audits', 'a1'), { ownerId: 'other' })` -> DENIED
- `testCrossUserRead`: `getDoc(doc(db, 'audits', 'otherAudit'))` -> DENIED
- `testTerminalLock`: `setDoc(doc(db, 'audits/a1/requirements', '1.1.1'), { ... })` where `audits/a1.status === 'completed'` -> DENIED
