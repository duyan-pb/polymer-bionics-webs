# Repository TODO List

> Comprehensive audit of all placeholders, TODOs, and improvement opportunities.

## Table of Contents

- [🔴 Critical: Placeholder Content](#-critical-placeholder-content)
- [🟡 Configuration Required](#-configuration-required)
- [🟢 Feature Enhancements](#-feature-enhancements)
- [📦 Dependencies & Build](#-dependencies--build)

---

## 🔴 Critical: Placeholder Content

These files contain placeholder data that **must** be replaced with real content for production.

### Team Data ([src/lib/team-data.ts](src/lib/team-data.ts))

All 10 team members have placeholder fields:

| Team Member | Role | Missing Fields |
| ----------- | ---- | -------------- |
| Prof Rylie Green | Co-Founder & CSO | shortBio, fullBio, education, achievements, publications, scholar URL, linkedin URL |
| Ben Green | Co-Founder & Managing Director | shortBio, fullBio, education, achievements, publications, linkedin URL |
| Dr Alexey Novikov | Design Engineer / Research, Design & Innovation | shortBio, fullBio, education, achievements, publications, linkedin URL |
| Dr Estelle Cuttaz | Design Engineer / Product Development & Engineering | shortBio, fullBio, education, achievements, publications, scholar URL, linkedin URL |
| Dr Joe Goding | Head of R&D / Research, Design & Innovation | shortBio, fullBio, education, achievements, publications, scholar URL, linkedin URL |
| Olivia Cauvi | Project Manager / Management | shortBio, fullBio, education, achievements, publications, linkedin URL |
| Dr Robert Toth | Senior Electrical Engineer / Product Development & Engineering | shortBio, fullBio, education, achievements, publications, scholar URL, linkedin URL |
| Efe Sen | Research Engineer / Product Development & Engineering | shortBio, fullBio, education, achievements, publications, linkedin URL |
| Duy An Tran | Software Engineer / Product Development & Engineering | shortBio, fullBio, education, achievements, publications, linkedin URL |

**Action Required:**

- [ ] Add real biographies for each team member
- [ ] Add education credentials (degree, university, year)
- [ ] List professional achievements
- [ ] Add publications (for research staff)
- [ ] Update Google Scholar and LinkedIn URLs

---

### Materials Data ([src/lib/materials-data.ts](src/lib/materials-data.ts))

**Materials (3 items):**

| Material | Placeholder Fields |
| -------- | ----------------- |
| BionGel | description, properties (3), keyAdvantages (3), technicalDetails |
| ElastiBion | description, properties (3), keyAdvantages (3), technicalDetails |
| ElastiSolder | description, properties (3), keyAdvantages (3), technicalDetails |

**Applications (9 items):**

| Application | Placeholder Fields |
| ----------- | ----------------- |
| ElastiCuff | description, benefits (3), useCases (3) |
| ElastArray | description, benefits (3), useCases (3) |
| ElastiWire | description, benefits (3), useCases (3) |
| SimplEEG | description, benefits (3), useCases (3) |
| BabEEG | description, benefits (3), useCases (3) |
| InEar EEG | description, benefits (3), useCases (3) |
| Sport EEG | description, benefits (3), useCases (3) |
| Customer-Specific Applications | description, benefits (3), useCases (3) |

**Action Required:**

- [ ] Write technical descriptions for each material
- [ ] Add real material properties with units/values
- [ ] Document competitive advantages
- [ ] Write clinical application descriptions
- [ ] Add specific use cases and benefits

---

### Product Data ([src/lib/seed-data.ts](src/lib/seed-data.ts))

Products are auto-generated from materials and applications. Each product needs:

```typescript
tagline: 'Tagline placeholder'           // Marketing tagline (10-15 words)
description: 'Description placeholder'    // Overview paragraph (50-100 words)
technicalDescription: '...'               // Detailed technical specs
specifications: '...'                     // Key specifications
features: ['Feature placeholder', ...]    // 3-5 key features
applications: ['Application placeholder'] // 2-4 real-world applications
regulatoryStatus: '...'                   // CE/FDA certification status
```

**Action Required:**

- [ ] Add taglines for all products
- [ ] Write product descriptions
- [ ] Document technical specifications
- [ ] List real features and applications
- [ ] Update regulatory/certification status

---

### Publications Data ([src/lib/publications-data.ts](src/lib/publications-data.ts))

**News Items (4 placeholders):**

- `news-1` through `news-4`: All need title, summary, content, date, category

**Publications (4 placeholders):**

- `pub-1` through `pub-4`: All need title, authors, journal, abstract, DOI

**Action Required:**

- [ ] Replace with actual company news/announcements
- [ ] Add real academic publications with proper citations
- [ ] Include DOIs and links

---

### Media Data ([src/lib/media-data.ts](src/lib/media-data.ts))

**Videos (2 placeholders):**

- Platform Overview video: needs real videoUrl, thumbnailUrl
- Reliability Test video: needs real videoUrl, thumbnailUrl

**Case Studies (2 placeholders):**

- Cardiac Monitor Patch: needs real pdfUrl
- Peripheral Nerve Interface: needs real pdfUrl

**Datasheets (2 placeholders):**

- BionGel Datasheet: needs real pdfUrl
- ElastArray Datasheet: needs real pdfUrl

**Action Required:**

- [ ] Upload videos to YouTube/Vimeo and update URLs
- [ ] Create and upload case study PDFs
- [ ] Create and upload product datasheet PDFs

---

## 🟡 Configuration Required

### Contact Configuration ([src/lib/contact-config.ts](src/lib/contact-config.ts))

| Setting | Current Value | Action |
| ------- | ------------- | ------ |
| WhatsApp number | `+447123456789` | Update with real WhatsApp Business number |
| LinkedIn URL | `https://www.linkedin.com/company/polymer-bionics` | Verify correct URL |
| Office address | Exhibition Rd, South Kensington, London SW7 2AZ | Verify address |

---

### Analytics Configuration ([src/lib/analytics-config.ts](src/lib/analytics-config.ts))

Set environment variables for production:

| Variable | Purpose |
| -------- | ------- |
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 measurement ID (G-XXXXXXXXXX) |
| `VITE_APPINSIGHTS_CONNECTION_STRING` | Azure Application Insights connection string |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity project ID |

---

### Form Service ([src/lib/form-service.ts](src/lib/form-service.ts))

Set environment variables for form submissions:

| Variable | Purpose |
| -------- | ------- |
| `VITE_FORMSPREE_CONTACT_ID` | Formspree form ID for contact form |
| `VITE_FORMSPREE_NEWSLETTER_ID` | Formspree form ID for newsletter |
| `VITE_CONTACT_API_ENDPOINT` | Custom API endpoint (alternative to Formspree) |

---

### Feature Flags ([src/lib/feature-flags.ts](src/lib/feature-flags.ts))

| Variable | Purpose |
| -------- | ------- |
| `VITE_AZURE_APP_CONFIG_ENDPOINT` | Azure App Configuration endpoint for feature flags |

---

## 🟢 Feature Enhancements

### Payment Flow ([src/components/PaymentPage.tsx](src/components/PaymentPage.tsx))

Current state: Order request form only (sends email enquiry)

Future implementation:

- [ ] Integrate Stripe/PayPal for payment processing
- [ ] Add shopping cart functionality
- [ ] Implement inventory checking
- [ ] Add order confirmation emails
- [ ] Add order tracking/history

---

### Page Enhancements

| Page | Enhancement |
| ---- | ----------- |
| [HomePage](src/components/HomePage.tsx) | Replace partner placeholders with real logos; Add testimonials section |
| [NewsPage](src/components/NewsPage.tsx) | Add pagination; Add search/filter by year/author; Consider RSS feed |
| [MediaPage](src/components/MediaPage.tsx) | Add real video content; Implement video player; Add PDF downloads |
| [DatasheetsPage](src/components/DatasheetsPage.tsx) | Upload real PDFs; Add version history tracking |
| [TeamPage](src/components/TeamPage.tsx) | Add team member photos; Update all bios |
| [ContactPage](src/components/ContactPage.tsx) | Configure form backend; Add Google Maps embed; Consider live chat |

---

## 📦 Dependencies & Build

### Node Version

**Required:** Node.js 22.12+ (specified in `package.json` engines)

### Build Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run tests
npm run validate     # Full validation (lint, typecheck, test, build)
```

---

## 📋 Quick Reference: Data Files

| Content Type | Data File | Display Component |
| ------------ | --------- | ----------------- |
| Team Members | `src/lib/team-data.ts` | `TeamPage.tsx` |
| Materials | `src/lib/materials-data.ts` | `MaterialsPage.tsx` |
| Applications | `src/lib/materials-data.ts` | `ApplicationsPage.tsx` |
| Products | `src/lib/seed-data.ts` | `ProductsPage.tsx` |
| News | `src/lib/publications-data.ts` | `NewsPage.tsx` |
| Publications | `src/lib/publications-data.ts` | `NewsPage.tsx` |
| Videos | `src/lib/media-data.ts` | `MediaPage.tsx` |
| Case Studies | `src/lib/media-data.ts` | `MediaPage.tsx` |
| Datasheets | `src/lib/media-data.ts` | `DatasheetsPage.tsx` |

---

Last updated: January 2026
