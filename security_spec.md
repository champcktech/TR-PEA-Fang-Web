# Security Specification & Payload-First Verification

## 1. Data Invariants
1. **Unauthenticated Read-Only Access**: Guests (`request.auth == null`) and non-allowlisted users can only `get` and `list` valid `/workLinks/{linkId}` documents to view and click links on the 2D Mini-Map; all writes are denied.
2. **Strict Login Allowlist (`isAuthorizedEditor`)**: Only verified accounts whose lowercase email is `champ5698@gmail.com` (super-admin) OR explicitly listed in `/authorizedEditors/{editorEmail}` can create, update, or delete `/workLinks/{linkId}`.
3. **PII Isolation on `/authorizedEditors`**: Regular signed-in users cannot `list` `/authorizedEditors` or `get` another user's email document; they can only `get` their own document ID (`request.auth.token.email.lower() == editorEmail`) to verify access. Only `champ5698@gmail.com` can list, add, or remove authorized editor emails.
4. **Immutable Audit Trail & Server Timestamps**: `createdBy` and `createdAt` cannot change after creation, and `createdAt`/`updatedAt` must equal `request.time`.
5. **Strict Schema & Boundary Enforcement**: All strings enforce `.size()` bounds, `zoneId` is allowlisted to the 7 stations, `url` matches `^https?://.+`, and `keys().hasOnly(...)` blocks shadow fields.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: `PERMISSION_DENIED`)
1. Unauthenticated `create`/`update`/`delete` on `/workLinks`.
2. Random signed-in Gmail user (`stranger@gmail.com` NOT in `/authorizedEditors`) attempting `create`, `update`, or `delete` on `/workLinks`.
3. Random signed-in Gmail user attempting `list` on `/authorizedEditors` to scrape staff emails.
4. Random signed-in Gmail user attempting `get` on `/authorizedEditors/other@gmail.com`.
5. Non-super-admin authorized editor attempting to `create` or `delete` `/authorizedEditors/friend@gmail.com`.
6. Unverified email (`email_verified == false`) spoofing `champ5698@gmail.com`.
7. Shadow field injection (`{ isOfficial: true }`) in `/workLinks`.
8. Invalid `zoneId` enum outside the 7 stations.
9. `javascript:alert(1)` URL injection failing `^https?://.+`.
10. Backdated client timestamp (`createdAt != request.time`).
11. Identity spoofing (`createdBy != request.auth.uid`).
12. Mismatched `email` field vs `editorEmail` document ID in `/authorizedEditors`.
