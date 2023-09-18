/* global WebImporter */
export default function createZTileContent(block, document) {
  const elements = [...block.querySelectorAll('.text, .image')];
  let alltables = [];

  /** Text block */
  let i = 0;
  const cellsHeading = [['text (center, xl spacing)']];
  cellsHeading.push([[]]);
  while (true && i < 10) {
    if (elements[0].classList.contains('image')) {
      break;
    }
    const firstText = elements.shift();  
    cellsHeading[1][0].push(firstText.cloneNode(true)); 
    i += 1;
  }
  const table1 = WebImporter.DOMUtils.createTable(cellsHeading, document);
  table1.classList.add('import-table');
  alltables.push(document.createElement('hr'));
  alltables.push(table1);
  const textSectionCells = [['section-metadata']];
  textSectionCells.push([['background'], ['#f5f5f5']]);
  const table2 = WebImporter.DOMUtils.createTable(textSectionCells, document);
  table2.classList.add('import-table');
  alltables.push(table2);
  alltables.push(document.createElement('hr'));

  /** Icon block */
  const iconBlock = [['icon-block (inline, small)']];
  iconBlock.push([[]]);

  const tileImage = elements.shift();
  const imageHref = tileImage.querySelector('a').getAttribute('href');
  const productIcon = imageHref.split('/')[2].replaceAll('.html','');
  const tileText = elements.shift();
  const removeElem = tileText.querySelector('[href*="#"]');
  const removeParentElem = tileText.querySelector('b');
  tileText.remove(removeElem);
  removeParentElem.replaceWith(...removeParentElem.childNodes);
  const allAnchorLinks = tileText.querySelectorAll('a');
  allAnchorLinks.forEach((el) => {
    //const elLink  = el.querySelector('a');
    if (el && el.href.indexOf('https') === -1) {
      el.href =`https://www.adobe.com${el.href.replaceAll('http://localhost:3001','')}`;
    }
  });
  console.log("tileText: "+tileText.innerHTML);
  const anchor = document.createElement('a');
  anchor.href = `https://main--cc--adobecom.hlx.page/assets/img/product-icons/svg/${productIcon}.svg`;
  anchor.textContent = `https://main--cc--adobecom.hlx.page/assets/img/product-icons/svg/${productIcon}.svg | ${productIcon}`;
  iconBlock[1][0].push(anchor);
  iconBlock[1][0].push(tileText.cloneNode(true));
  console.log("Icon block length: "+iconBlock.length);
  const table3 = WebImporter.DOMUtils.createTable(iconBlock, document);
  table3.classList.add('import-table');
  alltables.push(table3);
  const iconSectionCells = [['section-metadata']];
  iconSectionCells.push([['style'], ['Grid width 6']]);
  iconSectionCells.push([['background'], ['#f5f5f5']]);
  const table4 = WebImporter.DOMUtils.createTable(iconSectionCells, document);
  table4.classList.add('import-table');
  alltables.push(table4);
  alltables.push(document.createElement('hr'));

  /** Media Block */

  const mediaBlock = [['Media(large)']];
  mediaBlock.push([]);
  const imageList = elements.filter((el) => el.classList.contains('image'));
  const textList = elements.filter((el) => el.classList.contains('text'));

  imageList.forEach((image) => {
    mediaBlock[1].push([image.cloneNode(true)]);
    mediaBlock[1].push([]);
    do {
      mediaBlock[1][1].push(textList.shift().cloneNode(true));
    } while (textList.length && !textList[0].querySelector('h1, h2, h3, h4'));
  });

  const table5 = WebImporter.DOMUtils.createTable(mediaBlock, document);
  table5.classList.add('import-table');
  alltables.push(table5);

  const mediaSectionCells = [['section-metadata']];
  mediaSectionCells.push([['style'], ['Xl spacing']]);
  mediaSectionCells.push([['background'], ['#f5f5f5']]);
  const table6 = WebImporter.DOMUtils.createTable(mediaSectionCells, document);
  table6.classList.add('import-table');
  alltables.push(table6);
  block.replaceWith(...alltables);
}
