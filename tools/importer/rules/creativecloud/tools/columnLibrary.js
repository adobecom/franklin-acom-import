/* global WebImporter */
export default function createColumnLibrary(block, document) {
  const allTextElements = [...block.querySelectorAll('.text')];
  const textContent = [];
  let blockHeading = '';
  let blockLink = '';

  allTextElements.forEach((element) => {
    if (element.querySelector('h2')) {
      blockHeading = element.querySelector('h2').cloneNode(true);
    } else if (element.querySelector('a')) {
      blockLink = element.querySelector('a').cloneNode(true);
    } else {
      textContent.push(element);
    }
  });

  const tableName1 = 'text (full-width)';
  const tableName2 = 'columns (contained)';
  const tableName3 = 'text (full-width)';

  const cellsHeading = [[tableName1]];
  cellsHeading.push([[blockHeading]]);
  const table1 = WebImporter.DOMUtils.createTable(cellsHeading, document);
  table1.classList.add('import-table');

  const cellsContent = [[tableName2]];
  let startIndex = 0;
  textContent.forEach((text, index) => {
    if (index % 3 === 0) {
      startIndex += 1;
    }
    if (cellsContent.length < startIndex + 1) {
      cellsContent.push([]);
    }
    cellsContent[startIndex].push([text.cloneNode(true)]);
  });

  const table2 = WebImporter.DOMUtils.createTable(cellsContent, document);
  table2.classList.add('import-table');

  const cellsLink = [[tableName3]];
  cellsLink.push([[blockLink]]);
  const table3 = WebImporter.DOMUtils.createTable(cellsLink, document);
  table3.classList.add('import-table');

  const sectionCells = [['section-metadata']];
  sectionCells.push([['style'], ['xl spacing']]);
  const bgColor = block.querySelector('div[data-bgcolor]')?.dataset.bgcolor;
  if (bgColor) {
    sectionCells.push(['background', block.querySelector('div[data-bgcolor]')?.dataset.bgcolor]);
  }
  const table4 = WebImporter.DOMUtils.createTable(sectionCells, document);
  table4.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), table1);
  table1.after(table2);
  table2.after(table3);
  table3.after(table4);
}
