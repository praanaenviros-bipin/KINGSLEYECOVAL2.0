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
      const gState = (doc as any).GState ? new (doc as any).GState({ opacity: 0.1 }) : null;
      if (gState) {
        doc.setGState(gState);
      } else {
        doc.setTextColor(240, 240, 240); // Fallback to very light color if GState fails
      }
      doc.setFontSize(60);
      if (!gState) doc.setTextColor(240, 240, 240);
      else doc.setTextColor(150, 150, 150);
      
      doc.setFont('helvetica', 'bold');
      doc.text('KINGSLEY ECOVAL', pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45,
      });
      doc.restoreGraphicsState();
    } catch (e) {
      // Fallback if graphics state is not supported
      doc.setFontSize(60);
      doc.setTextColor(240, 240, 240);
      doc.setFont('helvetica', 'bold');
      doc.text('KINGSLEY ECOVAL', pageWidth / 2, pageHeight / 2, {
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
  
  autoTable(doc, {
    startY: finalY + 19,
    head: [['Parameter', 'Value', 'Unit']],
    body: [
      ['Fluid Name', process.fluidName || 'Process Gas', '-'],
      ['Fluid State', process.state, '-'],
      ['Relief Rate', process.reliefRate, 'kg/hr'],
      ['Operating Pressure', process.operatingPressure, 'barg'],
      ['Operating Temperature', process.operatingTemp, '°C'],
      ['Molecular Weight', process.molecularWeight, 'g/mol'],
      ['Specific Heat Ratio (k)', process.specificHeatRatio, '-'],
      ['Compressibility (Z)', process.compressibility, '-'],
    ],
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
      ['Set Pressure', sizing.setPressure, sizing.setPressureUnit === 'PSIG' ? 'psig' : 'kg/cm²'],
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
  doc.text('Formula used: A = W / (C * Kd * P1 * Kb * Kc) * sqrt(TZ / M)', 14, 30);

  const { intermediates } = results;
  autoTable(doc, {
    startY: 35,
    head: [['Variable', 'Description', 'Value', 'Unit']],
    body: [
      ['W', 'Relief Rate', intermediates.W.toFixed(2), 'lb/hr'],
      ['T', 'Relieving Temperature', intermediates.T.toFixed(2), 'Rankine'],
      ['P1', 'Upstream Relieving Pressure', intermediates.P1.toFixed(2), 'psia'],
      ['C', 'Gas Constant', intermediates.C.toFixed(2), '-'],
      ['Kd', 'Coefficient of Discharge', intermediates.Kd.toFixed(3), '-'],
      ['Kb', 'Capacity Correction Factor', intermediates.Kb.toFixed(2), '-'],
      ['Kc', 'Combination Correction Factor', intermediates.Kc.toFixed(2), '-'],
      ['M', 'Molecular Weight', intermediates.M.toFixed(2), 'g/mol'],
      ['Z', 'Compressibility Factor', intermediates.Z.toFixed(3), '-'],
    ],
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
      ['Margin', `${results.margin}%`],
      ['Recommended Inlet Size', results.inletSize],
      ['Recommended Outlet Size', results.outletSize],
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 51] }, // Dark Green for results
  });

  // Add watermark to first page as well (need to go back or add it during generation)
  doc.setPage(1);
  addWatermark();

  // Save the PDF
  doc.save(`Sizing_Report_${project.reportNo || 'Draft'}.pdf`);
}
