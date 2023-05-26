import createHorizontalcardBlocks from './horizontalCard.js';
const BASE_URL = 'https://www.adobe.com';

const getTableName = (element, index, dataLength, imageFirst) => {
  const inset = element.getAttribute('data-borderleft');
  let block = 'long-form'
  let size = 'l-body';
  let spacing = 'xl spacing bottom';

  if(index === 0 || (index === 1 && imageFirst)){
    size = 'large';
  }
  if(index === dataLength - 1){
    spacing = 'no spacing';
  }

  if(inset){
    block = 'inset';
    spacing = 'no spacing';
  }

  return `text(${block}, ${size}, ${spacing})`;
}

export default function createLongFormTextBlocks(block, document) {
  let allData = [...block.querySelectorAll('.text, .image, .title, .spectrum-Button')];
  if(allData.length > 1){
    allData = allData.filter((el, index) => {
      if(el.classList.contains('text') || el.classList.contains('spectrum-Button')){
        return el;
      }
      if(el.classList.contains('image') && index === 0){
        return el;
      }
    });
  }

  //Alter links
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    if(!link.href.includes('https')){
      link.href = BASE_URL + link.href;
    }
  });

  let imageFirst = false;
  let cardFirst = false;
  allData.forEach((element, index) => {
    const textDiv = document.createElement('div');
    let tableName = getTableName(element, index, allData.length, imageFirst);

    if(index === 0 && element.classList.contains('image')){
      textDiv.appendChild(element.cloneNode(true));
      tableName = 'text(full width, no spacing top, xl spacing bottom)';
      imageFirst = true;
    }else if(element.classList.contains('text')){
      const cardEl = element.closest('.xfreference');
      if(cardEl){
        if(cardFirst){
          return;
        }
        createHorizontalcardBlocks(cardEl, document, true);
        cardFirst = true;
      }
      let previousElement = element.previousElementSibling;
      if(previousElement?.classList.contains('title')){
        const tmpPreviousElement = previousElement.previousElementSibling;
        textDiv.appendChild(previousElement);
        previousElement = tmpPreviousElement;
      }

      textDiv.appendChild(element.cloneNode(true));

      let nextElement = element.nextElementSibling;
      if(nextElement?.classList.contains('image')){
        const tmpNextElement = nextElement.nextElementSibling;
        textDiv.appendChild(nextElement);
        nextElement = tmpNextElement;
      }

      if(nextElement?.classList.contains('horizontalRule')){
        const hr = document.createElement('hr');
        textDiv.appendChild(hr);
      }
    }else if(element.classList.contains('title') && allData.length === 1){
      tableName = 'text(full width, no spacing)';
      textDiv.appendChild(element.cloneNode(true));
    }else if(element.classList.contains('spectrum-Button')){
      tableName = 'text(full width, no spacing)';
      const btnWrapper = document.createElement('a');
      btnWrapper.href = element.href;
      let btnContent = null;
      if(element?.classList.contains('doccloud-Button--blue') ||
        element?.classList.contains('spectrum-Button--accent')){
        btnContent = document.createElement('b');
      }
      if(element?.classList.contains('doccloud-Button--white')){
        btnContent = document.createElement('i');
      }

      btnContent.textContent = element.textContent;
      btnWrapper.appendChild(btnContent);
      textDiv.appendChild(btnWrapper);
    }else{
      return;
    }

    const cells = [[tableName]];
    cells.push([textDiv]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    element.replaceWith(table);
  });

  const bgcolor = block
    .querySelector('div[data-bgcolor]')
    ?.getAttribute('data-bgcolor');
  const background = bgcolor || '';
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
  block.replaceWith(...block.querySelectorAll('.import-table'), sectionMetaDataTable);
}
