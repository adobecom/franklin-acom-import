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
      variation = 'Marqueeee';
      break;
  }
  return variation;
};

// for btn
function createBtn(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const btnQuery = parent.querySelectorAll('.cta');
  [...btnQuery].forEach((btn) => {
    let marqueeBtn = null;
    marqueeBtn = document.createElement('p');
    marqueeBtn.innerHTML = btn.innerHTML;
    textElement.appendChild(marqueeBtn);
  });
}

// for heading
function createHeading(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const headingQuery = parent.querySelectorAll('h1');
  if (headingQuery) {
    const allHeadings = [...block.querySelectorAll('h1')];
    const fragment = document.createDocumentFragment();
    allHeadings.forEach((head) => {
      fragment.append(head);
    });
    textElement.appendChild(fragment);
  }
}

// for content
function createContent(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const contentQuery = parent.querySelectorAll('p');
  if (contentQuery.length) {
    [...contentQuery].forEach((para) => {
      let marqueeContent = null;
      marqueeContent = document.createElement('p');
      marqueeContent.innerHTML = para.innerHTML;
      textElement.appendChild(marqueeContent);
    });
  }
}

// for image
function createImage(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const imageQuery = parent.querySelectorAll('img');
  imageQuery.forEach((image) => {
    const imgSrc = image.getAttribute('src');
    //   if (imgSrc && (imgSrc.indexOf('.svg') + 1)) {
    //     if (imgSrc.indexOf('https') === -1) {
    //       imgSrc = `https://www.adobe.com/${imgSrc}`;
    //     }
    const imgLink = document.createElement('a');
    imgLink.innerHTML = imgSrc;
    imgLink.setAttribute('href', imgSrc);
    textElement.appendChild(imgLink);
  });
}

const oneChildMarquee = (block, document, textElement) => {
  createBtn(block, document, textElement);
  createHeading(block, document, textElement);
  createContent(block, document, textElement);
  createImage(block, document, textElement);
};

const twoChildMarquee = (block, document, textElement) => {
  createBtn(block, document, textElement);
  createHeading(block, document, textElement);
  createContent(block, document, textElement);
  createImage(block, document, textElement);
};

const threeChildMarquee = (block, document, textElement) => {
  createBtn(block, document, textElement);
  createHeading(block, document, textElement);
  createContent(block, document, textElement);
  createImage(block, document, textElement);
};

function checkChildren(block, document, textElement) {
  const alldata = block?.querySelector('.dexter-FlexContainer-Items');
  if (alldata.children.length === 3) {
    threeChildMarquee(block, document, textElement);
  }
  if (alldata.children.length === 2) {
    twoChildMarquee(block, document, textElement);
  }

  if (alldata.children.length === 1) {
    oneChildMarquee(block, document, textElement);
  }
}

export default function createMarqueeBlocks(block, document) {
  const textElement = document.createElement('div');
  checkChildren(block, document, textElement);
  const blockHeight = parseInt(block.getAttribute('data-height'), 10);
  const cells = [[marqueeVariation(blockHeight)]];
  let videoImage = null;
  if (block.querySelector('iframe')) {
    videoImage = block.querySelector('iframe').src;
  }
  let bgcolor = null;
  if (block.querySelector('div[data-bgcolor]')) {
    bgcolor = block.querySelector('div[data-bgcolor]')?.getAttribute('data-bgcolor');
  }
  cells.push([textElement, videoImage], [bgcolor]);
  const marqueeBlockTable = WebImporter.DOMUtils.createTable(cells, document);
  block.before(document.createElement('hr'));
  marqueeBlockTable.classList.add('import-table');
  block.replaceWith(marqueeBlockTable);
}
