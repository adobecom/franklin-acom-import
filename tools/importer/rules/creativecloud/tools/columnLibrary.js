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
  let alltables = [];
  const tableName2 = 'text';
  const tableName3 = 'text (full-width)';

  const cellsHeading = [[tableName1]];
  cellsHeading.push([[blockHeading]]);
  const table1 = WebImporter.DOMUtils.createTable(cellsHeading, document);
  table1.classList.add('import-table');

  //const cellsContent = [[tableName2]];
  let startIndex = 0;
  alltables.push(document.createElement('hr'));
  textContent.forEach((text, index) => {
    if (index % 3 === 0) {
      startIndex += 1;
    }
    const cellsContent = [[tableName2]]
    cellsContent.push([text.cloneNode(true)]);
    const table2 = WebImporter.DOMUtils.createTable(cellsContent, document);
    table2.classList.add('import-table');
    alltables.push(table2);
  });

  const sectionCells = [['section-metadata']];
  sectionCells.push([['style'], ['four up, l gap']]);
  const bgColor = block.querySelector('div[data-bgcolor]')?.dataset.bgcolor;
  if (bgColor) {
    sectionCells.push(['background', block.querySelector('div[data-bgcolor]')?.dataset.bgcolor]);
  }
  const table4 = WebImporter.DOMUtils.createTable(sectionCells, document);
  table4.classList.add('import-table');
  alltables.push(table4);

  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), table1);
  console.log("All data: "+alltables[0].innerHTML)
  table1.after(...alltables);
}
