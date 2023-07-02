// /* global WebImporter */

import { compose } from '../utils.js';

/**
 *
 * @param {HTMLDivElement} block
 * @returns {HTMLImageElement}
 */
function makeBGImage(block, document) {
  const bgImage = block?.querySelector('div[style]');
  const image = bgImage?.getAttribute('style').split('"')[1];
  let imageUrl = [];
  if (image && image.indexOf('http://localhost:3001') !== -1) {
    imageUrl = image.split('http://localhost:3001');
  }
  const imageTag = document.createElement('img');
  imageTag.src = imageUrl.length
    ? `https://www.adobe.com${imageUrl[1]}`
    : image;
  return imageTag;
}

/**
 *
 * @param {HTMLDivElement} block
 * @returns {string}
 */
function makeBGColor(block) {
  return (
    block.querySelector('div[data-bgcolor]')?.getAttribute('data-bgcolor')
    ?? 'No colour'
  );
}

/**
 *
 * @param {HTMLDivElement} block
 * @returns {HTMLAnchorElement}
 */
function makeVideo(block) {
  const videoWrapper = block?.querySelector('.video-Wrapper source');
  const backgroundVideoURL = videoWrapper.getAttribute('src');
  const a = document.createElement('a');
  a.innerHTML = backgroundVideoURL;
  a.setAttribute('href', backgroundVideoURL);
  return a;
}

/**
 * Function to evaluate type of Marquee on basis of height
 * @param {Number} marqueeHeight
 * @returns {String} returns the variation of marquee
 */
function marqueeVariation(marqueeHeight) {
  switch (marqueeHeight) {
    case 360:
      return 'Marquee (small)';
    case 560:
      return 'Marquee';
    case 700:
      return 'Marquee (large)';
    default:
      return 'Marquee';
  }
}
/**
 *
 * @param {{block: HTMLDivElement}} inputParams
 * @returns {Array<string>}
 */

function createMarqueeHeader({ block }) {
  const blockHeight = parseInt(block?.getAttribute('data-height') ?? 0, 10);
  const marqueeHeader = marqueeVariation(blockHeight);
  return [[marqueeHeader]];
}

/**
 *
 * @param {{block: HTMLDivElement}} inputParams
 * @returns {Array<String | HTMLAnchorElement | HTMLImageElement}
 */
function createMarqueeBackground({ block, document }) {
  const isVideo = !!block?.querySelector('.video-Wrapper source');
  const isBackgroundColor = !!block?.querySelector('div[data-bgcolor]');
  const isBgImage = !!block.querySelector('div[style]');
  if (isVideo) {
    const video = makeVideo(block, document);
    return [[video]];
  }
  if (isBackgroundColor) {
    const bgcolor = makeBGColor(block);
    return [[bgcolor]];
  }
  if (isBgImage) {
    const bgImage = makeBGImage(block, document);
    return [[bgImage]];
  }
  return [];
}

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
  if (parent.querySelectorAll('h2')) {
    const contentQuery = parent.querySelectorAll('h2');
    if (contentQuery.length) {
      [...contentQuery].forEach((para) => {
        let marqueeContent = null;
        marqueeContent = document.createElement('p');
        marqueeContent.innerHTML = para.innerHTML;
        textElement.appendChild(marqueeContent);
      });
    }
  }
  if (parent.querySelectorAll('p')) {
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
}

// for contentList
function createContentList(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const contentQuery = parent.querySelectorAll('li');
  if (contentQuery.length) {
    [...contentQuery].forEach((para) => {
      let marqueeContent = null;
      marqueeContent = document.createElement('p');
      marqueeContent.innerHTML = `.${para.innerHTML}`;
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
    const imgLink = document.createElement('a');
    imgLink.innerHTML = imgSrc;
    imgLink.setAttribute('href', imgSrc);
    textElement.appendChild(imgLink);
  });
}

// for video
function createVideo(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const videoQuery = parent.querySelectorAll('iframe');
  const videoUrl = videoQuery[0]?.getAttribute('src');
  const videoLink = document.createElement('div');
  videoLink.innerHTML = videoUrl;
  textElement.appendChild(videoLink);
}

// for another video
function createVideohref(block, document, textElement) {
  const parent = block.querySelector('.dexter-FlexContainer-Items');
  const videoQuery = parent.getElementsByTagName('a')[0].href;
  const videoLink = document.createElement('div');
  videoLink.innerHTML = videoQuery;
  textElement.appendChild(videoLink);
}

const oneChildMarquee = (block, document, textElement) => {
  createHeading(block, document, textElement);
  createContent(block, document, textElement);
  createImage(block, document, textElement);
  createVideo(block, document, textElement);
  createVideohref(block, document, textElement);
  createBtn(block, document, textElement);
  return [[textElement]];
};

const threeChildMarquee = (block, document, textElement) => {
  createBtn(block, document, textElement);
  createHeading(block, document, textElement);
  createContent(block, document, textElement);
  createImage(block, document, textElement);
  createVideo(block, document, textElement);
  createVideohref(block, document, textElement);
  return [[textElement]];
};

const twoChildMarquee = (block) => {
  const allData = block?.querySelector('.dexter-FlexContainer-Items');
  const children = [...allData.children];
  return [[children[1], children[0]]];
};

const fourChildMarquee = (block, document, textElement) => {
  createHeading(block, document, textElement);
  createContent(block, document, textElement);
  createImage(block, document, textElement);
  createVideo(block, document, textElement);
  createContentList(block, document, textElement);
  createBtn(block, document, textElement);
  createVideohref(block, document, textElement);
};

function createMarqueeDivElement(block, document, textElement) {
  const alldata = block?.querySelector('.dexter-FlexContainer-Items');
  if (alldata.children.length === 3) {
    return threeChildMarquee(block, document, textElement);
  }
  if (alldata.children.length === 2) {
    return twoChildMarquee(block, document, textElement);
  }

  if (alldata.children.length === 1) {
    return oneChildMarquee(block, document, textElement);
  }
  if (alldata.children.length === 4) {
    return fourChildMarquee(block, document, textElement);
  }
  return '';
}
function createMarqueeData({ block, document }) {
  const textElement = document.createElement('div');
  return createMarqueeDivElement(block, document, textElement);
}

/**
 * Function for building Marquee,
 * @param {HTMLDivElement} block
 * @param {HTMLDocument} document
 * @returns {Array<HTMLElement>} returns array of elements
 */
function createMarquee(block, document) {
  const inputParams = {
    block,
    document,
  };
  const elements = compose(
    createMarqueeHeader,
    createMarqueeBackground,
    createMarqueeData,
  )(inputParams);
  return elements;
}

export default function createMarqueeBlocks(block, document) {
  const elements = createMarquee(block, document);
  const table = window.WebImporter.DOMUtils.createTable(elements, document);
  //Commenting this as we don't section line between breadcrumb and marquee as per authors
  //block.before(document.createElement('hr'));
  table.classList.add('import-table');
  block.replaceWith(table);
}
