import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from "../lib/utils";

// Register the fonts
pdfMake.vfs = pdfFonts.vfs;

// Enhanced HTML to pdfmake converter with full formatting support
const convertHtmlToPdfMake = (html) => {
  if (!html) return [];

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const parseNode = (node, inheritedStyle = {}) => {
    const result = [];

    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        if (text.trim() !== "") {
          result.push({
            text: text,
            ...inheritedStyle,
          });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();

        // Skip images and other media elements
        if (
          ["img", "video", "audio", "iframe", "object", "embed"].includes(
            tagName
          )
        ) {
          continue;
        }

        // Build style object based on tag and attributes
        let style = { ...inheritedStyle };

        // Handle text styling tags
        switch (tagName) {
          case "strong":
          case "b":
            style.bold = true;
            break;
          case "em":
          case "i":
            style.italics = true;
            break;
          case "u":
            style.decoration = "underline";
            break;
          case "s":
          case "strike":
          case "del":
            style.decoration = "lineThrough";
            break;
          case "sub":
            style.fontSize = (style.fontSize || 11) * 0.7;
            style.characterSpacing = -0.5;
            break;
          case "sup":
            style.fontSize = (style.fontSize || 11) * 0.7;
            style.characterSpacing = -0.5;
            break;
        }

        // Handle alignment from style attribute or align attribute
        const align =
          child.getAttribute("align") ||
          (child.style.textAlign ? child.style.textAlign : null);
        if (align) {
          style.alignment = align;
        }

        // Handle font size from style
        if (child.style.fontSize) {
          const fontSize = parseInt(child.style.fontSize);
          if (!isNaN(fontSize)) {
            style.fontSize = fontSize;
          }
        }

        // Handle color from style
        if (child.style.color) {
          style.color = child.style.color;
        }

        // Process based on tag type
        switch (tagName) {
          case "p":
            const pContent = parseNode(child, style);
            if (pContent.length > 0) {
              // Create a paragraph object with alignment if specified
              const pObj = {
                text: pContent,
                margin: [0, 0, 0, 8],
              };
              if (style.alignment) {
                pObj.alignment = style.alignment;
              }
              result.push(pObj);
            }
            break;

          case "div":
            const divContent = parseNode(child, style);
            if (divContent.length > 0) {
              const divObj = {
                text: divContent,
                margin: [0, 0, 0, 5],
              };
              if (style.alignment) {
                divObj.alignment = style.alignment;
              }
              result.push(divObj);
            }
            break;

          case "br":
            result.push({ text: "\n" });
            break;

          case "h1":
            result.push({
              text: child.textContent,
              fontSize: 18,
              bold: true,
              margin: [0, 12, 0, 6],
              ...style,
            });
            break;

          case "h2":
            result.push({
              text: child.textContent,
              fontSize: 16,
              bold: true,
              margin: [0, 10, 0, 5],
              ...style,
            });
            break;

          case "h3":
            result.push({
              text: child.textContent,
              fontSize: 14,
              bold: true,
              margin: [0, 8, 0, 4],
              ...style,
            });
            break;

          case "h4":
          case "h5":
          case "h6":
            result.push({
              text: child.textContent,
              fontSize: 12,
              bold: true,
              margin: [0, 6, 0, 3],
              ...style,
            });
            break;

          case "ul":
            const ulItems = Array.from(child.children).filter(
              (c) => c.tagName.toLowerCase() === "li"
            );
            const ulList = {
              ul: ulItems.map((item) => {
                const itemContent = parseNode(item, style);
                return itemContent.length > 0 ? itemContent : item.textContent;
              }),
              margin: [0, 5, 0, 5],
            };
            if (style.alignment) {
              ulList.alignment = style.alignment;
            }
            result.push(ulList);
            break;

          case "ol":
            const olItems = Array.from(child.children).filter(
              (c) => c.tagName.toLowerCase() === "li"
            );
            const olList = {
              ol: olItems.map((item) => {
                const itemContent = parseNode(item, style);
                return itemContent.length > 0 ? itemContent : item.textContent;
              }),
              margin: [0, 5, 0, 5],
            };
            if (style.alignment) {
              olList.alignment = style.alignment;
            }
            result.push(olList);
            break;

          case "blockquote":
            const quoteContent = parseNode(child, style);
            result.push({
              text: quoteContent,
              margin: [20, 5, 20, 5],
              italics: true,
              color: "#666666",
            });
            break;

          case "pre":
          case "code":
            result.push({
              text: child.textContent,
              font: "Courier",
              fontSize: 10,
              background: "#f5f5f5",
              margin: [0, 5, 0, 5],
            });
            break;

          case "a":
            const linkText = child.textContent;
            const href = child.getAttribute("href");
            result.push({
              text: linkText,
              link: href,
              color: "blue",
              decoration: "underline",
              ...style,
            });
            break;

          case "table":
            // Skip table for now or handle if needed
            result.push({
              text: "[Table content - not rendered in PDF]",
              italics: true,
              color: "#999999",
              margin: [0, 5, 0, 5],
            });
            break;

          default:
            // For any other tags, recursively parse children
            const childContent = parseNode(child, style);
            result.push(...childContent);
        }
      }
    }

    return result;
  };

  const content = parseNode(tempDiv);
  return content.length > 0 ? content : [{ text: " " }];
};

