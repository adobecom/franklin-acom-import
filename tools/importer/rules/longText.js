/* global WebImporter */
export default function longText(block, document) {
  const allData = [...block.querySelectorAll('.text,.image,.cta')];

  allData.forEach((element) => {
    let tableName = 'text(full-width)';
    if (element.classList.contains('image')) {
      tableName = 'columns';
    }
    const cells = [[tableName]];

    cells.push([element.cloneNode(true)]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    element.replaceWith(table);
  });
  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'));
}
