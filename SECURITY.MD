# Security Policy

## Overview

SharkEyes is a security-focused service designed to protect web forms and applications from automated abuse and bots.  
This document describes our approach to security, data handling, and responsible vulnerability disclosure.

Security and privacy are core design principles of SharkEyes.

---

## Security Architecture

### Client-Side Security

SharkEyes uses a lightweight client-side script to collect **non-invasive behavioral and environment signals** strictly for bot detection purposes.

**Key principles:**
- No access to sensitive form values or passwords
- No modification of page content outside the widget scope
- Operates within standard browser sandbox and security policies
- All logic decisions are performed server-side

**Data Transmission**
- All requests are sent over HTTPS (TLS)
- No data is transmitted in plain text
- Tokens are generated server-side and are short-lived
- Requests are protected against tampering

---

### Server-Side Security

**Verification Logic**
- All risk analysis and decisions run exclusively on the server
- Tokens are single-use and time-limited

**API Protections**
- Rate limiting and abuse prevention
- Input validation and sanitization
- Stateless verification design

---

## Data Collection & Privacy

### What Data Is Collected

SharkEyes collects **temporary technical and behavioral signals** during a single verification session, including:

- Browser and rendering engine type
- Automation indicators (e.g. `navigator.webdriver`)
- Interaction patterns (mouse movement timing, clicks, key events)
- Touch and input activity counters
- Screen and viewport metadata
- WebGL renderer information (when available)
- Detection of common automation frameworks

> **Important:** SharkEyes does **not** collect or read actual user input values.

---

### What We Do NOT Collect

SharkEyes explicitly does **not** collect:

- ❌ Passwords or form field values  
- ❌ Personally identifiable information (PII)  
- ❌ Cookie contents or localStorage data  
- ❌ Browsing history  
- ❌ Cross-site tracking identifiers  

---

### Data Retention

**Zero persistent storage**

- Verification data exists only in memory during analysis
- No behavioral data is written to databases
- No session data is logged
- No long-term user profiling

All verification-related data is **discarded immediately** after a decision is returned.

---

## Responsible Disclosure

We welcome security researchers and users to report vulnerabilities responsibly.

### Reporting a Vulnerability

Please report security issues to:

**sharkeyes.dev/report/**

Include:
1. Description of the issue
2. Steps to reproduce
3. Potential impact
4. Proof-of-concept (non-destructive)
5. Contact information

---

### Disclosure Rules

Please do **not**:
- Publicly disclose vulnerabilities before a fix
- Exploit issues beyond proof-of-concept
- Access or attempt to access user data

---

### Response Timeline

| Severity | Expected Response |
|--------|------------------|
| Critical | 24–48 hours |
| High | 3–7 days |
| Medium | 14–30 days |
| Low | Best-effort |

---

## Security Updates

- Critical issues are patched immediately
- Security fixes are deployed without delay
- Users are encouraged to always use the latest version

---

## Limitations

While SharkEyes significantly reduces automated abuse, no solution is perfect.

Known limitations include:
- Advanced human-like bots may bypass detection
- Browser extensions may interfere with signals
- False positives are possible in rare cases

---

## Compliance

- GDPR-friendly by design (no personal data storage)
- No data resale or tracking
- Data Processing Agreement available for enterprise customers upon request

---

## Contact

For security-related questions or concerns:

📧 **sharkeyes.dev/report/**

---

_Last updated: January 2026_
