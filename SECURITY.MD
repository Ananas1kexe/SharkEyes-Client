# 🔐 Security Policy

## Overview

SharkEyes takes security seriously. This document outlines our security practices, vulnerability reporting process, and how we protect both our users and their end-users.

## 🛡️ Security Architecture

### Client-Side Security

**Code Integrity**
- All client code is open-source and auditable
- No obfuscation or hidden functionality
- Transparent data collection and transmission
- Minimal dependencies to reduce attack surface

**Data Transmission**
- All API requests use HTTPS/TLS encryption
- Server-side token generation with HttpOnly cookies
- No sensitive data transmitted in plain text
- Request signing to prevent tampering

**Browser Isolation**
- No access to sensitive user data (passwords, form values, cookies content)
- Operates in sandboxed browser context
- No ability to modify page content outside widget boundaries
- Respects browser security policies and CSP

### Server-Side Security

**Token Security**
- Server-generated tokens with cryptographic signatures
- Short-lived tokens (single-use per verification)
- HttpOnly cookies to prevent XSS attacks
- CSRF protection built-in

**API Security**
- Rate limiting to prevent abuse
- Request validation and sanitization
- No persistent storage of verification data
- Immediate data disposal after verification

**Decision Making**
- All verification logic runs server-side only
- Client cannot influence or bypass decisions
- Multi-factor risk assessment
- Machine learning model protected from reverse engineering

## 🔒 Privacy & Data Protection

### What We Collect
- Behavioral signals (mouse movements, click patterns, timing)
- Browser environment properties (for bot detection only)
- Session metadata (time on page, interaction counts)

### What We DON'T Collect
- ❌ Personal identifiable information (PII)
- ❌ Form input values or passwords
- ❌ Cookie content or localStorage data
- ❌ User browsing history
- ❌ IP addresses for tracking purposes
- ❌ Cross-site tracking data

### Data Lifecycle
1. **Collection**: Data collected in browser during session
2. **Transmission**: Encrypted transmission to API
3. **Analysis**: Real-time server-side analysis (< 1 second)
4. **Decision**: ALLOW/BLOCK decision returned
5. **Disposal**: **All data immediately deleted** after response

**Data Retention: ZERO**
- No databases store verification data
- No logs contain behavioral information
- No backups include session data
- Completely stateless verification process

## 🚨 Vulnerability Reporting

We appreciate the security research community's efforts to keep SharkEyes secure. If you discover a security vulnerability, please follow responsible disclosure practices.

### Reporting Process

**Please report security vulnerabilities to:** [security@sharkeyes.dev](mailto:security@sharkeyes.dev)

**Include in your report:**
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact assessment
4. Suggested fix (if available)
5. Your contact information for follow-up

**Please DO NOT:**
- ❌ Publicly disclose the vulnerability before we've addressed it
- ❌ Exploit the vulnerability beyond proof-of-concept
- ❌ Access or modify other users' data

### Response Timeline

| Stage | Timeline |
|-------|----------|
| **Initial Response** | Within 48 hours |
| **Vulnerability Assessment** | Within 5 business days |
| **Fix Development** | Severity-dependent (see below) |
| **Patch Deployment** | Severity-dependent (see below) |
| **Public Disclosure** | 90 days after fix, or by mutual agreement |

### Severity Levels

| Severity | Response Time | Examples |
|----------|---------------|----------|
| **Critical** | 24-48 hours | Remote code execution, authentication bypass, massive data leak |
| **High** | 3-7 days | XSS, CSRF, privilege escalation, bot detection bypass |
| **Medium** | 14-30 days | Information disclosure, minor authentication issues |
| **Low** | 30-90 days | Best practice violations, minor information leaks |

## 🏆 Security Recognition

We believe in recognizing researchers who help improve our security:

**Hall of Fame**
- Public acknowledgment on our website (with your permission)
- Direct communication channel with our security team
- Early access to new features

