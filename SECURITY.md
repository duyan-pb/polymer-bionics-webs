# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | Yes       |

## Reporting a Vulnerability

We take the security of Polymer Bionics Website seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of these methods:

1. **GitHub Security Advisories**: Use the [Security tab](https://github.com/duyan-pb/polymer-bionics-webs/security/advisories) to privately report a vulnerability.

2. **Email**: Send details to the repository maintainer.

### What to Include

Please include as much of the following information as possible:

- Type of issue (e.g., XSS, CSRF, injection, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Dependent on complexity

### What to Expect

1. We will acknowledge receipt of your report
2. We will investigate and validate the issue
3. We will work on a fix and coordinate disclosure
4. We will credit you (if desired) when the fix is released

## Security Measures

This project implements the following security measures:

### Automated Security Scanning

- **Dependabot**: Automated dependency updates for security patches
- **Dependency Review**: Blocks PRs with high-severity vulnerabilities
- **CodeQL Analysis**: Static code analysis for security vulnerabilities
- **Code Quality Workflow**: Continuous code quality metrics and analysis

### Best Practices

- All dependencies are regularly updated
- No secrets are stored in the repository
- Azure deployment uses OIDC authentication (no stored credentials)
- Content Security Policy headers are configured
- GDPR-compliant consent management for analytics
- Type-safe codebase with ≥95% type coverage

## Security-Related Configuration

### Azure Deployment

The application is deployed to Azure Web App using OpenID Connect (OIDC) federation, which means:

- No long-lived credentials are stored in GitHub Secrets
- Authentication tokens are short-lived and scoped
- All deployments are traceable to specific commits

## Thank You

We appreciate your help in keeping Polymer Bionics Website and its users safe!
