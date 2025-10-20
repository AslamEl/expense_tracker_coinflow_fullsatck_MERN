const PDFDocument = require('pdfkit');
const stream = require('stream');

// Helper function to generate PDF for a group with all details
const generateGroupReportPDF = async (req, res, Group, groupId) => {
  try {
    // Fetch group data with all details
    const group = await Group.findById(groupId)
      .populate('members.user', 'firstName lastName email')
      .populate('expenses.paidBy', 'firstName lastName email')
      .populate('expenses.splitAmong.user', 'firstName lastName email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${group.name}_Report_${new Date().toISOString().split('T')[0]}.pdf"`);

    // Pipe the PDF to response
    doc.pipe(res);

    // Define colors
    const primaryColor = '#6366f1'; // Indigo
    const secondaryColor = '#a855f7'; // Purple
    const successColor = '#22c55e'; // Green
    const errorColor = '#ef4444'; // Red
    const neutralColor = '#6b7280'; // Gray

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(`${group.name} - Expense Report`, { align: 'center' })
      .moveDown(0.5);

    // Report metadata
    const reportDate = new Date().toLocaleDateString();
    doc
      .fontSize(10)
      .fillColor(neutralColor)
      .font('Helvetica')
      .text(`Generated on: ${reportDate}`, { align: 'center' })
      .text(`Share Key: ${group.joinKey || 'N/A'}`, { align: 'center' })
      .moveDown(1);

    // Draw horizontal line
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(0.5);

    // Section 1: Group Overview
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('Group Overview', { underline: true })
      .moveDown(0.3);

    const overviewInfo = [
      `Total Members: ${group.members?.length || 0}`,
      `Total Expenses: ${group.expenses?.length || 0}`,
      `Total Amount: ${group.currency || 'USD'} ${(group.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0).toFixed(2)}`,
      `Currency: ${group.currency || 'USD'}`
    ];

    doc.fontSize(11).fillColor('black').font('Helvetica');
    overviewInfo.forEach(info => {
      doc.text(`• ${info}`);
    });
    doc.moveDown(0.5);

    // Section 2: Members
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('Members', { underline: true })
      .moveDown(0.3);

    doc.fontSize(10).font('Helvetica');
    if (group.members && group.members.length > 0) {
      group.members.forEach(member => {
        const userName = member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown';
        const joinDate = new Date(member.joinedAt).toLocaleDateString();
        doc.text(`• ${userName} (${member.role}) - Joined: ${joinDate}`);
      });
    } else {
      doc.fillColor(neutralColor).text('No members found');
    }
    doc.moveDown(0.5);

    // Section 3: Expenses Summary
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('Expenses', { underline: true })
      .moveDown(0.3);

    doc.fontSize(10).font('Helvetica');
    if (group.expenses && group.expenses.length > 0) {
      group.expenses.forEach((expense, idx) => {
        const paidByName = expense.paidBy ? `${expense.paidBy.firstName} ${expense.paidBy.lastName}` : 'Unknown';
        const expenseDate = new Date(expense.date).toLocaleDateString();
        const amount = (group.currency || 'USD') + ' ' + expense.amount.toFixed(2);
        
        doc
          .fillColor(secondaryColor)
          .font('Helvetica-Bold')
          .text(`${idx + 1}. ${expense.description} - ${amount}`);
        
        doc
          .fillColor('black')
          .font('Helvetica')
          .text(`   Paid by: ${paidByName}`)
          .text(`   Date: ${expenseDate}`)
          .text(`   Split Method: ${expense.splitMethod}`);

        // Show split details
        if (expense.splitAmong && expense.splitAmong.length > 0) {
          doc.fontSize(9).fillColor(neutralColor);
          expense.splitAmong.forEach(split => {
            const splitUser = split.user ? `${split.user.firstName} ${split.user.lastName}` : 'Unknown';
            doc.text(`   - ${splitUser}: ${(group.currency || 'USD')} ${split.amount.toFixed(2)}`);
          });
        }
        doc.moveDown(0.3);
      });
    } else {
      doc.fontSize(10).fillColor(neutralColor).text('No expenses recorded');
    }
    doc.moveDown(0.5);

    // Section 4: Balances
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('Member Balances', { underline: true })
      .moveDown(0.3);

    doc.fontSize(10).font('Helvetica');
    // Balances would need to be calculated from the backend
    // This is a simplified version
    doc.fillColor(neutralColor).text('Balance details will be populated from settlement calculations');
    doc.moveDown(1);

    // Footer
    doc
      .fontSize(8)
      .fillColor(neutralColor)
      .font('Helvetica-Oblique')
      .text('This is an automated report generated from the Expense Tracker application.', {
        align: 'center'
      });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
  }
};

module.exports = { generateGroupReportPDF };
