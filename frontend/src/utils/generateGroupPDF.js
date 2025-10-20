import jsPDF from 'jspdf';

/**
 * Generate a comprehensive PDF report for a group with all details
 * Optimized for both desktop and mobile viewing
 * @param {Object} group - Group data
 * @param {Array} balances - Balance data
 * @param {Array} settlements - Settlement plan
 * @param {String} currency - Currency code
 */
export const generateGroupPDF = (group, balances, settlements, currency = 'USD') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;
    const margin = 10;
    const contentWidth = pageWidth - (margin * 2);

    // Colors (RGB for PDFKit compatibility)
    const primaryColor = [99, 102, 241];
    const secondaryColor = [168, 85, 247];
    const neutralColor = [107, 114, 128];

    // Helper: Check and create new page if needed
    const checkPageBreak = (height = 20) => {
      if (yPos + height > pageHeight - 10) {
        doc.addPage();
        yPos = 10;
      }
    };

    // Helper: Add section title
    const addSectionTitle = (text) => {
      checkPageBreak(15);
      doc.setFontSize(13);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin, yPos);
      yPos += 7;
    };

    // Helper: Add text with word wrap
    const addText = (text, fontSize = 10, color = [0, 0, 0], indent = 0) => {
      checkPageBreak(8);
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      doc.setFont('helvetica', 'normal');
      
      const maxWidth = contentWidth - indent;
      const wrappedText = doc.splitTextToSize(text, maxWidth);
      doc.text(wrappedText, margin + indent, yPos);
      yPos += wrappedText.length * 4 + 1;
    };

    // Header with background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${group.name}`, pageWidth / 2, 12, { align: 'center' });
    yPos = 22;

    // Metadata
    const reportDate = new Date().toLocaleDateString();
    addText(`Report Generated: ${reportDate}`, 8, neutralColor);
    if (group.joinKey) {
      addText(`Share Key: ${group.joinKey}`, 8, neutralColor);
    }
    yPos += 2;

    // Section 1: Overview
    addSectionTitle('Overview');
    const totalAmount = group.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
    addText(`Members: ${group.members?.length || 0} | Expenses: ${group.expenses?.length || 0}`, 10);
    addText(`Total: ${currency} ${totalAmount.toFixed(2)}`, 10);
    yPos += 2;

    // Section 2: Members
    addSectionTitle('Members');
    if (group.members && group.members.length > 0) {
      group.members.forEach((member, idx) => {
        const userName = member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown';
        const joinDate = new Date(member.joinedAt).toLocaleDateString();
        addText(`${idx + 1}. ${userName} (${member.role}) - ${joinDate}`, 9);
      });
    } else {
      addText('No members', 9, neutralColor);
    }
    yPos += 2;

    // Section 3: Balances
    addSectionTitle('Balances');
    if (balances && balances.length > 0) {
      balances.forEach((balance) => {
        const userName = balance.user ? `${balance.user.firstName} ${balance.user.lastName}` : 'Unknown';
        const status = balance.netBalance > 0 ? 'owed' : balance.netBalance < 0 ? 'owes' : 'settled';
        const amount = Math.abs(balance.netBalance).toFixed(2);
        addText(`${userName}: ${currency} ${amount} (${status})`, 9);
      });
    } else {
      addText('No balance data', 9, neutralColor);
    }
    yPos += 2;

    // Section 4: Expenses
    if (group.expenses && group.expenses.length > 0) {
      addSectionTitle('Expenses');
      
      group.expenses.forEach((expense, idx) => {
        checkPageBreak(25);

        const paidByName = expense.paidBy ? `${expense.paidBy.firstName} ${expense.paidBy.lastName}` : 'Unknown';
        const expenseDate = new Date(expense.date).toLocaleDateString();

        // Expense title
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.setFont('helvetica', 'bold');
        const title = `${idx + 1}. ${expense.description}`;
        doc.text(title, margin, yPos);
        yPos += 5;

        // Expense details
        addText(`${currency} ${expense.amount.toFixed(2)} | ${paidByName} | ${expenseDate}`, 9, [0, 0, 0], 2);
        addText(`Split: ${expense.splitMethod}`, 8, neutralColor, 2);

        // Split details
        if (expense.splitAmong && expense.splitAmong.length > 0) {
          doc.setFontSize(8);
          doc.setTextColor(...neutralColor);
          doc.text('Split among:', margin + 3, yPos);
          yPos += 4;

          expense.splitAmong.forEach(split => {
            const splitUser = split.user ? `${split.user.firstName} ${split.user.lastName}` : 'Unknown';
            addText(`• ${splitUser}: ${currency} ${split.amount.toFixed(2)}`, 8, [0, 0, 0], 5);
          });
        }
        yPos += 1;
      });
    }

    // Section 5: Settlement Plan
    if (settlements && settlements.length > 0) {
      addSectionTitle('✅ Settlement Plan');
      settlements.forEach((settlement, idx) => {
        const fromName = settlement.from.user ? `${settlement.from.user.firstName} ${settlement.from.user.lastName}` : 'Unknown';
        const toName = settlement.to.user ? `${settlement.to.user.firstName} ${settlement.to.user.lastName}` : 'Unknown';
        addText(`${idx + 1}. ${fromName} → ${toName}: ${currency} ${settlement.amount.toFixed(2)}`, 9);
      });
    }

    // Footer
    checkPageBreak();
    doc.setFontSize(7);
    doc.setTextColor(...neutralColor);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Coinflow Application', pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Save PDF
    const filename = `${group.name}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  }
};

export default generateGroupPDF;
