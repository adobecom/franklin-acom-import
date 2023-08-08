/* global WebImporter */

let alltables = [];

const createTextBlock = (textElement, document) => {
  const title = textElement.querySelector('h1,h2');
  const cells = [['text(intro, center)']];
  const cellContent = document.createElement('div');
  if (title) {
    cellContent.appendChild(title);
  }
  const paras = textElement.querySelectorAll('.text p');
  paras.forEach((para) => {
    if (!para.querySelector('a')) {
      const detail = document.createElement('p');
      detail.innerHTML = para.textContent;
      cellContent.appendChild(detail);
    }
  });
  const links = textElement.querySelectorAll('.text a');
  links.forEach((link) => {
    cellContent.appendChild(link);
  });
  if (cellContent.childElementCount) {
    cells.push([cellContent]);
  }
  const table1 = WebImporter.DOMUtils.createTable(cells, document);
  table1.classList.add('import-table');
  const textSectionCells = [['section-metadata']];
  textSectionCells.push([['background'], ['#f5f5f5']]);
  const table2 = WebImporter.DOMUtils.createTable(textSectionCells, document);
  table2.classList.add('import-table');
  alltables.push(document.createElement('hr'));
  alltables.push(table1)
  alltables.push(table2)
  //alltables.push(document.createElement('hr'));
  //textElement.replaceWith(table1);
  //table1.after(table2);
  //table2.after(document.createElement('hr'));
};


export default function createMediaCardsBlock(block, document) {
  const containers = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items'),
  ].filter((c) => {
    if (c.childElementCount < 2) return false;
    let ancestor = c;
    let keep;
    do {
      ancestor = ancestor.parentElement.closest(
        '.dexter-FlexContainer-Items',
      );
      keep = !ancestor || ancestor.childElementCount < 2;
    } while (ancestor && keep);
    return keep;
  });

  console.log("LENGTH: "+containers.length);
  containers.forEach((container) => {
    const columns = [...container.children];
    if (columns.length === 0) return;
    if (columns.length > 0 && columns[0].classList.contains('text')) {
      createTextBlock(columns[0], document);
      columns.shift();
    } else {
      const title = block.querySelector('.title');
      if (title) {
        createTextBlock(title, document);
      }
      const text = block.querySelector('.text');
      if (text) {
        createTextBlock(text, document);
      }
    }
  alltables.push(document.createElement('hr'));
  const allMediaBlocks = container.querySelectorAll('.flex')
  Array.from(allMediaBlocks).forEach((child) => { 
      let mediaBlock = [['Media(large)']];     
      mediaBlock.push([]);
      const imageList = child.querySelector('.dexter-Image');
      const textList = child.querySelector('.text.hawks-Body3--quiet');
      mediaBlock[1].push([imageList.cloneNode(true)]);
      mediaBlock[1].push([]);
      mediaBlock[1][1].push(textList.cloneNode(true));
      const table = WebImporter.DOMUtils.createTable(mediaBlock, document);
      table.classList.add('import-table'); 
      alltables.push(table);
  });
  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'Three up'],
    ['background', '#f5f5f5'],
  ];
  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');
  alltables.push(sectionMetaDataTable);

});  
 
  block.replaceWith(...alltables);

  }



  /*const lengthCheck = children.length === 2;
  const firstElementCheck = children[0]
    && (children[0].classList.contains('position')
      || children[0].classList.contains('flex'));
  const secondElementCheck = children[1] && children[1].classList.contains('flex');
  const anotherVersionFlag = lengthCheck && firstElementCheck && secondElementCheck;
  if (anotherVersionFlag) {
    const cells = [['text'], [children[0]]];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');

    const flexItemsParent = children[1].querySelector(
      '.dexter-FlexContainer .dexter-FlexContainer-Items',
    );
    const flexItems = [...flexItemsParent.children];
    flexItems.forEach((flex) => {
      const cardCells = [['Media']];
      const row = [];
      attachBackgroundImage(flex, document);
      row.push(flex.innerHTML);
      cardCells.push(row);
      const cardTable = WebImporter.DOMUtils.createTable(cardCells, document);
      cardTable.classList.add('import-table');
      flex.replaceWith(cardTable);
    });*/
    
   //block.before(document.createElement('hr'));
    /*block.replaceWith(
      table,
      ...block.querySelectorAll('.import-table'),
      sectionMetaDataTable,
    );
  //}*/
  //return anotherVersionFlag;


