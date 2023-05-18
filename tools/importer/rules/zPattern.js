const zPatternVariation = (zPatternHeight) => {
  let variation = '';
  switch (zPatternHeight) {
    case 303:
      variation = 'z-pattern (small)';
      break;
    case 350:
      variation = 'z-pattern (large)';
      break;
    default:
      variation = 'z-pattern';
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

  if (containers.length) {
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
  } else {
    const cells = [[zPatternVariation(blockHeight)]];
    // empty row for title and description
    cells.push([' ']);
    const row = [];
    const videoWrapper = block.querySelector('.video-Wrapper source');
    const parent = videoWrapper.parentElement;
    if (videoWrapper) {
      const backgroundVideoURL = videoWrapper.getAttribute('src');
      const a = document.createElement('a');
      a.innerHTML = backgroundVideoURL;
      a.setAttribute('href', backgroundVideoURL);
      row.push([a]);
    }
    const cellContent = document.createElement('div');
    const images = block.querySelectorAll('.image img');
    images.forEach((image) => {
      cellContent.appendChild(image);
    });
    const title = block.querySelector('.title h2');
    if (title) {
      cellContent.appendChild(title);
    }
    const paras = block.querySelectorAll('.text p');
    paras.forEach((para) => {
      if (!para.querySelector('a')) {
        const detail = document.createElement('p');
        detail.innerHTML = para.textContent;
        cellContent.appendChild(detail);
      }
    });

    if (cellContent.childElementCount) {
      row.push([cellContent]);
    }
    if (row.length) {
      cells.push(row);
    }
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table', 'z-pattern-table');
    parent.replaceWith(table);
  }
  const previousTable = block.previousElementSibling;
  if (previousTable && previousTable.classList.contains('z-pattern-table')) {
    previousTable.appendChild(block.querySelectorAll('.import-table tr')[2]);
    block.remove();
  } else {
    block.before(document.createElement('hr'));
    let finalTable = null;
    [...block.querySelectorAll('.import-table')].forEach((table, index) => {
      if (index) {
        finalTable.appendChild(table.querySelectorAll('tr')[2]);
      } else {
        finalTable = table;
      }
    });
    block.replaceWith(finalTable);
  }
}
