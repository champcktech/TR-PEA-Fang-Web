# Security Specification & Payload-First Verification

## 1. Data Invariants
1. **Unauthenticated Read-Only Access**: Anonymous/unauthenticated visitors can `get` and `list` valid `/workLinks/{linkId}` documents to view and click links on the 2D Mini-Map, and are strictly denied all `create`, `update`, and `delete` operations.
2. **Verified Identity & Ownership**: Creating a `/workLinks/{linkId}` document requires `request.auth != null && request.auth.token.email_verified == true`, with `createdBy == request.auth.uid` and `updatedBy == request.auth.uid`.
3. **Immutable Audit Trail**: `createdBy` and `createdAt` cannot be modified after creation (`incoming().createdBy == existing().createdBy && incoming().createdAt == existing().createdAt`).
4. **Server-Authoritative Timestamps**: `createdAt` (on create) and `updatedAt` (on create and update) must equal `request.time`.
5. **Strict Schema & Boundary Enforcement**: All strings have explicit `.size()` limits, `zoneId` is allowlisted to the 6 valid station IDs, `url` must match `^https?://.+`, and `keys().hasOnly(...)` blocks any shadow/extra fields.
6. **Privilege Escalation Prevention**: Non-admin users cannot read `/admins` lists or write to `/admins/{userId}` to promote themselves.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: `PERMISSION_DENIED`)
1. **Unauthenticated Create**: `request.auth == null` attempting `create` on `/workLinks/link1`.
2. **Unauthenticated Update**: `request.auth == null` attempting `update` on `/workLinks/link1`.
3. **Unauthenticated Delete**: `request.auth == null` attempting `delete` on `/workLinks/link1`.
4. **Unverified Email Write**: `request.auth.token.email_verified == false` attempting `create` on `/workLinks/link2`.
5. **Identity Spoofing on Create**: Authenticated user (`uid: userA`) sending `createdBy: "userB"`.
6. **Shadow Field Injection**: Authenticated user sending extra field `{ isOfficial: true }` alongside valid fields.
7. **ID Poisoning**: Document ID containing invalid characters or >128 chars (`"../../../etc/passwd"`).
8. **Invalid Station Enum**: Sending `zoneId: "unknown-station"` outside the 6 allowlisted zones.
9. **XSS / Malicious Scheme URL**: Sending `url: "javascript:alert(1)"` failing `^https?://.+`.
10. **Client Timestamp Forgery**: Sending a backdated `createdAt` or `updatedAt` != `request.time`.
11. **Non-Owner / Non-Admin Mutation**: `userB` attempting to `update` or `delete` a link created by `userA`.
12. **Self-Admin Escalation**: Non-admin `userB` attempting `create` on `/admins/userB` with `{ role: "admin" }`.
