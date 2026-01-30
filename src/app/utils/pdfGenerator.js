import jsPDF from 'jspdf';

export async function generatePrescriptionPDF(diagnosis, patientName = 'Patient') {
    const doc = new jsPDF();
    const data = diagnosis?.data;
    if (!data) return null;

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Helper functions
    const addText = (text, x, fontSize = 10, style = 'normal', color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, x, y);
    };

    const addLine = () => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
    };

    const checkPage = (needed = 40) => {
        if (y + needed > 280) {
            doc.addPage();
            y = 20;
        }
    };

    // Header with accent color
    doc.setFillColor(147, 197, 114); // Pistachio
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MediCare AI', margin, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Health Assessment Report', margin, 30);

    y = 50;

    // Patient & Date Info
    doc.setFillColor(248, 249, 250);
    doc.rect(margin, y - 5, pageWidth - 2 * margin, 25, 'F');

    addText('Patient:', margin + 5, 10, 'bold', [100, 100, 100]);
    y += 0;
    doc.text(patientName, margin + 30, y);

    doc.text('Date:', pageWidth - 80, y);
    doc.text(new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    }), pageWidth - 60, y);

    y += 10;
    doc.text('Report ID:', margin + 5, y);
    doc.text(`MCA-${Date.now().toString(36).toUpperCase()}`, margin + 35, y);

    y += 20;

    // Assessment Level
    checkPage();
    doc.setFillColor(
        data.urgencyLevel === 'low' ? 238 : data.urgencyLevel === 'medium' ? 254 : 254,
        data.urgencyLevel === 'low' ? 245 : data.urgencyLevel === 'medium' ? 243 : 226,
        data.urgencyLevel === 'low' ? 233 : data.urgencyLevel === 'medium' ? 226 : 226
    );
    doc.rect(margin, y - 5, pageWidth - 2 * margin, 20, 'F');

    addText('Assessment Level:', margin + 5, 11, 'bold', [60, 60, 60]);
    y += 0;
    const levelColor = data.urgencyLevel === 'low' ? [90, 138, 61] :
        data.urgencyLevel === 'medium' ? [184, 134, 92] : [185, 92, 92];
    doc.setTextColor(...levelColor);
    doc.setFont('helvetica', 'bold');
    doc.text(data.urgencyLevel?.toUpperCase() || 'N/A', margin + 55, y);

    if (data.overallAssessment) {
        y += 10;
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(data.overallAssessment, pageWidth - 2 * margin - 10);
        doc.text(lines, margin + 5, y);
        y += lines.length * 5;
    }

    y += 15;

    // Possible Conditions
    if (data.possibleConditions?.length > 0) {
        checkPage();
        addText('POSSIBLE CONDITIONS', margin, 12, 'bold', [147, 197, 114]);
        y += 3;
        addLine();

        data.possibleConditions.forEach((cond, i) => {
            checkPage(25);
            addText(`${i + 1}. ${cond.name}`, margin, 11, 'bold', [30, 30, 30]);
            if (cond.probability) {
                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.text(`(${cond.probability} probability)`, margin + doc.getTextWidth(`${i + 1}. ${cond.name}`) + 5, y);
            }
            y += 6;
            if (cond.description) {
                doc.setFontSize(9);
                doc.setTextColor(80, 80, 80);
                const lines = doc.splitTextToSize(cond.description, pageWidth - 2 * margin - 5);
                doc.text(lines, margin + 5, y);
                y += lines.length * 4 + 5;
            }
        });
        y += 5;
    }

    // Suggested Medicines
    if (data.suggestedMedicines?.length > 0) {
        checkPage(50);
        addText('SUGGESTED MEDICINES', margin, 12, 'bold', [147, 197, 114]);
        y += 3;
        addLine();

        data.suggestedMedicines.forEach((med, i) => {
            checkPage(35);

            // Medicine box
            doc.setFillColor(252, 252, 252);
            doc.setDrawColor(230, 230, 230);
            doc.roundedRect(margin, y - 3, pageWidth - 2 * margin, 28, 3, 3, 'FD');

            addText(`${med.name}`, margin + 5, 11, 'bold', [30, 30, 30]);
            doc.setFontSize(8);
            doc.setTextColor(147, 197, 114);
            doc.text(med.type || 'OTC', pageWidth - margin - 20, y);

            y += 7;
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text(`Dosage: ${med.dosage}`, margin + 5, y);
            doc.text(`Frequency: ${med.frequency}`, margin + 80, y);

            y += 5;
            doc.text(`Duration: ${med.duration}`, margin + 5, y);

            if (med.warnings) {
                y += 5;
                doc.setTextColor(180, 100, 80);
                doc.setFontSize(8);
                const warnLines = doc.splitTextToSize(`⚠ ${med.warnings}`, pageWidth - 2 * margin - 15);
                doc.text(warnLines, margin + 5, y);
                y += warnLines.length * 3;
            }

            y += 12;
        });
        y += 5;
    }

    // Home Remedies
    if (data.homeRemedies?.length > 0) {
        checkPage(40);
        addText('HOME REMEDIES', margin, 12, 'bold', [147, 197, 114]);
        y += 3;
        addLine();

        data.homeRemedies.forEach((rem) => {
            checkPage(20);
            addText(`• ${rem.remedy}`, margin, 10, 'bold', [50, 50, 50]);
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            const lines = doc.splitTextToSize(rem.instructions, pageWidth - 2 * margin - 10);
            doc.text(lines, margin + 8, y);
            y += lines.length * 4 + 5;
        });
        y += 5;
    }

    // When to See Doctor
    if (data.whenToSeeDoctor) {
        checkPage(30);
        doc.setFillColor(254, 243, 226);
        doc.rect(margin, y - 3, pageWidth - 2 * margin, 25, 'F');

        addText('⚠ WHEN TO SEEK MEDICAL ATTENTION', margin + 5, 10, 'bold', [184, 134, 92]);
        y += 6;
        doc.setFontSize(9);
        doc.setTextColor(100, 80, 60);
        const lines = doc.splitTextToSize(data.whenToSeeDoctor, pageWidth - 2 * margin - 15);
        doc.text(lines, margin + 5, y);
        y += lines.length * 4 + 15;
    }

    // Disclaimer Footer
    checkPage(40);
    y = Math.max(y + 10, 250);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const disclaimer = 'DISCLAIMER: This AI-generated report is for informational purposes only. It is not a medical diagnosis and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.';
    const discLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
    doc.text(discLines, margin, y);

    y += discLines.length * 3 + 5;
    doc.setFontSize(9);
    doc.setTextColor(147, 197, 114);
    doc.text('Generated by MediCare AI', pageWidth / 2, y, { align: 'center' });

    return doc;
}

export function downloadPDF(doc, filename = 'MediCare_Prescription') {
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}
