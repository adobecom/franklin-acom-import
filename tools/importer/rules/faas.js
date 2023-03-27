/* global WebImporter */
export default function createFaasBlocks(block, document) {
  const tables = [];

  // faas heading
  const faasHeading = block.querySelector('h3');
  if (faasHeading) {
    const headCells = [['text(full-width)']];
    headCells.push([faasHeading]);
    const headTable = WebImporter.DOMUtils.createTable(headCells, document);
    headTable.classList.add('import-table');
    tables.push(headTable);
  }

  // faas link
  const faasConfig = block.querySelector('.faas-form-settings').innerHTML;
  const faasLink = document.createElement('a');
  faasLink.href = `https://milo.adobe.com/tools/faas#${btoa(faasConfig)}`;
  faasLink.innerHTML = 'Form as a service';

  // table creation
  const cells = [['columns']];
  cells.push([faasLink]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  tables.push(table);

  block.before(document.createElement('hr'));
  block.replaceWith(...tables);
}
