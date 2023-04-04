/* global WebImporter */
export default function createIconBlock(block, document) {
  const containers = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items'),
  ].filter((c) => {
    // ignore empty containers and single element containers
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
    const parentDiv = document.createElement('div');
    let columnTable = null;
    columns.forEach((column) => {
      if (column.classList.contains('image')) {
        parentDiv.appendChild(column.querySelector('img'));
      }
      if (column.classList.contains('title')) {
        parentDiv.appendChild(column);
      }
      if (column.classList.contains('text')) {
        parentDiv.appendChild(column);
      }
      if (column.classList.contains('flex')) {
        const flexParent = column.querySelector('.dexter-FlexContainer > .dexter-FlexContainer-Items');
        const flexItems = [...flexParent.children];
        const columnCells = [['Columns']];
        const row = [];
        flexItems.forEach((flex) => {
          row.push(flex);
        });
        columnCells.push(row);
        columnTable = WebImporter.DOMUtils.createTable(columnCells, document);
        columnTable.classList.add('import-table');
      }
    });
    const cells = [['icon-block (fullwidth, large)'], [parentDiv]];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    container.replaceWith(table, columnTable);
  });
  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'));
}
