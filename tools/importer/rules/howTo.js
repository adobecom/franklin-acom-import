/* global WebImporter */

export default function createHowTo(block, document) {
  const allHeading = block.querySelectorAll('.text')[0];
  const heading = allHeading.querySelectorAll('h2, p');
  const allText = block.querySelectorAll('.flex');
  const allTextPosition = block.querySelectorAll('.position');
  const cells = [['How-to (seo)']];
  cells.push([[heading]]);
  cells.push([[allText]]);
  heading.forEach((text) => {
    cells.push([[text]]);
  });
  allText.forEach((text) => {
    cells.push([[text]]);
  });
  allTextPosition.forEach((text) => {
    cells.push([[text]]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table);
  return table;
}
