/* global WebImporter */
export default function createImage(block, document) {
  const cells = [['text(full-width)']];
  cells.push([block.cloneNode(true)]);
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
