# Module: jobs/email.job.js (Stub)

**File**: `src/jobs/email.job.js`  
**Status**: Stub — not yet implemented  

## Planned Features

| Feature | Status | Notes |
|---|---|---|
| Email sending (SMTP) | Pending | Would use `nodemailer` or similar |
| Password reset email | Pending | Called by `auth.forgotPassword()` in controller |
| Verification email | Pending | Called after user registration |
| Scheduled job runner | Pending | Cron-based job scheduling |

## Integration Points

This module is **not imported** anywhere in the current codebase. When implemented, it would be wired into:

1. `auth.controller.forgotPassword` — send reset password email
2. `auth.service.register` — send verification email after user creation
3. Cron/scheduler — periodic cleanup of expired tokens

## TODO for Implementation

- [ ] Add `nodemailer` dependency
- [ ] Use SMTP config from `env.config.email` 
- [ ] Create email templates (HTML + plain text)
- [ ] Implement job queue (bull/redis or simple interval-based)
- [ ] Add retry logic for transient SMTP failures
