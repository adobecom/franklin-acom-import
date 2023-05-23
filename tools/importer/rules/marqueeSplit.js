const BASE_URL = 'https://www.adobe.com';

export default function createMarqueeSplitBlocks(block, document) {
  const cells = [['marquee (split, one-third, dark)']];

  let marqueeWrapper = block.querySelector('.aem-Grid');
  //Check if there is a wrapper inside a wrapper
  if(marqueeWrapper.childElementCount < 2){
    marqueeWrapper = marqueeWrapper.querySelector('.aem-Grid');
  }

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

  const bgcolor = block
    .querySelector('div[data-bgcolor]')
    ?.getAttribute('data-bgcolor');

  if(bgcolor){
    cells.push([bgcolor]);
  }
  const image = block.querySelector('img');

  cells.push([contentWrapper, image]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.replaceWith(table);
}
