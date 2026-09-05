import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
  capaNombre: string;
  totalPredios: number | string;
  materialSeleccionado: string;
  statsPisos: any[];
}

export const generateUserReport = (data: ReportData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // 1. Encabezado Estilizado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(5, 150, 105); // Verde Esmeralda (UrbanInsight)
  doc.text("UrbanInsight - Reporte Territorial", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de generación: ${date}`, 14, 28);
  doc.text(`Capa activa: ${data.capaNombre}`, 14, 33);

  // 2. Tabla de Resumen General
  autoTable(doc, {
    startY: 40,
    head: [['Indicador', 'Información']],
    body: [
      ['Total de Predios Analizados', data.totalPredios],
      ['Filtro de Material aplicado', data.materialSeleccionado || "Todos los materiales"],
      ['Estado de la Información', 'Actualizado desde IndexedDB'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [5, 150, 105] }
  });

  // 3. Tabla de Distribución de Pisos
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Distribución por Número de Pisos", 14, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['Nivel', 'Cantidad', 'Porcentaje']],
    body: data.statsPisos.map(p => [
      p.label, 
      p.count.toLocaleString(), 
      `${p.percentage.toFixed(1)}%`
    ]),
    headStyles: { fillColor: [100, 116, 139] } // Slate-500
  });

  // 4. Pie de página
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount} - UrbanInsight GIS Ecosystem`, 14, 285);
  }

  doc.save(`Reporte_UrbanInsight_${data.capaNombre.replace(/\s+/g, '_')}.pdf`);
};
