/* global WebImporter */
export default function createTable(block, document) {
  const cells = [['columns'], [block.cloneNode(true)]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table, table);
}
