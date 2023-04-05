/* global WebImporter */
export default function createPlanAndPricing(block, document) {
  const allImages = [...block.querySelectorAll('.image')];
  const allText = [...block.querySelectorAll('.text')];
  const button = block.querySelector('.cta');

  const tableName1 = 'columns (contained)';
  const tableName2 = 'text (full-width)';
  const tableName3 = 'section-metadata';
  const cells = [[tableName1]];
  cells.push([]);
  cells.push([]);

  allImages.forEach((image) => {
    cells[1].push([image.cloneNode(true)]);
  });

  allText.forEach((text) => {
    cells[2].push([text.cloneNode(true)]);
  });

  const table1 = WebImporter.DOMUtils.createTable(cells, document);
  table1.classList.add('import-table');

  const buttonCells = [[tableName2]];
  const boldElement = document.createElement('b');
  boldElement.appendChild(button);
  buttonCells.push([[boldElement.cloneNode(true)]]);

  const table2 = WebImporter.DOMUtils.createTable(buttonCells, document);
  table2.classList.add('import-table');

  const sectionCells = [[tableName3]];
  sectionCells.push([['style'], ['dark, xl spacing']]);
  const table3 = WebImporter.DOMUtils.createTable(sectionCells, document);
  table3.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), table1);
  table1.after(table2);
  table2.after(table3);
  block.after(document.createElement('hr'));
}
