/* global WebImporter */
export default function longText(block, document) {
  const cells = [['text'], [block.cloneNode(true)]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  return table;
}
