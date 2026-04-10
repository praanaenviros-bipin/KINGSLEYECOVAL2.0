import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProjectData, ProcessData, SizingData } from '../types';
import { SizingResults } from './calculations';

export function generateSizingReport(
  project: ProjectData,
  process: ProcessData,
  sizing: SizingData,
  results: SizingResults
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper for Watermark
  const addWatermark = () => {
    try {
      doc.saveGraphicsState();
      const gState = (doc as any).GState ? new (doc as any).GState({ opacity: 0.2 }) : null;
      if (gState) {
        doc.setGState(gState);
      } else {
        doc.setTextColor(230, 230, 230); // Fallback to light color if GState fails
      }
      doc.setFontSize(60);
      if (!gState) doc.setTextColor(230, 230, 230);
      else doc.setTextColor(150, 150, 150);
      
      doc.setFont('helvetica', 'bold');
      doc.text('KINGSLEY', pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45,
      });
      doc.restoreGraphicsState();
    } catch (e) {
      // Fallback if graphics state is not supported
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.setFont('helvetica', 'bold');
      doc.text('KINGSLEY', pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45,
      });
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102); // Dark Blue
  doc.text('Safety Relief Valve Sizing Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
  doc.line(14, 32, pageWidth - 14, 32);

  // Project Information
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('1. Project Information', 14, 42);
  
  autoTable(doc, {
    startY: 46,
    head: [['Field', 'Value']],
    body: [
      ['Client Name', project.clientName || 'N/A'],
      ['Location', project.location || 'N/A'],
      ['Report No.', project.reportNo],
      ['Revision', project.revNo],
      ['Date', project.date],
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 51, 102] },
  });

  let finalY = (doc as any).lastAutoTable.finalY;

  // Process Conditions
  doc.setFontSize(14);
  doc.text('2. Process Conditions', 14, finalY + 15);
  
  const processBody = [
    ['Fluid Name', process.fluidName || 'Process Gas', '-'],
    ['Fluid State', process.state, '-'],
    ['Relief Rate', process.reliefRate, process.reliefRateUnit],
    ['Operating Pressure', process.operatingPressure, process.operatingPressureUnit],
    ['Operating Temperature', process.operatingTemp, process.operatingTempUnit],
  ];

  if (process.state === 'GAS') {
    processBody.push(['Molecular Weight', process.molecularWeight, 'g/mol']);
    processBody.push(['Specific Heat Ratio (k)', process.specificHeatRatio, '-']);
    processBody.push(['Compressibility (Z)', process.compressibility, '-']);
  } else {
    processBody.push(['Specific Gravity', process.specificGravity, '-']);
    processBody.push(['Viscosity', process.viscosity, 'cP']);
  }

  autoTable(doc, {
    startY: finalY + 19,
    head: [['Parameter', 'Value', 'Unit']],
    body: processBody,
    theme: 'striped',
    headStyles: { fillColor: [0, 51, 102] },
  });

  finalY = (doc as any).lastAutoTable.finalY;

  // Sizing Requirements
  doc.setFontSize(14);
  doc.text('3. Sizing Requirements', 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 19,
    head: [['Parameter', 'Value', 'Unit']],
    body: [
      ['Sizing Scenario', sizing.scenario, '-'],
      ['Set Pressure', sizing.setPressure, sizing.setPressureUnit],
      ['Backpressure', sizing.backpressure, sizing.backpressureUnit],
      ['Overpressure', sizing.overpressure, '%'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 51, 102] },
  });

  // Calculation Summary
  doc.addPage();
  addWatermark();
  
  doc.setFontSize(14);
  doc.text('4. Calculation Summary (API 520 Part 1)', 14, 22);
  
  doc.setFontSize(10);
  const formula = process.state === 'GAS' 
    ? 'Formula: A = W / (C * Kd * P1 * Kb * Kc) * sqrt(TZ / M)'
    : 'Formula: A = Q / (27.2 * Kd * Kw * Kc * Kv) * sqrt(G / (P1 - P2))';
  doc.text(formula, 14, 30);

  const { intermediates } = results;
  const calcBody = [
    ['P1', 'Relieving Pressure', (intermediates.P1 || 0).toFixed(2), 'psig'],
    ['P2', 'Backpressure', (intermediates.P2 || 0).toFixed(2), 'psig'],
    ['Kc', 'Combination Correction Factor', (intermediates.Kc || 1.0).toFixed(2), '-'],
    ['Kd', 'Coefficient of Discharge', (intermediates.Kd || 0.62).toFixed(3), '-'],
  ];

  if (process.state === 'GAS') {
    calcBody.push(['W', 'Relief Rate', (intermediates.W || 0).toFixed(2), 'lb/hr']);
    calcBody.push(['T', 'Relieving Temperature', (intermediates.T || 0).toFixed(2), 'Rankine']);
    calcBody.push(['C', 'Gas Constant', (intermediates.C || 0).toFixed(2), '-']);
    calcBody.push(['Kb', 'Capacity Correction Factor', (intermediates.Kb || 1.0).toFixed(2), '-']);
    calcBody.push(['M', 'Molecular Weight', (intermediates.M || 0).toFixed(2), 'g/mol']);
    calcBody.push(['Z', 'Compressibility Factor', (intermediates.Z || 1.0).toFixed(3), '-']);
  } else {
    calcBody.push(['Q', 'Relief Rate', (intermediates.Q || 0).toFixed(2), 'gpm']);
    calcBody.push(['G', 'Specific Gravity', (intermediates.G || 1.0).toFixed(3), '-']);
    calcBody.push(['Kw', 'Backpressure Correction', (intermediates.Kw || 1.0).toFixed(2), '-']);
    calcBody.push(['Kv', 'Viscosity Correction', (intermediates.Kv || 1.0).toFixed(2), '-']);
  }

  autoTable(doc, {
    startY: 35,
    head: [['Variable', 'Description', 'Value', 'Unit']],
    body: calcBody,
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 102] },
  });

  finalY = (doc as any).lastAutoTable.finalY;

  // Final Results
  doc.setFontSize(14);
  doc.text('5. Final Results', 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 19,
    head: [['Result Parameter', 'Value']],
    body: [
      ['Required Area', `${results.requiredArea} in²`],
      ['Selected Orifice', results.orifice],
      ['Selected Area', `${results.selectedArea} in²`],
      ['Rated Capacity', results.ratedCapacity],
      ['Margin', `${results.margin}%`],
      ['Recommended Inlet Size', results.inletSize],
      ['Recommended Outlet Size', results.outletSize],
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 51] }, // Dark Green for results
  });

  // Header & Footer on all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Top Header - Company Name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 102); // Dark Blue
    doc.text('Kingsley Ecotech Pvt Ltd', pageWidth / 2, 10, { align: 'center' });
    
    // Bottom Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text('Kingsley Ectoech Pvt Ltd | www.kingsleyindia.com', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  }

  // Save the PDF
  doc.save(`Kingsley_Sizing_Report_${project.reportNo || 'Draft'}.pdf`);
}