**Bug Bounty Program**
- Currently under development
- Will be announced on our website and security mailing list

## 🔍 Security Best Practices for Implementation

### For Developers Implementing SharkEyes

**1. HTTPS Only**
```html
<!-- ✅ GOOD: Secure connection -->
<script src="https://api.sharkeyes.dev/api/v1/widget.js"></script>

<!-- ❌ BAD: Insecure connection -->
<script src="http://api.sharkeyes.dev/api/v1/widget.js"></script>
```

**2. Content Security Policy**
```http
Content-Security-Policy: 
  script-src 'self' https://api.sharkeyes.dev;
  connect-src 'self' https://api.sharkeyes.dev;
```


**4. Rate Limiting**
- Implement server-side rate limiting on form endpoints
- Don't rely solely on client-side protection
- Use SharkEyes as one layer of defense

## 🛠️ Security Updates

### Update Policy
- **Critical vulnerabilities**: Immediate hotfix release
- **High severity**: Patch within 7 days
- **Medium/Low severity**: Included in next scheduled release

### Notification Channels
- Security mailing list: [security-announce@sharkeyes.dev](mailto:security-announce@sharkeyes.dev)
- GitHub Security Advisories
- Status page: [status.sharkeyes.dev](https://sharkeyes.dev/api-status)


### Version Support
| Version | Support Status | Security Updates |
|---------|---------------|------------------|
| Latest | ✅ Fully supported | Yes |
| Previous major | ⚠️ Limited support | Critical only |
| Older versions | ❌ Unsupported | No |

**Recommendation:** Always use the latest version from CDN or update your self-hosted files regularly.

## 🔬 Security Testing

### Our Testing Practices
- Regular security audits by third-party firms
- Automated vulnerability scanning
- Penetration testing on staging environments
- Code review for all changes
- Dependency vulnerability monitoring

### Testing the Integration
```bash
# Check for common security issues
npm audit

# Verify CSP headers
curl -I https://yoursite.com | grep -i content-security-policy

# Test HTTPS enforcement
curl -I http://yoursite.com # Should redirect to HTTPS
```

## 📋 Compliance

### Standards & Regulations
- **GDPR Compliant**: No personal data storage or processing
- **CCPA Compliant**: No data sales or cross-site tracking
- **SOC 2 Type II**: Audit in progress
- **ISO 27001**: Certification planned for 2026

### Data Processing Agreement
- Available upon request for enterprise customers
- Clearly defines data handling responsibilities
- Zero data retention clause

## 🚧 Known Limitations

We believe in transparency about our security limitations:

1. **Client-Side Collection**: While data collection happens client-side, all decisions are server-side
2. **Network Security**: Requires HTTPS; vulnerable if deployed over HTTP
3. **Browser Extensions**: Cannot detect all browser extensions that may interfere
4. **Advanced Bots**: Sophisticated bots with human-like behavior may bypass detection
5. **False Positives**: Legitimate users with unusual browser configurations may be flagged

**Mitigation**: Use SharkEyes as one layer in a defense-in-depth strategy, not as the sole security measure.

**Urgent Security Issues:**
- Use "URGENT SECURITY" in email subject
- Include clear proof-of-concept (without exploiting production systems)
- We prioritize active exploitation or critical vulnerabilities

## 🔗 Additional Resources

- [Privacy Policy](https://sharkeyes.dev/trust/privacy)
- [Terms of Service](https://sharkeyes.dev/trust/terms)
- [API Documentation](https://docs.sharkeyes.dev/docs/)
- [Integration Guide](https://docs.sharkeyes.dev/docs/)
- [Status Page](https://sharkeyes.dev/api-status/)

---

**Last Updated:** January 2026  
**Policy Version:** 1.0  

**Questions?** Contact us at [security@sharkeyes.dev](mailto:security@sharkeyes.dev)

---

*SharkEyes is committed to protecting the security and privacy of all users. This policy is regularly reviewed and updated to reflect current best practices.*