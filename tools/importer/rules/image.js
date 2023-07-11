/* global WebImporter */
export default function createImage(block, document) {
  const images = block.querySelectorAll('img');
  let cells = [];

  //if there are more than one image in block
  if(images.length > 1) {
    cells = [['columns(contained, middle)']];
    const row = [];
    images.forEach((image) => {
      row.push(image.cloneNode(true));
    });
    cells.push(row);
  }else{
    cells = [['text(full-width, no spacing)']];
    cells.push([block.cloneNode(true)]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  // section metadata
  const bgImage = block
    .querySelector('div[style]')
    ?.getAttribute('style')
    .split('"')[1];
  let bgImageElement = null;
  if (bgImage) {
    bgImageElement = document.createElement('img');
    bgImageElement.src = bgImage;
  }
  const bgcolor = block
    .querySelector('div[data-bgcolor]')
    ?.getAttribute('data-bgcolor');
  const background = bgImageElement || bgcolor || '';
  const sectionMetadataCells = [['Section Metadata'], ['style', 'xl spacing']];

  if (background) {
    sectionMetadataCells.push(['background', background]);
  }
  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table, sectionMetaDataTable);
}
