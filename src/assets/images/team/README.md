# Team Images

This folder contains profile images for team members displayed on the Team page.

## Naming Convention

Use the following format for team member images:

- `firstname-lastname.jpg` (or `.png`, `.webp`)
- Example: `john-doe.jpg`

## Recommended Specifications

- **Format**: JPEG, PNG, or WebP
- **Size**: 400x400 pixels (square)
- **Aspect Ratio**: 1:1
- **File Size**: Under 100KB for optimal loading

## Usage

Reference images in team data using:

```typescript
// In src/lib/team-data.ts
imageUrl: new URL('@/assets/images/team/firstname-lastname.jpg', import.meta.url).href
```

Or use the public folder path:

```typescript
imageUrl: '/assets/images/team/firstname-lastname.jpg'
```
