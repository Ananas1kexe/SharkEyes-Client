# 🤝 Contributing to SharkEyes

Thank you for your interest in contributing to SharkEyes! We welcome contributions from the community and appreciate your help in making our bot detection solution better.

## 📝 How You Can Help

### 1. Documentation Improvements

Found a typo, unclear explanation, or missing information in our documentation?

**We'd love your help with:**
- Fixing typos and grammatical errors
- Improving code examples
- Adding translations
- Clarifying confusing sections
- Adding missing documentation
- Updating outdated information

**Where to look:**
- `README.md` - Main documentation
- `SECURITY.md` - Security policy
- Code comments in `src/sharkeyes-client.js`
- API documentation references

### 2. Bug Reports

Found a bug in the client script or API? Please let us know!

**Before submitting a bug report, please:**
- Check if the issue already exists in [GitHub Issues](https://github.com/sharkeyes/sharkeyes-client/issues)
- Verify you're using the latest version
- Try to reproduce the issue in a clean environment

**What to include in your bug report:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Browser and version information
- Console errors or screenshots (if applicable)
- Minimal code example demonstrating the issue

**Submit bug reports at:** [GitHub Issues](https://github.com/sharkeyes/sharkeyes-client/issues/new)

### 3. Feature Requests

Have an idea for a new feature or improvement?

**We'd love to hear about:**
- New widget customization options
- Additional language support
- Integration improvements
- Developer experience enhancements
- Performance optimizations

**Submit feature requests at:** [GitHub Issues](https://github.com/sharkeyes/sharkeyes-client/issues/new?labels=enhancement)

### 4. API Issues

Experiencing issues with the SharkEyes API?

**Common API issues:**
- Unexpected response codes
- Timeout errors
- Rate limiting problems
- Token generation failures
- Verification decision inconsistencies

**For API issues, please contact:** [api-support@sharkeyes.dev](mailto:api-support@sharkeyes.dev)

**Include in your report:**
- Sky ID from the failed request (if available)
- Timestamp of the issue
- Request/response details (without sensitive data)
- Your implementation details
- Frequency of occurrence

## 🐛 Reporting Security Vulnerabilities

**⚠️ IMPORTANT:** Please do NOT report security vulnerabilities through public GitHub issues.

For security issues, please follow our [Security Policy](SECURITY.md) and report to:
**[security@sharkeyes.dev](mailto:security@sharkeyes.dev)**

## 📋 Contribution Process

### For Documentation/Text Fixes

1. **Fork the repository**
   ```bash
   git clone https://github.com/sharkeyes/sharkeyes-client.git
   cd sharkeyes-client
   ```

2. **Create a branch**
   ```bash
   git checkout -b fix/documentation-typo
   ```

3. **Make your changes**
   - Edit the relevant `.md` files
   - Keep changes focused and minimal
   - Use clear, concise language

4. **Test your changes**
   - Preview markdown rendering
   - Check all links work
   - Verify code examples are correct

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "docs: fix typo in README installation section"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin fix/documentation-typo
   ```
   Then open a PR on GitHub

### For Code Changes

1. **Discuss first** - Open an issue to discuss your proposed changes
2. **Follow the same fork/branch/PR process** as above
3. **Keep changes focused** - One feature/fix per PR
4. **Test thoroughly** - Ensure your changes work across different browsers
5. **Update documentation** - If your code changes affect usage

## ✍️ Commit Message Guidelines

We follow conventional commit format:

```
type(scope): short description

Longer description if needed

Fixes #123
```

**Types:**
- `docs:` - Documentation changes
- `fix:` - Bug fixes
- `feat:` - New features
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Maintenance tasks

**Examples:**
```bash
docs: fix typo in README Quick Start section
fix: resolve widget rendering issue in Safari
feat: add Portuguese language support
docs(security): clarify data retention policy
```

## 🌍 Translation Contributions

Want to help translate SharkEyes into other languages?

**Current languages:**
- English (en)
- Russian (ru)
- Hebrew (he)

**To add a new language:**

1. Open an issue titled "Translation: [Language Name]"
2. We'll provide you with the text strings to translate
3. Submit translations via PR or email
4. We'll integrate them into the widget

**Needed translations:**
- Widget UI text
- Error messages
- Documentation (README, SECURITY)

## 💬 Communication Channels

### For Questions and Discussions
- **General questions:** [Discussions](https://github.com/sharkeyes/sharkeyes-client/discussions)
- **Bug reports:** [GitHub Issues](https://github.com/sharkeyes/sharkeyes-client/issues)
- **Feature requests:** [GitHub Issues (Enhancement)](https://github.com/sharkeyes/sharkeyes-client/issues/new?labels=enhancement)

### For Direct Contact
- **General support:** [support@sharkeyes.dev](mailto:support@sharkeyes.dev)
- **API issues:** [api-support@sharkeyes.dev](mailto:api-support@sharkeyes.dev)
- **Security issues:** [security@sharkeyes.dev](mailto:security@sharkeyes.dev)
- **Partnership inquiries:** [partners@sharkeyes.dev](mailto:partners@sharkeyes.dev)

## 📜 Code of Conduct

### Our Standards

We are committed to providing a welcoming and inclusive environment for everyone.

**Expected behavior:**
- ✅ Be respectful and considerate
- ✅ Use welcoming and inclusive language
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

**Unacceptable behavior:**
- ❌ Harassment or discriminatory language
- ❌ Trolling or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information
- ❌ Any conduct that could be considered inappropriate

### Enforcement

Violations of our code of conduct may result in:
1. Warning
2. Temporary ban from the repository
3. Permanent ban

**Report violations to:** [conduct@sharkeyes.dev](mailto:conduct@sharkeyes.dev)

## ⏱️ Response Times

We try to respond to all contributions and issues promptly:

| Type | Target Response Time |
|------|---------------------|
| Security issues | 48 hours |
| Bug reports | 3-5 business days |
| Feature requests | 5-7 business days |
| Documentation PRs | 2-3 business days |
| Questions/Discussions | 3-5 business days |

*Note: Response times may vary during holidays or high-volume periods.*

## 🎉 Recognition

Contributors who help improve SharkEyes will be:
- Listed in our `CONTRIBUTORS.md` file (with your permission)
- Mentioned in release notes for significant contributions
- Given credit in documentation you improve
- Invited to our contributors' channel for ongoing discussions

## 📄 License

By contributing to SharkEyes, you agree that your contributions will be licensed under the same license as the project. See [LICENSE](LICENSE) for details.

## 🙏 Thank You!

Every contribution, no matter how small, helps make SharkEyes better. Whether you're fixing a typo, reporting a bug, or suggesting a feature, we appreciate your time and effort.

**Questions about contributing?** Feel free to reach out at [support@sharkeyes.dev](mailto:support@sharkeyes.dev)

---

**Happy Contributing! 🦈**