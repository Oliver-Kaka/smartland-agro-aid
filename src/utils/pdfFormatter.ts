// Utility to convert markdown-style text to plain text for PDF
export const formatForPDF = (text: string): string => {
  return text
    // Remove markdown bold
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove markdown italic
    .replace(/\*(.*?)\*/g, '$1')
    // Remove markdown headers
    .replace(/#{1,6}\s+(.*)/g, '$1')
    // Remove markdown links but keep text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Clean up any remaining markdown syntax
    .replace(/`(.*?)`/g, '$1')
    .trim();
};

// Generate formatted PDF content from planting guide
export const generatePDFContent = (guide: any): string => {
  const sections = [
    { title: 'Crop', content: guide.name },
    { title: 'Spacing', content: guide.spacing },
    { title: 'Fertilization', content: guide.fertilization },
    { title: 'Pest & Weed Control', content: guide.pestControl },
    { title: 'Irrigation', content: guide.irrigation },
    { title: 'Expected Yield', content: guide.expectedYield },
    { title: 'Harvest Time', content: guide.harvestTime },
  ];

  let content = `PLANTING GUIDE: ${formatForPDF(guide.name).toUpperCase()}\n\n`;
  content += `Generated on: ${new Date().toLocaleDateString()}\n`;
  content += `${'='.repeat(60)}\n\n`;

  sections.forEach(section => {
    content += `${section.title.toUpperCase()}\n`;
    content += `${'-'.repeat(section.title.length)}\n`;
    content += `${formatForPDF(section.content)}\n\n`;
  });

  return content;
};
