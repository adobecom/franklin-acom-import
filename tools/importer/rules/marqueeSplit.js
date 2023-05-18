const BASE_URL = 'https://www.adobe.com';

function makeBGImage(block, document, alt) {
  const bgImage = block?.querySelector('div[style]');
  const image = bgImage?.getAttribute('style').split('"')[1];

  let imageUrl = [];
  if (image.indexOf('http://localhost:3001') !== -1) {
    imageUrl = image.split('http://localhost:3001');
  }
  const imageTag = document.createElement('img');
  imageTag.src = BASE_URL + imageUrl[1];
  imageTag.alt = alt;
  return imageTag;
}

export default function createMarqueeSplitBlocks(block, document) {
  const cells = [['marquee (split, one-third, dark)']];

  let marqueeWrapper = block.querySelector('.aem-Grid');
  //Check if there is a wrapper inside a wrapper
  if(marqueeWrapper.childElementCount < 2){
    marqueeWrapper = marqueeWrapper.querySelector('.aem-Grid');
  }

  const imageWrapper = marqueeWrapper.children[0];
  const contentWrapper = marqueeWrapper.children[1];

  //Marquee button
  const spectrumButton = contentWrapper.querySelector('.spectrum-Button');
  if(spectrumButton) {
    const btnWrapper = document.createElement('a');
    btnWrapper.href = BASE_URL + spectrumButton.href;
    let btnContent = null;
    if(spectrumButton?.classList.contains('doccloud-Button--blue') ||
      spectrumButton?.classList.contains('spectrum-Button--accent')){
      btnContent = document.createElement('b');
    }
    if(spectrumButton?.classList.contains('doccloud-Button--white')){
      btnContent = document.createElement('i');
    }

    btnContent.textContent = spectrumButton.textContent;
    btnWrapper.appendChild(btnContent);
    spectrumButton.replaceWith(btnWrapper);
  }

  const image = imageWrapper.querySelector('img');

  const bgImage = makeBGImage(block, document, image?.alt);
  if(bgImage){
    cells.push([bgImage]);
  }

  cells.push([contentWrapper]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.replaceWith(table);
}
