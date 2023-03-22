/* global WebImporter */
const marqueeVariation = (marqueeHeight) => {
  let variation = '';
  switch (marqueeHeight) {
    case 360:
      variation = 'Marquee (small)';
      break;
    case 560:
      variation = 'Marquee';
      break;
    case 700:
      variation = 'Marquee (large)';
      break;
    default:
      variation = 'Marquee';
      break;
  }
  return variation;
};

export default function createMarqueeBlocks(block, document) {
  const blockHeight = parseInt(block.getAttribute('data-height'), 10);
  const textElement = document.createElement('div');

  // Create table for marquee
  const cells = [[marqueeVariation(blockHeight)]];

  // Check if marquee has background video
  const videoWrapper = block.querySelector('.video-Wrapper source');
  if (videoWrapper) {
    const backgroundVideoURL = videoWrapper.getAttribute('src');
    const a = document.createElement('a');
    a.innerHTML = backgroundVideoURL;
    a.setAttribute('href', backgroundVideoURL);
    cells.push([a]);
  } else {
    const bgImage = block.querySelector('div[style]');
    if (bgImage) {
      const image = bgImage?.getAttribute('style').split('"')[1];
      cells.push([image]);
    }
  }

  // Check if marquee has icon
  const images = block.querySelectorAll('img');
  images.forEach((image) => {
    let imgSrc = image.getAttribute('src');
    if (imgSrc && (imgSrc.indexOf('.svg') + 1)) {
      if (imgSrc.indexOf('https') === -1) {
        imgSrc = `https://www.adobe.com/${imgSrc}`;
      }
      const imgLink = document.createElement('a');
      imgLink.innerHTML = imgSrc;
      imgLink.setAttribute('href', imgSrc);
      textElement.appendChild(imgLink);
    }
  });

  // Check if marquee has h1 heading
  // let marqueeHeading = null;
  const heading = block.querySelector('h1') || block.querySelector('h2') || block.querySelector('h3');
  if (heading) {
    const allHeadings = [...block.querySelectorAll('h1,h2,h3')];
    const fragment = document.createDocumentFragment();
    allHeadings.forEach((head) => {
      fragment.append(head);
    });
    textElement.appendChild(fragment);
  }

  // Check if marquee has content
  if (block.querySelectorAll('p').length) {
    [...block.querySelectorAll('p')].forEach((para) => {
      let marqueeContent = null;
      marqueeContent = document.createElement('p');
      marqueeContent.innerHTML = para.innerHTML;
      textElement.appendChild(marqueeContent);
    });
  }

  // Check if marquee has white border cta
  let marqueeWhiteBorderButton = null;
  const button = block.querySelector('.spectrum-Button--overBackground') || block.querySelector('.spectrum-Button-cta--White') || block.querySelector('.spectrum-Button--staticWhite');
  if (button) {
    marqueeWhiteBorderButton = document.createElement('a');
    const italicsElement = document.createElement('I');
    italicsElement.appendChild(button);
    marqueeWhiteBorderButton.appendChild(italicsElement);
    marqueeWhiteBorderButton.setAttribute('href', button.getAttribute('href'));
    textElement.appendChild(marqueeWhiteBorderButton);
  }

  // Check if marquee has primary cta
  let marqueePrimaryCtaButton = null;
  const accent = block.querySelector('.spectrum-Button--accent');
  if (accent) {
    marqueePrimaryCtaButton = document.createElement('b');
    const marqueePrimaryContent = document.createElement('a');
    marqueePrimaryContent.appendChild(accent);
    marqueePrimaryContent.setAttribute('href', accent.getAttribute('href'));
    marqueePrimaryCtaButton.appendChild(marqueePrimaryContent);
    const space = document.createElement('span');
    space.innerHTML = '\u00A0';
    textElement.appendChild(space);
    textElement.appendChild(marqueePrimaryCtaButton);
  }
  cells.push([textElement, ' ']);
  const marqueeBlockTable = WebImporter.DOMUtils.createTable(cells, document);
  block.before(document.createElement('hr'));
  marqueeBlockTable.classList.add('import-table');
  block.replaceWith(marqueeBlockTable);
}
