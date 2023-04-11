/* global WebImporter */
export default function createIconCard(block, document) {
  const allIconCards = [
    ...block.querySelectorAll('.experiencefragment:not(.aem-GridColumn)'),
  ];
  const cells = [['columns']];
  const row = [];
  allIconCards.forEach((container) => {
    row.push(container.cloneNode(true));
  });
  cells.push(row);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.replaceWith(table);
}
