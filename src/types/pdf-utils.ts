
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResponse } from './ai';

export const generatePDF = (analysis: AnalysisResponse) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('VisionPath AI: Personalized Action Plan', pageWidth / 2, 20, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

    // Strategic Guide Section
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('Your Strategic Guide', 14, 45);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const splitGuide = doc.splitTextToSize(analysis.guide, pageWidth - 28);
    doc.text(splitGuide, 14, 55);

    // Calculate position for the table based on guide length
    const guideHeight = splitGuide.length * 6;
    let tableY = 55 + guideHeight + 15;

    // Check if we need a new page for the table
    if (tableY > doc.internal.pageSize.height - 40) {
        doc.addPage();
        tableY = 20;
    }

    // Action Items Table
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('Action Items', 14, tableY - 5);

    autoTable(doc, {
        startY: tableY,
        head: [['#', 'Task', 'Description']],
        body: analysis.todolist.map((item, index) => [
            index + 1,
            item.task,
            item.description
        ]),
        headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo-600 color
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 20 },
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // Save the PDF
    doc.save('VisionPath_Action_Plan.pdf');
};
