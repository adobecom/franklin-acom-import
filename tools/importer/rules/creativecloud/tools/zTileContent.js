/* global WebImporter */
export default function createZTileContent(block, document) {
  const elements = [...block.querySelectorAll('.text, .image')];

  const tableName = 'z-pattern';
  const cells = [[tableName]];
  cells.push([[]]);
  let i = 0;
  while (true && i < 10) {
    if (elements[0].classList.contains('image')) {
      break;
    }
    const firstText = elements.shift();
    cells[1][0].push(firstText.cloneNode(true));
    i += 1;
  }

  const tileImage = elements.shift();
  const tileText = elements.shift();
  cells.push([]);
  cells[2].push([tileImage.cloneNode(true)]);
  cells[2].push([tileText.cloneNode(true)]);

  const imageList = elements.filter((el) => el.classList.contains('image'));
  const textList = elements.filter((el) => el.classList.contains('text'));

  imageList.forEach((image) => {
    cells.push([]);
    cells[cells.length - 1].push([image.cloneNode(true)]);
    cells[cells.length - 1].push([]);
    do {
      cells[cells.length - 1][1].push(textList.shift().cloneNode(true));
    } while (textList.length && !textList[0].querySelector('h1, h2, h3, h4'));
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  const sectionMetadata = [['section-metadata']];
  sectionMetadata.push([['style'], ['xl spacing']]);
  const bgColor = block.querySelector('div[data-bgcolor]')?.dataset.bgcolor;
  if (bgColor) {
    sectionMetadata.push(['background', block.querySelector('div[data-bgcolor]')?.dataset.bgcolor]);
  }
  table.classList.add('import-table');
  const sectionMetadataTable = WebImporter.DOMUtils.createTable(sectionMetadata, document);
  sectionMetadataTable.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'), table);
  table.after(sectionMetadataTable);
}
