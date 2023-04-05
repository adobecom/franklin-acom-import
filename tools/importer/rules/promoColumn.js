/* global WebImporter */
export default function createPromoColumn(block, document) {
  const elements = [...block.querySelectorAll('.text, .image')];

  const tableName = 'columns (contained)';
  const cells = [[tableName]];
  cells.push([elements.shift().cloneNode(true)]);
  cells.push([]);
  while (elements.length > 0) {
    cells[2].push([]);
    cells[2][cells[2].length - 1].push(elements.shift().cloneNode(true));
    cells[2][cells[2].length - 1].push(elements.shift().cloneNode(true));
    cells[2][cells[2].length - 1].push(elements.shift().cloneNode(true));
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), table);
}
