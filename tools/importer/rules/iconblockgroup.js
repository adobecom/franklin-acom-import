const BASE_URL = 'https://www.adobe.com';

export default function createIconBlockGroup(block, document){
  const iconBlocks = block.querySelector('.dexter-FlexContainer-Items').children;
  const tables = [];
  let text = null;
  let productBlade = false;
  let cardText = '';

  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    if(!link.href.includes('https')){
      link.href = BASE_URL + link.href;
    }
  });

  Array.from(iconBlocks).forEach((iconBlock) => {
    console.log("classList: "+iconBlock.classList);
    if(iconBlock.classList.contains('position')){
      text = iconBlock.cloneNode(true);  
      const cells = [['text']];
    cells.push([text]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');    
    tables.push(table);
    const sectionMetadataCells = [['Section Metadata'], ['style', 'xl-spacing, grid width 10']];
    const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
      sectionMetadataCells,
      document,
    ); 
    sectionMetaDataTable.classList.add('import-table');
    tables.push(sectionMetaDataTable);
    tables.push(document.createElement('hr'));
      return;
    }
    if(iconBlock.classList.contains('xfreference')){
      productBlade = true;
      return;
    }
    if(iconBlock.classList.contains('spectrum-Display')){
      cardText = iconBlock.cloneNode(true); 
      //cardText = true;
      return;
    }    
    let iconBlockChildren1 = iconBlock.children;
    let iconBlockChildren2 = iconBlockChildren1[1].children;
    let iconBlockChildren3 = iconBlockChildren2[0].children;
    Array.from(iconBlockChildren3).forEach((iconBlockChild) => {     
    const cells = [['icon-block (vertical, medium, xs-spacing)']];
    cells.push([iconBlockChild]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    tables.push(table); 
    });
  });

  let style = 'two up, grid width 10';

  if(tables.length === 5){
    style = 'two up, grid width 10';
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

  if(productBlade){
    const iconBlock = document.createElement('a');
    iconBlock.href = 'https://main--cc--adobecom.hlx.page/cc-shared/fragments/seo-articles/product-blade-illustrator';
    iconBlock.textContent = 'https://main--cc--adobecom.hlx.page/cc-shared/fragments/seo-articles/product-blade-illustrator';
    sectionMetaDataTable.after(iconBlock);
    iconBlock.before(document.createElement('hr'));
  }
  if(cardText){
    //text = iconBlock.cloneNode(true);  
    const cells = [['text (center, m-spacing)']];
    cells.push([cardText]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');   
    sectionMetaDataTable.after(table);
    table.before(document.createElement('hr'));
  }
};