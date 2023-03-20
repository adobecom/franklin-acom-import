/**
 * TODO: To detect order of elements in the slide.
 * TODO: To background image detection for slide.
 * TODO: premire rush marquee
 * TODO: make makeText more genric\
 */
import createMarqueeBlocks from './marquee.js';

const compose = (...fns) => (inputParams) => fns.reduce((acc, fn) => {
  const result = fn(inputParams, acc);
  return [...acc, ...result];
}, []);

const makeSectionMetadataForSlides = (unquieId, document, slide) => {
  const sectionMetaDataCells = [['section-metadata'], ['carousel', `${unquieId}`]];
  const sectionMetaDataTable = window.WebImporter.DOMUtils
    .createTable(sectionMetaDataCells, document);
  const slideFlexContainer = slide?.querySelector('.dexter-FlexContainer');
  const backgroundImage = slideFlexContainer?.styles.backgroundImage;
  const backgroundColor = slideFlexContainer?.querySelector('.dexter-FlexContainer');
  if (backgroundImage) {
    sectionMetaDataCells.push(['background', backgroundImage]);
  }
  if (backgroundColor) {
    sectionMetaDataCells.push(['background', backgroundColor]);
  }
  sectionMetaDataTable.classList.add('import-table');
  return sectionMetaDataTable;
};

const detectSlideVariant = (slide) => {
  const isVideoPresent = slide?.querySelector('.has-video > .video-Wrapper');
  const isTextPresent = slide?.querySelector('.cmp-text');
  const isImagePresent = slide?.querySelector('.image');
  const isMarquee = slide?.querySelector('div[daa-lh="marquee"');

  return {
    isVideoPresent,
    isTextPresent,
    isImagePresent,
    isMarquee,
  };
};
const makeText = ({ slide }) => {
  const para = slide.querySelector('.text .cmp-text p');
  return [para];
};

const makeVideo = ({ slide: slideBlock }) => {
  const videoDiv = slideBlock.querySelector('.has-video > .video-Wrapper');
  const videoSource = videoDiv.querySelector('video.video-desktop source');
  const sourceUrl = videoSource.getAttribute('src');
  return [sourceUrl];
};

const makeMarquee = ({ slide, document }) => {
  const marqueeDiv = slide.querySelector('div[daa-lh="marquee"');
  const marqueeDivParent = marqueeDiv.parentElement;
  createMarqueeBlocks(marqueeDiv, document);
  const marqueeOutput = marqueeDivParent.querySelector('.import-table');
  return [marqueeOutput];
};

const makeImage = ({ slide, document }) => {
  const imageDiv = slide.querySelector('.image,.parabase');
  const imageTags = imageDiv.querySelectorAll('img');
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
      imgLink = document.createElement('img');
      imgLink.setAttribute('src', imgSrc);
    }
    elements.push(imgLink);
  });
  return elements;
};

const createSlide = (slide, uniqueId, document) => {
  const variant = detectSlideVariant(slide);
  const {
    isTextPresent,
    isVideoPresent,
    isImagePresent,
    isMarquee,
  } = variant;
  const composeFunctions = [];
  if (isMarquee) {
    composeFunctions.push(makeMarquee);
  } else {
    if (isImagePresent) {
      composeFunctions.push(makeImage);
    }

    if (isVideoPresent) {
      composeFunctions.push(makeVideo);
    }

    if (isTextPresent) {
      composeFunctions.push(makeText);
    }
  }

  const elements = compose(...composeFunctions)({ slide, uniqueId, document });
  return elements;
};

const createSlides = ({ uniqueId, block, document }) => {
  let carouselClass = '.dexter-carousel';
  let carouselItemClass = '.dexter-Carousel';
  if (block.querySelector('.hawks-MultiViewCarousel')) {
    carouselClass = '.hawks-MultiViewCarousel';
    carouselItemClass = '.hawks-MultiViewCarousel';
  }
  const carouselSection = block.querySelector(`${carouselClass}-content`);
  const slidesNodes = carouselSection.querySelectorAll(`${carouselItemClass}-item`);
  const slides = Array.from(slidesNodes);
  const slidesElements = slides.reduce((acc, curr) => {
    const slide = createSlide(curr, uniqueId, document);
    slide.push(makeSectionMetadataForSlides(uniqueId, document));
    slide.push(document.createElement('hr'));
    return [...acc, ...slide];
  }, []);
  return slidesElements;
};

const createCarousel = ({ blockName, uniqueId, document }) => {
  const cells = [[`${blockName}(container)`], [`${uniqueId}`]];
  const table = window.WebImporter.DOMUtils.createTable(cells, document);
  const sectionMetadataCells = [['section-metadata'], ['style', 'xxl spacing,center '], ['background', '#f0f0f0 ']];
  const metaTable = window.WebImporter.DOMUtils.createTable(sectionMetadataCells, document);
  metaTable.classList.add('import-table');
  return [table, metaTable, document.createElement('hr')];
};

export default function createCarouselBlocks(blockName, block, document) {
  const elements = [];
  const carouselTitleDiv = block.querySelector('.dexter-FlexContainer > .dexter-FlexContainer-Items > title :not(.dexter-carousel, .hawks-MultiViewCarousel)');
  const carouselTitle = carouselTitleDiv?.querySelector(':scope > cmp-title h2');
  const carouselDescriptionDiv = block.querySelector('.dexter-FlexContainer > .dexter-FlexContainer-Items > .text :not(.dexter-carousel, .hawks-MultiViewCarousel)');
  const carouselDescription = carouselDescriptionDiv?.querySelector(':scope > cmp-text p');
  const uniqueId = 'Carousel container';
  const inputParams = {
    block,
    blockName,
    uniqueId,
    document,
  };
  const elementList = compose(createCarousel, createSlides)(inputParams);
  if (carouselTitle) {
    elements.push(carouselTitle);
  }
  if (carouselDescription) {
    elements.push(carouselDescription);
  }

  elements.push(...elementList);

  block.before(document.createElement('hr'));
  block.replaceWith(...elements);
}
