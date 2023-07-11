const BASE_URL = 'https://www.adobe.com';

function makeBG(block, document) {
  let bgImage = makeBGImage(block, document);
  let bgColor = makeBGColor(block);

  if(!bgImage || !bgColor){
    const styles = block?.querySelector('style')?.innerHTML.split(':');
    for(let i = 0; i < styles?.length; i++){
      if(styles[i].includes('url') && !bgImage){
        const url = styles[i].split(/[()]/ig)[1].split('\\2f').map((e) => e.trim()).join('/').trim();
        const imageTag = document.createElement('img');
        imageTag.src = BASE_URL + url;
        bgImage = imageTag;
      }
      if(styles[i].includes('background-color') && !bgColor){
        bgColor = styles[i+1].trim().split(';')[0];
      }
    }
  }

  return { bgImage, bgColor};
}

function makeBGColor(block) {
  return (
    block.querySelector('div[data-bgcolor]')?.getAttribute('data-bgcolor')
    ?? null
  );
}

function makeBGImage(block, document) {
  const bgImage = block?.querySelector('div[style]');
  const image = bgImage?.getAttribute('style').split('"')[1];
  let imageUrl = [];
  if (image && image.indexOf('http://localhost:3001') !== -1) {
    imageUrl = image.split('http://localhost:3001');
  }
  if(imageUrl.length){
    const imageTag = document.createElement('img');
    imageTag.src = `https://www.adobe.com${imageUrl[1]}`

    return imageTag;
  }

  return null;
}


function marqueeSize(block) {
  const marqueeHeight = parseInt(block?.getAttribute('data-height') ?? 0, 10);
  let size = '';
  if(marqueeHeight < 360){
    size = 'small';
  }

  return size;
}

function makeBtn(buttonDiv, document) {
  const button = buttonDiv.querySelector('.spectrum-Button');
  const btnWrapper = document.createElement('a');
  btnWrapper.href = BASE_URL + button.href;
  let btnContent = null;
  if(button?.classList.contains('doccloud-Button--blue') ||
    button?.classList.contains('spectrum-Button--accent')){
    btnContent = document.createElement('b');
  }
  if(button?.classList.contains('doccloud-Button--white')){
    btnContent = document.createElement('i');
  }

  btnContent.textContent = button.textContent;
  btnWrapper.appendChild(btnContent);
  const playLink = buttonDiv.querySelector('.spectrum-Link');
  const btnGroup = document.createElement('div');

  if(playLink){
    const playIcon = document.createElement('span');
    playIcon.textContent = ':play-circle:'
    btnGroup.append(btnWrapper, playIcon, playLink);
  }

  return playLink ? btnGroup : btnWrapper;
}

function makeParagraph(paragraph, document){
  if(paragraph.classList.contains('title')){
    const p = document.createElement('p');
    p.textContent = div.textContent;
    return p;
  }

  return paragraph;
}

function makeContent(contentDiv, document) {
  const newContent = document.createElement('div');
  const contentDivs = contentDiv.querySelectorAll('.text, .title');
  let preTitle = null;
  let title = null;
  let paragraph = null;
  let btn = null;
  if(contentDivs.length % 3 === 0){
    preTitle = contentDivs[0];
    title = contentDivs[1];
    paragraph = makeParagraph(contentDivs[2]);
  }else{
    title = contentDivs[0];
    paragraph = makeParagraph(contentDivs[1]);
  }

  const btnDiv = contentDiv.querySelector('.cta, .flex');
  if(btnDiv){
    btn = makeBtn(btnDiv, document);
  }

  [preTitle, title, paragraph, btn].forEach((el) => {
    if(el){
      newContent.appendChild(el);
    }
  });

  return newContent;
}

function createMetadata(bgColor, document){
  if(bgColor){
    const sectionMetadataCells = [['Section Metadata'], ['background', bgColor]];
    const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
      sectionMetadataCells,
      document,
    );
    sectionMetaDataTable.classList.add('import-table');

    return sectionMetaDataTable;
  }
}

export default function createMarqueeVariantsBlocks(block, document, variation) {
  // console.log(blockHeight);
  const size = marqueeSize(block);
  const {bgImage, bgColor} = makeBG(block, document);
  const image = block.querySelector('img');
  const cells = [];
  let tableName = 'marquee ';
  const contentRow = [];
  const bgRow = [];
  const marqueeAttributes = [];

  let marqueeWrapper = block.querySelector('.aem-Grid');
  //Check if there is a wrapper inside a wrapper
  if(marqueeWrapper?.childElementCount < 2){
    marqueeWrapper = marqueeWrapper.querySelector('.aem-Grid');
  }

  if(variation === 'split'){
    marqueeAttributes.push('split', 'one-third', 'dark');
    const contentWrapper = marqueeWrapper.children.length > 2 ? marqueeWrapper : marqueeWrapper.children[1];
    const content = makeContent(contentWrapper, document);
    bgRow.push(bgColor);
    contentRow.push(content, image);
  }else if(variation === 'right'){
    marqueeAttributes.push('light');
    const contentWrapper = block.querySelector('.position');
    const content = makeContent(marqueeWrapper ? marqueeWrapper : contentWrapper, document);
    bgRow.push('','', bgImage);
    contentRow.push('', content);
  }else {
    const contentWrapper = block.querySelector('.position');
    marqueeAttributes.push('light');
    bgRow.push('', '', bgImage);
    const content = makeContent(contentWrapper, document);
    contentRow.push(content);
    block.before(document.createElement('hr'));
  }

  size && marqueeAttributes.push(size);
  tableName += `(${marqueeAttributes.join(', ')})`

  cells.push([tableName], bgRow, contentRow);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  if(variation !== 'split'){
    const sectionMetaDataTable = createMetadata(bgColor, document);
    block.after(sectionMetaDataTable);
  }
  block.replaceWith(table);
}

