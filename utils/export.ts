
import { DossierState } from '../types';

declare const html2pdf: any;

/**
 * Export specific HTML element to a high-resolution PDF
 */
export const exportToPdf = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    // Set margin to 0 because the element has its own padding (p-[12mm])
    // This prevents double-margin scaling issues that disrupt the layout
    margin: 0, 
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 3, // 3 is optimal for high res without hitting browser canvas limits
      useCORS: true, 
      letterRendering: true,
      dpi: 300,
      logging: false,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
    pagebreak: { 
      mode: ['css', 'legacy'], // 'avoid-all' removed as it causes layout disruption
      avoid: ['tr', 'td', 'img', 'video', 'audio', '.page-break-avoid']
    }
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } catch (err) {
    console.error('PDF Generation failed:', err);
  }
};

/**
 * Export specific HTML content to a Word-compatible .doc file
 */
export const exportToWord = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Simple Word XML wrapper for HTML content
  const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>table { border-collapse: collapse; width: 100%; } td { border: 1px solid black; padding: 4px; font-family: Arial; font-size: 10pt; } tr { page-break-inside: avoid; break-inside: avoid; }</style></head><body>";
  const postHtml = "</body></html>";
  const html = preHtml + element.innerHTML + postHtml;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
