/* global WebImporter */
export default function createIconLibraryBlocks(block, document) {
  const heading = block.querySelector('.title h3');
  const para = block.querySelector('.text p');
  const newDiv = document.createElement('div');
  if (heading) {
    newDiv.appendChild(heading);
  }
  if (para) {
    newDiv.appendChild(para);
  }
  const cells = [['text(full-width)'], [newDiv]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  const allNodesCards = [...block.querySelectorAll('.dexter-FlexContainer-Items .flex .flex')];
  allNodesCards.forEach((container) => {
    const cardCells = [['card-horizontal']];
    const row = [];
    row.push(container.cloneNode(true));
    cardCells.push(row);
    const cardsTable = WebImporter.DOMUtils.createTable(cardCells, document);
    cardsTable.classList.add('import-table');
    container.replaceWith(cardsTable);
  });

  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'three-up,xxl spacing'],
  ];
  // section metadata Table
  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table, ...block.querySelectorAll('.import-table'), sectionMetaDataTable);
}
