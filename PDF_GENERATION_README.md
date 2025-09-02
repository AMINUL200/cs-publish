# PDF Generation Feature for Manuscript Submission

## Overview
This feature automatically generates a PDF document from the manuscript form data after successful submission or update. It also provides a manual PDF generation button for preview purposes.

## Features

### Automatic PDF Generation
- **After Submission**: PDF is automatically generated when a new manuscript is successfully submitted
- **After Update**: PDF is automatically generated when an existing manuscript is successfully updated
- **File Naming**: PDFs are named with the manuscript title and timestamp (e.g., `manuscript_Research_Paper_2024-01-15T10-30-45.pdf`)

### Manual PDF Generation
- **Generate PDF Button**: Available on all steps of the form
- **Validation**: Requires at least a title and journal selection to be enabled
- **Real-time Preview**: Generate PDF at any time to preview the document

## PDF Structure

### Page 1: Header and Summary Table
1. **Journal Name**: Displayed at the top center of the page
2. **Manuscript Details Table**: Contains:
   - Journal Name
   - Manuscript Title
   - Submitted Date
   - Complete List of Authors (with emails)
   - Keywords
   - Abstract (truncated version for table)

### Content Sections
The PDF includes all manuscript sections in order:
1. **Abstract** (full version)
2. **Introduction**
3. **Materials and Methods**
4. **Results**
5. **Discussion**
6. **Conclusion**
7. **Author Contributions**
8. **Conflict of Interest Statement**
9. **References**

### Formatting Features
- **Professional Layout**: Clean, academic-style formatting
- **Page Numbers**: Automatically added to each page
- **Auto-pagination**: Content automatically flows to new pages as needed
- **Consistent Typography**: Different font sizes for titles, headings, and body text
- **Table Styling**: Professional table with alternating colors and proper spacing

## Technical Implementation

### Dependencies
- `jspdf`: Core PDF generation library
- `jspdf-autotable`: For creating professional tables

### Files Modified
1. **`src/utils/pdfGenerator.js`**: New utility file containing PDF generation logic
2. **`src/components/user/StepperForm/StepperForm.jsx`**: Integrated PDF generation into form submission and added manual generation button

### Key Functions
- `generateManuscriptPDF(formData, authors, journalData)`: Main PDF generation function
- `handleGeneratePDF()`: Manual PDF generation handler
- Integration with existing form submission flow

## Usage

### For Users
1. **Fill the form**: Complete at least the title and select a journal
2. **Generate PDF manually**: Click the "📄 Generate PDF" button at any time
3. **Submit manuscript**: PDF will be automatically generated after successful submission
4. **Update manuscript**: PDF will be automatically generated after successful update

### For Developers
```javascript
import { generateManuscriptPDF } from '../utils/pdfGenerator';

// Generate PDF manually
const filename = generateManuscriptPDF(formData, authors, journalData);
console.log(`PDF generated: ${filename}`);
```

## Validation
- Requires manuscript title
- Requires journal selection
- Requires at least one author with name and email
- Graceful error handling with user-friendly messages

## Browser Compatibility
- Works in all modern browsers that support PDF generation
- Uses client-side PDF generation (no server dependency)
- Files are automatically downloaded to the user's default download folder

## Future Enhancements
- Add PDF template customization options
- Include manuscript file attachments in PDF
- Add watermark or branding options
- Support for different PDF formats (A4, Letter, etc.)
- Add table of contents for long manuscripts

