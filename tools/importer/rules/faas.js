/* global WebImporter */
export default function createFaasBlocks(block, document) {
  const cells = [['columns']];

  // faas link
  const faasLink = document.createElement('a');
  faasLink.href = `https://milo.adobe.com/tools/faas#${btoa(block.innerHTML)}`;
  faasLink.innerHTML = 'Form as a service';

  // table creation
  cells.push([faasLink]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table);
}
