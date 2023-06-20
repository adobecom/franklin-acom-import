const makeImage = (node, document) => {
  const imageTags = node.querySelectorAll('img');
  let imgLink = null;
  let imgSrc = null;
  imageTags.forEach((image) => {
    if (imgSrc) {
      return;
    }
    const alt = image.getAttribute('alt');
    const src = image.getAttribute('src');
    if (alt) {
      if (src && src.indexOf('https') === -1) {
        imgSrc = `https://www.adobe.com/${image.getAttribute('src')}`;
      } else {
        imgSrc = image.getAttribute('src');
      }

      if (imgSrc.includes('.svg')) {
        imgLink = document.createElement('a');
        imgLink.innerHTML = imgSrc;
        imgLink.setAttribute('href', imgSrc);
      } else {
        imgLink = document.createElement('img');
        imgLink.setAttribute('src', imgSrc);
        imgLink.setAttribute('alt', alt);
      }
    }
  });
  return imgLink;
};

const makeText = (node, document) => {
  const textDiv = document.createElement('div');
  const headingText = node.querySelector('.cmp-title h3');
  if (headingText) {
    textDiv.appendChild(headingText);
  }

  const mediaContent = node.querySelectorAll('.text .cmp-text');
  if (mediaContent && mediaContent.length > 0) {
    mediaContent.forEach((media) => {
      textDiv.appendChild(media);
    });
  }

  const cta = node.querySelector('.cta > .dexter-Cta > a');

  const href = cta?.getAttribute('href');

  const ctaText = cta?.querySelector(
    ':scope > .spectrum-Button-label',
  )?.textContent;
  if (ctaText) {
    const ctaAnchor = document.createElement('a');
    ctaAnchor.setAttribute('href', href);
    const iCta = document.createElement('i');
    iCta.textContent = ctaText;
    ctaAnchor.appendChild(iCta);
    textDiv.appendChild(ctaAnchor);
  }
  return textDiv;
};

export default function mediaBlock(block, document, config) {
  const { additionalSection = [] } = config;
  const cells = [['Media']];
  const { children = [] } = block;
  const elements = [...children].map((node) => {
    if (node.className === 'image parbase') {
      const image = makeImage(node, document);
      return image;
    }
    const textElement = makeText(node, document);
    return textElement;
  });
  if (elements.length > 0) {
    cells.push(elements);
  }
  const table = window.WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  const sectionMetaDataCells = [['Section Metadata'], ...additionalSection];
  const sectionTable = window.WebImporter.DOMUtils.createTable(
    sectionMetaDataCells,
    document,
  );
  sectionTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table, sectionTable);
}
