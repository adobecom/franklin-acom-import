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

  const textBlock = (column) => {
    const cells = [['text(full-width)']];
    const paraFragment = document.createDocumentFragment();
    [...column.querySelectorAll('.cmp-text p,h2,h3')].forEach((element) => {
      paraFragment.append(element);
    });
    cells.push([paraFragment]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    column.replaceWith(table);
  };

  const titleBlock = (column) => {
    const cells = [['text(full-width)']];
    const paraFragment = document.createDocumentFragment();
    [...column.querySelectorAll('.cmp-title p,h2')].forEach((element) => {
      paraFragment.append(element);
    });
    cells.push([paraFragment]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    column.replaceWith(table);
  };

  const flexBlock = (column) => {
    const items = [
      ...column.querySelector('.dexter-FlexContainer-Items').children,
    ];
    items.forEach((item) => {
      const cardCells = [['Card (Product Card, border)']];
      cardCells.push([item.innerHTML]);
      const table = WebImporter.DOMUtils.createTable(cardCells, document);
      table.classList.add('import-table');
      item.replaceWith(table);
    });
  };

  const xReferenceBlock = (column) => {
    const cardCells = [['Card (Product Card, border)']];
    const cloneColumn = column.cloneNode(true);
    cloneColumn.querySelector('.aem-GridColumn--default--hide').remove();
    cardCells.push([cloneColumn]);
    const table = WebImporter.DOMUtils.createTable(cardCells, document);
    table.classList.add('import-table');
    column.replaceWith(table);
  };

  containers.forEach((container) => {
    const columns = [...container.children];
    columns.forEach((column) => {
      if (column.classList.contains('text')) {
        textBlock(column);
      }

      if (column.classList.contains('title')) {
        titleBlock(column);
      }

      if (column.classList.contains('flex')) {
        flexBlock(column);
      }

      if (column.classList.contains('xfreference')) {
        if (column.querySelector('.horizontalRule')) {
          xReferenceBlock(column);
        } else {
          textBlock(column);
        }
      }
    });
  });

  const sectionCells = [
    ['Section metadata'],
    ['style', 'dark, xl spacing, 4-up'],
  ];
  const sectionTable = WebImporter.DOMUtils.createTable(sectionCells, document);
  sectionTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), sectionTable);
}
