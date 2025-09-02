import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from "../lib/utils";
import { landingLog } from "../assets";


pdfMake.vfs = pdfFonts.vfs;

export const generateManuscriptPDF = (formData, authors, journalData) => {
    // Get journal name
    const selectedJournal = journalData.find(
        (journal) => journal.id == formData.journal_id
    );
    const journalName = selectedJournal
        ? selectedJournal.name
        : "Journal Name Not Found";

    // Build HTML content
    let htmlContent = `
    <h1 style="text-align:center;">${journalName}</h1>
    <h2 style="text-align:center;">Manuscript Details</h2>
    <table border="1" cellpadding="5" cellspacing="0" width="100%">
      <tr><td><b>Journal Name</b></td><td>${journalName}</td></tr>
      <tr><td><b>Manuscript Title</b></td><td>${formData.title || "N/A"}</td></tr>
      <tr><td><b>Submitted Date</b></td><td>${formatDate(new Date().toLocaleDateString())}</td></tr>
      <tr><td><b>Complete List of Authors</b></td><td>${authors.map((a) => `${a.name} (${a.email})`).join(", ") || "N/A"
        }</td></tr>
      <tr><td><b>Keywords</b></td><td>${Array.isArray(formData.keywords)
            ? formData.keywords.join(", ")
            : formData.keywords || "N/A"
        }</td></tr>
    </table>
  `;

    // Helper to append sections dynamically
    const addSection = (title, content) => {
        if (content) {
            htmlContent += `
        <h2>${title}</h2>
        <div>${content}</div>
      `;
        }
    };

    addSection("Abstract", formData.abstract);
    addSection("Introduction", formData.introduction);
    addSection("Materials and Methods", formData.materials_and_methods);
    addSection("Results", formData.results);
    addSection("Discussion", formData.discussion);
    addSection("Conclusion", formData.conclusion);
    addSection("Author Contributions", formData.author_contributions);
    addSection("Conflict of Interest Statement", formData.conflict_of_interest_statement);
    addSection("References", formData.references);

    // Convert HTML → pdfmake
    const pdfContent = htmlToPdfmake(htmlContent);

    // Document definition
    const documentDefinition = {
        content: pdfContent,
        defaultStyle: {
            fontSize: 12,
            lineHeight: 1.4,
        },
        styles: {
            header: { fontSize: 16, bold: true, margin: [0, 10, 0, 10] },
            subheader: { fontSize: 14, bold: true, margin: [0, 8, 0, 5] },
        },
        pageMargins: [40, 60, 40, 60],
    };

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `manuscript_${formData.title
            ? formData.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)
            : "untitled"
        }_${timestamp}.pdf`;

    // Create and download PDF
    pdfMake.createPdf(documentDefinition).download(filename);

    return filename;
};
