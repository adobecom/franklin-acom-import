/* global WebImporter */
export default function createCardSection(block, document) {
  const containers = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items  .container'),
  ];
  containers.forEach((container) => {
    const cardCells1 = [['card']];
    const row1 = [];
    row1.push(container.cloneNode(true));
    cardCells1.push(row1);
    const cardsTable1 = WebImporter.DOMUtils.createTable(cardCells1, document);
    cardsTable1.classList.add('import-table');
    container.replaceWith(cardsTable1);
  });
  block.replaceWith(...block.querySelectorAll('.import-table'));
}
