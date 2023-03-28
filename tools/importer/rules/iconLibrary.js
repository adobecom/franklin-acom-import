export default function iconLibrary(block, document) { 
  let heading = block.querySelector('.title h3');
  let para = block.querySelector('.text p');
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
  let allNodesCards = [...block.querySelectorAll('.dexter-FlexContainer-Items .flex .flex')];
  allNodesCards.forEach((container) => {
    const cells = [['card-horizontal']];
    const row = [];
    row.push(container.cloneNode(true));
    cells.push(row);
    const cardsTable = WebImporter.DOMUtils.createTable(cells, document);
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