export const generateManuscriptPDF = async (formData, authors, journalData) => {
  try {
    // Get journal name
    const selectedJournal = journalData.find(
      (journal) => journal.id == formData.journal_id
    );
    const journalName = selectedJournal
      ? selectedJournal.name
      : "Journal Name Not Found";

    // Prepare content array for pdfmake
    const content = [];

    // Title section
    content.push(
      {
        text: journalName,
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      {
        text: "Manuscript Details",
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      }
    );

    // Manuscript details table
    const tableBody = [
      [
        { text: "Journal Name", bold: true, fillColor: "#f0f0f0" },
        { text: journalName },
      ],
      [
        { text: "Manuscript Title", bold: true, fillColor: "#f0f0f0" },
         { stack: convertHtmlToPdfMake(formData.title || "N/A") } 
      ],
      [
        { text: "Submitted Date", bold: true, fillColor: "#f0f0f0" },
        { text: formatDate(new Date().toLocaleDateString()) },
      ],
      [
        { text: "Complete List of Authors", bold: true, fillColor: "#f0f0f0" },
        {
          text:
            authors.map((a) => `${a.name} (${a.email})`).join(", ") || "N/A",
        },
      ],
      [
        { text: "Keywords", bold: true, fillColor: "#f0f0f0" },
        {
          text: Array.isArray(formData.keywords)
            ? formData.keywords.join(", ")
            : formData.keywords || "N/A",
        },
      ],
    ];

    content.push({
      table: {
        headerRows: 0,
        widths: ["30%", "70%"],
        body: tableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0.5;
        },
        vLineWidth: function (i, node) {
          return 0.5;
        },
        hLineColor: function (i, node) {
          return "#cccccc";
        },
        vLineColor: function (i, node) {
          return "#cccccc";
        },
      },
      margin: [0, 0, 0, 25],
    });

    // Helper function to add sections with formatted content
    const addSection = (title, contentText) => {
      if (contentText && contentText.trim() !== "") {
        // Remove any image tags before processing
        const cleanedContent = contentText.replace(/<img[^>]*>/gi, "");
        const formattedContent = convertHtmlToPdfMake(cleanedContent);

        content.push({
          text: title,
          fontSize: 14,
          bold: true,
          color: "#2c5aa0",
          margin: [0, 15, 0, 8],
          pageBreak: content.length > 10 ? "before" : undefined,
        });

        // Add the formatted content
        content.push(...formattedContent);

        // Add some space after section
        content.push({ text: "", margin: [0, 0, 0, 10] });
      }
    };

    // Add all sections
    addSection("Abstract", formData.abstract);
    addSection("Introduction", formData.introduction);
    addSection("Materials and Methods", formData.materials_and_methods);
    addSection("Results", formData.results);
    addSection("Discussion", formData.discussion);
    addSection("Conclusion", formData.conclusion);
    addSection("Author Contributions", formData.author_contributions);
    addSection(
      "Conflict of Interest Statement",
      formData.conflict_of_interest_statement
    );
    addSection("References", formData.references);

    // Add figures note if figures exist
    if (Array.isArray(formData.figures) && formData.figures.length > 0) {
      content.push(
        {
          text: "Figures",
          fontSize: 14,
          bold: true,
          color: "#2c5aa0",
          margin: [0, 20, 0, 10],
        },
        {
          text: `This manuscript contains ${formData.figures.length} figure(s). Figures are available in the original submission files and have been excluded from this PDF preview.`,
          fontSize: 11,
          lineHeight: 1.3,
          margin: [0, 0, 0, 15],
          italics: true,
          color: "#666666",
        }
      );
    }

    // Document definition
    const documentDefinition = {
      content: content,
      pageMargins: [50, 60, 50, 60],
      pageSize: "A4",
      defaultStyle: {
        fontSize: 11,
        lineHeight: 1.4,
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      info: {
        title: formData.title || "Manuscript",
        author: authors.map((a) => a.name).join(", "),
        subject: "Research Manuscript",
        creator: "Manuscript Management System",
        creationDate: new Date(),
      },
    };

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `manuscript_${
      formData.title
        ? formData.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)
        : "untitled"
    }_${timestamp}.pdf`;

    // Create and download PDF
    pdfMake.createPdf(documentDefinition).download(filename);

    return filename;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF: " + error.message);
  }
};
