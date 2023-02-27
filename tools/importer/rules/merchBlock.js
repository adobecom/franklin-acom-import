/* global WebImporter */
export default function createMerchBlock(block, document) {
  const containers = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items'),
  ].filter((c) => {
    if (c.childElementCount < 2) return false;
    let ancestor = c;
    let keep;
    do {
      ancestor = ancestor.parentElement.closest('.dexter-FlexContainer-Items');
      keep = !ancestor || ancestor.childElementCount < 2;
    } while (ancestor && keep);
    return keep;
  });

  containers.forEach((container) => {
    const columns = [...container.children];
    if (columns.length > 0 && columns[0].classList.contains('title')) {
      const cells = [['text(full-width)']];
      cells.push([columns[0].querySelector('h2')]);
      const table = WebImporter.DOMUtils.createTable(cells, document);
      table.classList.add('import-table');
      columns[0].replaceWith(table);
    }

    if (columns.length > 0 && columns[1].classList.contains('flex')) {
      const items = [
        ...columns[1].querySelector('.dexter-FlexContainer-Items').children,
      ];
      items.forEach((item) => {
        const cardCells = [['Card (Product Card, border)']];
        cardCells.push([item.innerHTML]);
        const table = WebImporter.DOMUtils.createTable(cardCells, document);
        table.classList.add('import-table');
        item.replaceWith(table);
      });
    }

    if (columns.length > 0 && columns[2].classList.contains('text')) {
      const cells = [['text(full-width)']];
      cells.push([columns[2].querySelector('p')]);
      const table = WebImporter.DOMUtils.createTable(cells, document);
      table.classList.add('import-table');
      columns[2].replaceWith(table);
    }
  });
  const sectionCells = [['Section metadata'], ['style', 'dark, xl spacing, 4-up']];
  const sectionTable = WebImporter.DOMUtils.createTable(sectionCells, document);
  sectionTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), sectionTable);
}
