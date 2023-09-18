/* global WebImporter */
export default function createPromoColumn(block, document) {
  const elements = [...block.querySelectorAll('.text, .image')];

  const tableName = 'Remove this block';
  const cells = [[tableName]];
  cells.push([[]]);
  while (elements[0].parentElement === block.querySelector('.text').parentElement) {
    cells[1][0].push(elements.shift().cloneNode(true));
  }
  cells.push([]);
  while (elements.length > 0) {
    cells[2].push([]);
    cells[2][cells[2].length - 1].push(elements.shift().cloneNode(true));
    cells[2][cells[2].length - 1].push(elements.shift().cloneNode(true));
    cells[2][cells[2].length - 1].push(elements.shift().cloneNode(true));
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  const sectionMetadata = [['section-metadata']];
  const bgColor = block.querySelector('div[data-bgcolor]')?.dataset.bgcolor;
  const bgImage = block.querySelector('div[style]')?.getAttribute('style').split('"')[1];
  if (bgImage) {
    const bgImageElement = document.createElement('img');
    bgImageElement.src = bgImage;
    sectionMetadata.push([['style'], ['dark, xl spacing']]);
    sectionMetadata.push(['background', bgImageElement]);
  } else if (bgColor) {
    sectionMetadata.push(['background', block.querySelector('div[data-bgcolor]')?.dataset.bgcolor]);
  }
  const sectionMetadataTable = WebImporter.DOMUtils.createTable(sectionMetadata, document);
  sectionMetadataTable.classList.add('import-table');
 
  const emptyTable = [];
  //block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), emptyTable);
  //table.after(sectionMetadataTable);
}
