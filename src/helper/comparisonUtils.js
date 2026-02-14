import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from comparison view
 * @param {HTMLElement} element - The element to convert to PDF
 * @param {string} filename - The filename for the PDF
 */
export const exportToPDF = async (element, filename = 'pg-comparison.pdf') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 210; // A4 landscape height in mm

    // Add additional pages if content is longer
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 210;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Get starting price from pricing object or legacy price
 * @param {Object} pricing - Pricing object with room types
 * @param {number} legacyPrice - Legacy price field
 * @returns {number} Starting price
 */
export const getStartingPrice = (pricing, legacyPrice) => {
  if (pricing) {
    const prices = [];
    if (pricing.single?.withAc) prices.push(Number(pricing.single.withAc));
    if (pricing.single?.withoutAc) prices.push(Number(pricing.single.withoutAc));
    if (pricing.double?.withAc) prices.push(Number(pricing.double.withAc));
    if (pricing.double?.withoutAc) prices.push(Number(pricing.double.withoutAc));
    if (pricing.triple?.withAc) prices.push(Number(pricing.triple.withAc));
    if (pricing.triple?.withoutAc) prices.push(Number(pricing.triple.withoutAc));
    
    return prices.length > 0 ? Math.min(...prices) : legacyPrice || 0;
  }
  return legacyPrice || 0;
};

/**
 * Format price for display
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (!price || price === '' || price === 'N/A') return 'N/A';
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

/**
 * Compare two values and return color class for highlighting differences
 * @param {any} value1 - First value
 * @param {any} value2 - Second value
 * @param {boolean} isNumeric - Whether the values are numeric (higher is better)
 * @returns {string} Tailwind color class
 */
export const getComparisonHighlight = (value1, value2, isNumeric = false) => {
  if (value1 === value2) return '';
  
  if (isNumeric) {
    return Number(value1) > Number(value2) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';
  }
  
  return 'bg-yellow-50';
};

/**
 * Extract all unique amenities from multiple PGs
 * @param {Array} pgs - Array of PG objects
 * @returns {Array} Unique amenities list
 */
export const getAllAmenities = (pgs) => {
  const amenitiesSet = new Set();
  pgs.forEach(pg => {
    if (pg.amenities && Array.isArray(pg.amenities)) {
      pg.amenities.forEach(amenity => amenitiesSet.add(amenity));
    }
  });
  return Array.from(amenitiesSet).sort();
};

/**
 * Check if PG has specific amenity
 * @param {Object} pg - PG object
 * @param {string} amenity - Amenity to check
 * @returns {boolean} Whether PG has the amenity
 */
export const hasAmenity = (pg, amenity) => {
  return pg.amenities && Array.isArray(pg.amenities) && pg.amenities.includes(amenity);
};
