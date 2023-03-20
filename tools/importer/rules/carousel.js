const compose = (...fns) => (inputParams) => fns.reduce((acc, fn) => {
  const result = fn(inputParams, acc);
  return [...acc, ...result];
}, []);

const generateUniqueId = () => `carousel-${Math.random().toString(16).slice(2)}`;

const getVariants = (block) => {
  const variant = [];
  if (!block?.querySelector('.dexter-Carousel-content--fullwidth, .hawks-MultiViewCarousel-content--fullwidth')) {
    variant.push('container');
  }
  if (!block?.querySelector('.dexter-Carousel--previous, .hawks-MultiViewCarousel---previous')) {
    variant.push('no-buttons');
  }
  let carousel = '.dexter-Carousel';
  if (block?.querySelector('.hawks-MultiViewCarousel')) {
    carousel = '.hawks-MultiViewCarousel';
  }
  const columnsPerSlideDiv = block.querySelector(`${carousel}-content[data-number-of-columns]`);
  const columnsPerSlide = columnsPerSlideDiv?.getAttribute('data-number-of-columns');
  if (columnsPerSlide && columnsPerSlide > 1) {
    variant.push(`show-${columnsPerSlide}`);
  }

  return variant;
};

const makeSectionMetadataForSlides = (unquieId, document, slide) => {
  const sectionMetaDataCells = [['section-metadata'], ['carousel', `${unquieId}`]];
  const sectionMetaDataTable = window.WebImporter.DOMUtils
    .createTable(sectionMetaDataCells, document);
  const slideFlexContainer = slide?.querySelector('.dexter-FlexContainer');
  const backgroundImage = slideFlexContainer?.styles.backgroundImage;
  const backgroundColor = slideFlexContainer?.getAttribute('data-bgcolor');
  if (backgroundImage) {
    sectionMetaDataCells.push(['background', backgroundImage]);
  }
  if (backgroundColor) {
    sectionMetaDataCells.push(['background', backgroundColor]);
  }
  sectionMetaDataTable.classList.add('import-table');
  return sectionMetaDataTable;
};

const makeText = ({ slide, document, isElementReturn = false }) => {
  const textContents = slide.querySelectorAll('.text .cmp-text p,h1');
  const para = document.createElement('p');
  const paraFragment = document.createDocumentFragment();
  textContents.forEach((textNode) => {
    paraFragment.append(textNode);
  });
  para.appendChild(paraFragment);
  if (isElementReturn) {
    return para;
  }
  return [para];
};

const makeVideo = ({ slide: slideBlock, document }) => {
  const videoDiv = slideBlock.querySelector('.has-video > .video-Wrapper');
  const videoSource = videoDiv.querySelector('video.video-desktop source');
  const sourceUrl = videoSource.getAttribute('src');
  const a = document.createElement('a');
  a.innerHTML = sourceUrl;
  a.setAttribute('href', sourceUrl);
  return [a];
};

const makeImage = ({ slide, document }) => {
  const imageTags = slide.querySelectorAll('img');
  const elements = [];
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
    elements.push(imgLink);
  });
  return elements;
};

const makeMarquee = ({ slide, document }) => {
  const marqueeCells = [['Marquee']];
  if (slide.querySelector('.has-video')) {
    const videoSource = makeVideo({ slide, document });
    marqueeCells.push(videoSource);
  }
  const textElement = document.createElement('div');
  const flexContainer = slide.querySelector('.dexter-FlexContainer');
  const imageBlock = makeImage({ slide: flexContainer, document });
  textElement.appendChild(imageBlock[0]);
  const textContents = makeText({ slide, document, isElementReturn: true });
  textElement.appendChild(textContents);

  let marqueeWhiteBorderButton = null;
  const button = slide.querySelector('.spectrum-Button-cta--White');
  if (button) {
    marqueeWhiteBorderButton = document.createElement('a');
    const italicsElement = document.createElement('I');
    italicsElement.appendChild(button);
    marqueeWhiteBorderButton.appendChild(italicsElement);
    marqueeWhiteBorderButton.setAttribute('href', button.getAttribute('href'));
    textElement.appendChild(marqueeWhiteBorderButton);
  }

  let marqueePrimaryCtaButton = null;
  const accent = slide.querySelector('.spectrum-Button--cta');
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
  marqueeCells.push([textElement]);
  const marqueeTable = window.WebImporter.DOMUtils.createTable(marqueeCells, document);
  marqueeTable.classList.add('import-table');
  return [marqueeTable];
};

