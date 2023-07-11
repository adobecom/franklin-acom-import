const BASE_URL = 'https://www.adobe.com';

export default function createIconBlockGroup(block, document){
  const iconBlocks = block.querySelector('.dexter-FlexContainer-Items').children;
  const tables = [];
  let text = null;

  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    if(!link.href.includes('https')){
      link.href = BASE_URL + link.href;
    }
  });

  Array.from(iconBlocks).forEach((iconBlock) => {
    if(iconBlock.classList.contains('text')){
      text = iconBlock.cloneNode(true);
      return;
    }
    const cells = [['icon-block (vertical, center, medium, m-spacing)']];
    cells.push([iconBlock]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    tables.push(table);
  });

  let style = 'three up';

  if(tables.length === 2){
    style = 'two up, grid width 8';
  }


  const sectionMetadataCells = [['Section Metadata'], ['style', style]];
  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.after(sectionMetaDataTable);
  block.replaceWith(...tables);

  if(text){
    const cells = [['text (center, m-spacing)']];
    cells.push([text]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');

    sectionMetaDataTable.after(table);
    table.before(document.createElement('hr'));
  }
};
