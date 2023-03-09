
const zPatternVariation = (zPatternHeight) => {
  let variation = '';
  switch (zPatternHeight) {
    case 303:
      variation = 'zPattern (small)';
      break;
    case 350:
      variation = 'zPattern (large)';
      break;
    default:
      variation = 'zPattern';
      break;
  }
  return variation;
};

/* global WebImporter */
export default function createZPatternBlock(block, document) {
  const blockHeight = parseInt(block.getAttribute('data-height'), 10);
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
    const cells = [[zPatternVariation(blockHeight)]];
    // empty row for title and description
    cells.push([' ']);
    const row = [];
    columns.forEach((col) => {
      row.push(col.innerHTML);
    });
    cells.push(row);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table', 'z-pattern-table');
    container.replaceWith(table);
  });
  const previousTable = block.previousElementSibling;
  if (previousTable && previousTable.classList.contains('z-pattern-table')) {
    previousTable.appendChild(block.querySelectorAll('.import-table tr')[2]);
    block.remove();
  } else {
    block.before(document.createElement('hr'));
    block.replaceWith(...block.querySelectorAll('.import-table'));
  }
}