const createSlideBlocks = (block, document) => {
  if (!block) {
    return [];
  }
  if (block.className.includes('image parbase')) {
    return makeImage({ slide: block, document });
  }
  if (block.className.includes('has-video')) {
    return makeVideo({ slide: block, document });
  }
  if (block.className.includes('text')) {
    return makeText({ slide: block, document });
  }
  const cumlativeElements = [];
  const { children } = block;
  if (children && children.length > 0) {
    Array.prototype.forEach.call(children, (childNode) => {
      const elements = createSlideBlocks(childNode, document);
      cumlativeElements.push(...elements);
    });
  }
  return cumlativeElements;
};

const createSlide = (slide, document) => {
  if (slide?.querySelector('div[daa-lh="marquee"')) {
    return makeMarquee({ slide, document });
  }
  const flexContainer = slide.querySelector('.dexter-FlexContainer');
  const slideElements = createSlideBlocks(flexContainer, document);
  return slideElements;
};

const createSlides = ({ uniqueId, block, document }) => {
  let carouselClass = '.dexter-Carousel';
  if (block.querySelector('.hawks-MultiViewCarousel')) {
    carouselClass = '.hawks-MultiViewCarousel';
  }
  const carouselSection = block.querySelector(`${carouselClass}-content`);
  const slidesNodes = carouselSection.querySelectorAll(`${carouselClass}-item`);
  const slides = Array.from(slidesNodes);
  const slidesElements = slides.reduce((acc, curr) => {
    const slide = createSlide(curr, document);
    slide.push(makeSectionMetadataForSlides(uniqueId, document));
    slide.push(document.createElement('hr'));
    return [...acc, ...slide];
  }, []);
  return slidesElements;
};
const getBackgroundColor = (block) => {
  const flexContainer = block.querySelector('.dexter-FlexContainer--GapWrapper');
  const backgroundColor = flexContainer?.getAttribute('data-bgcolor');
  return backgroundColor;
};

const createCarousel = ({
  block, blockName, uniqueId, document,
}) => {
  const variants = getVariants(block);
  const cells = [[`${blockName}(${variants.join(',')})`], [`${uniqueId}`]];
  const table = window.WebImporter.DOMUtils.createTable(cells, document);
  const backgroundColor = getBackgroundColor(block);
  const sectionMetadataCells = [['section-metadata'], ['style', 'xxl spacing, center ']];
  if (backgroundColor) {
    sectionMetadataCells.push(['background', `${backgroundColor}`]);
  }
  const metaTable = window.WebImporter.DOMUtils.createTable(sectionMetadataCells, document);
  metaTable.classList.add('import-table');
  return [table, metaTable, document.createElement('hr')];
};

export default function createCarouselBlocks(blockName, block, document) {
  const elements = [];
  const carouselTitleDiv = block.querySelector('.dexter-FlexContainer > .dexter-FlexContainer-Items > .title');
  const carouselTitle = carouselTitleDiv?.querySelector(':scope > .cmp-title h1');
  const carouselDescriptionDiv = block.querySelector('.dexter-FlexContainer > .dexter-FlexContainer-Items > .text');
  const carouselDescription = carouselDescriptionDiv?.querySelector(':scope > .cmp-text p');
  const uniqueId = generateUniqueId();
  const inputParams = {
    block,
    blockName,
    uniqueId,
    document,
  };
  const elementList = compose(createCarousel, createSlides)(inputParams);
  if (carouselTitle && !carouselTitleDiv.closest('.dexter-Carousel,.hawks-MultiViewCarousel')) {
    elements.push(carouselTitle);
  }
  if (carouselDescription && !carouselDescriptionDiv.closest('.dexter-Carousel,.hawks-MultiViewCarousel')) {
    elements.push(carouselDescription);
  }

  elements.push(...elementList);

  block.before(document.createElement('hr'));
  block.replaceWith(...elements);
}
