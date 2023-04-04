/* global WebImporter */
import createCardSection from './cardSection.js';
import createIconCard from './iconCard.js';

const createTextBlock = (block, document) => {
  const cells = [['text(full-width)']];
  cells.push([block.cloneNode(true)]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.replaceWith(table);
};

export default function createCardsBlock(block, document) {
  const containers = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items'),
  ].filter((c) => {
    if (c.childElementCount < 2) return false;
    let ancestor = c;
    let keep;
    do {
      ancestor = ancestor.parentElement.closest(
        '.dexter-FlexContainer-Items',
      );
      keep = !ancestor || ancestor.childElementCount < 2;
    } while (ancestor && keep);
    return keep;
  });
  containers.forEach((container) => {
    const columns = [...container.children];
    columns.forEach((column) => {
      if (column.classList.contains('hawks-theme')) {
        column.before(document.createElement('hr'));
        createTextBlock(column, document);
      }
      if (column.classList.contains('flex')) {
        createCardSection(column, document);
      }
      if (column.classList.contains('text')) {
        column.before(document.createElement('hr'));
        createTextBlock(column, document);
      } if (column.classList.contains('xfreference')) {
        createIconCard(column, document);
      }
    });
  });
}
