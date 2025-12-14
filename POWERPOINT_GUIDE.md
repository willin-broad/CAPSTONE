# PowerPoint Files Guide

## Overview
Your landing page now supports PowerPoint presentations! Here are your options:

## Option 1: GitHub Pages (Recommended)
**Best for**: Final deployment

### How it works:
1. Deploy your site to GitHub Pages (see DEPLOYMENT.md)
2. Upload your `.ppt` or `.pptx` files to the `assets/` folder
3. The site will use Microsoft Office Online Viewer automatically

### Example:
```html
<!-- In index.html -->
<button onclick="openPreview('My Presentation', 'https://yourusername.github.io/assets/slides.pptx', 'powerpoint')">
    View Slides
</button>
```

**Note**: The URL must be the full GitHub Pages URL, not a relative path.

---

## Option 2: Google Drive
**Best for**: Immediate testing or if you prefer cloud storage

### Step-by-Step:

#### 1. Upload to Google Drive
- Go to [Google Drive](https://drive.google.com)
- Upload your PowerPoint file
- Right-click the file → "Get link"
- Change sharing to "Anyone with the link can view"
- Copy the link (it looks like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)

#### 2. Extract the File ID
From this URL: `https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing`
The FILE_ID is: `1ABC123xyz`

#### 3. Create Preview URL
Use this format:
```
https://drive.google.com/file/d/FILE_ID/preview
```

Example:
```
https://drive.google.com/file/d/1ABC123xyz/preview
```

#### 4. Update Your HTML
```html
<button onclick="openPreview('My Presentation', 'https://drive.google.com/file/d/1ABC123xyz/preview', 'powerpoint')">
    View Slides
</button>
```

### Google Drive Example (Full):
```html
<!-- Replace the existing button in index.html -->
<button class="btn btn-primary" 
        onclick="openPreview('Autobiography Slides', 'https://drive.google.com/file/d/YOUR_FILE_ID/preview', 'powerpoint')">
    View Slides
</button>
```

---

## Option 3: Convert to PDF
**Best for**: Universal compatibility

### Advantages:
- Works everywhere (local, GitHub Pages, etc.)
- No external dependencies
- Consistent rendering

### How to Convert:
1. **PowerPoint**: File → Save As → PDF
2. **Google Slides**: File → Download → PDF Document
3. **LibreOffice**: File → Export as PDF

Then use as normal PDF:
```html
<button onclick="openPreview('My Presentation', 'assets/slides.pdf')">
    View Slides
</button>
```

---

## Current Implementation

### What Happens Locally:
When viewing `file://` URLs (opening index.html directly), PowerPoint files will show:
- A message explaining the limitation
- Alternative options (Google Drive, PDF, GitHub Pages)
- Download button to view the file

### What Happens on GitHub Pages:
PowerPoint files with full URLs will open in Microsoft Office Online Viewer embedded in the modal.

---

## Quick Reference

| Method | Local Testing | GitHub Pages | Setup Difficulty |
|--------|--------------|--------------|------------------|
| GitHub Pages URL | ❌ No | ✅ Yes | Medium |
| Google Drive | ✅ Yes | ✅ Yes | Easy |
| PDF Conversion | ✅ Yes | ✅ Yes | Very Easy |

---

## Recommended Workflow

1. **For Development**: Use PDF versions of your slides
2. **For Deployment**: 
   - Upload PPT files to `assets/` folder
   - OR use Google Drive links
   - Deploy to GitHub Pages

---

## Need Help?

If you encounter issues:
1. Check that your Google Drive link has proper sharing permissions
2. Verify the FILE_ID is correct
3. Make sure you're using `/preview` at the end of the Drive URL
4. For GitHub Pages, ensure the full URL is used (not relative paths)
