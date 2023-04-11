/* global WebImporter */
export default function createTextMarquee(block, document) {

  const tableName = 'text (full-width)';
  const cells = [[tableName]];
  cells.push([[block.cloneNode(true)]]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.replaceWith(table);

}
