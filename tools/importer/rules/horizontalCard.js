const BASE_URL = 'https://www.adobe.com';

export default function createHorizontalcardBlocks(block, document, inText) {
  const cells = [['card-horizontal(tile)']];

  const cardDiv = document.createElement('div');
  const icon = block.querySelector('.image img');
  const text = block.querySelectorAll('.text');

  const link = block.querySelector('a');
  const href = BASE_URL + link.href;

  text.forEach((el) => {
    let wrapper = null;
    const content = el.querySelector('p');
    if(el.classList.contains('body-L')){
      wrapper = document.createElement('h2');
      const newLink = document.createElement('a');
      newLink.href = href;
      newLink.textContent = el.textContent;
      wrapper.appendChild(newLink);
    }else if(el.classList.contains('body-S')){
      wrapper = document.createElement('p');
      wrapper.textContent = el.textContent;
    }else{
      wrapper = content;
    }
    cardDiv.appendChild(wrapper);
  });

  cardDiv.appendChild(icon);
  cells.push([cardDiv]);

  const cardTable = WebImporter.DOMUtils.createTable(cells, document);
  cardTable.classList.add('import-table');
  block.before(document.createElement('hr'));

  if(!inText){
    const sectionMetadataCells = [['Section Metadata'], ['style', 'xl-spacing']];
    const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
      sectionMetadataCells,
      document,
    );
    block.after(sectionMetaDataTable);
  }

  block.replaceWith(cardTable);
}
