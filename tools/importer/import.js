/* eslint-disable no-unused-vars */
/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

/*
  import constants
*/
import constants from './constants.js';

/*
  import locales
*/
import locales from './locales.js';

/*
  import services
*/
import getBlocks from './services/getBlocks.js';

/*
  import utils
*/
import { rgbToHex } from './utils.js';

/*
import breadcrumb
*/
import createBreadcrumbBlock from './rules/breadcrumbs.js';
import { createCardMetadata } from './rules/metaData.js';

/*
  function to import rules
*/
import fetchBlockScript from './fetchBlockScript.js';

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  preprocess: async ({
    document, url, html, params,
  }) => {
    const { body } = document;
    const ele = body.querySelectorAll('p');
    ele.forEach((node) => {
      node.innerHTML = node.innerHTML.replace(/&nbsp;/g, ' ');
    });
    /*
      clean
    */
    createBreadcrumbBlock(document);
    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(body, [
      '.globalnavfooter',
      '.globalnavheader',
      '.modalContainer',
      'header',
      'footer',
      '.language-Navigation',
      '#onetrust-consent-sdk',
      // [Docx preview issue] : Image files having convertToBlob issue while converting to png.
      'img[src="/content/dam/cc/us/en/creative-cloud/cc_express_appicon_256.svg"]',
      'img[src="/content/dam/cc/icons/adobeexpress_appicon_256.svg"]',
      'img[src="/content/dam/cc/one-console/icons_rebrand/adobeexpress.svg"]',
      'img[src="/content/dam/cct/creativecloud/business/teams/mnemonics/cc-express.svg"]',
      'img[src="/content/dam/shared/images/product-icons/svg/cc-express.svg"]',
      'img[src="/content/dam/cc/us/en/creativecloud/tools/discovery-hub/feature-blade-icons/CCXmneumonic.svg"]',
      'img[src="/content/dam/shared/images/product-icons/svg/cc-express.svg"]',
    ]);

    const main = document.querySelector('main');
    params.elementId = {};
    // set backgroundColor attribute
    const elements = main.querySelectorAll('*');
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const colors = ["rgba(0, 0, 0, 0)", "rgb(255, 255, 255)", "rgb(0, 0, 0)"];
      if (styles.backgroundColor && !colors.includes(styles.backgroundColor)) {
        element.setAttribute("data-bgcolor", rgbToHex(styles.backgroundColor));
      }

      //set border attribute for inset text
      const borderLeft = styles.borderLeft.split(" ")[0];
      if (borderLeft !== "0px") {
        const text = element.querySelectorAll(".text");
        text.forEach((el) => {
          el.setAttribute("data-borderleft", true);
        });
      }

      if (element.id) {
        params.elementId[element.id] = element;
      }
    });

    // set height attribute
    const blocks = await getBlocks(url);
    const pageBlocks = blocks[params.originalURL];
    const allBlockIds = pageBlocks ? Object.keys(pageBlocks) : [];
    let offsetDiff = 0;
    let latestOffset = 0;
    let prevOffset = 0;
    allBlockIds.forEach((id) => {
      const currentOffset = parseInt(id.split('-').pop(), 10);
      latestOffset = latestOffset + offsetDiff + currentOffset - prevOffset;
      const block = body.querySelectorAll('div')[latestOffset];
      block.setAttribute('data-height', block.clientHeight);
      prevOffset = currentOffset;
      offsetDiff = block.querySelectorAll('div').length + 1;
    });
    params.allBlocks = allBlockIds.map((id) => ({
      id,
      name: pageBlocks[id],
    }));
  },

  transformDOM: async ({
    document, url, html, params,
  }) => {
    /** Rules */
    const {
      createAccordionBlocks,
      createMarqueeBlocks,
      createIconBlock,
      createZPatternBlock,
      createMasonryBlock,
      createMerchBlock,
      createAsideBlocks,
      createCarouselBlocks,
      createCardsBlock,
      createFaasBlocks,
      longText,
      createTextBlock,
      createGradientLineBlock,
      createIconLibraryBlocks,
      createTextMarquee,
      createPlanAndPricing,
      createColumnLibrary,
      createZTileContent,
      createPromoColumn,
      createTable,
      createTabsBlocks,
      createImage,
      createHowTo,
      createMetadataBlock,
      createJumpToSectionBlocks,
      createIconBlockFragment1,
      createIconBlockFragment2,
      createIconBlockFragment3,
      createIconBlockGroup,
      mediaBlock,
      createMediaCardsBlock,
    } = fetchBlockScript(params.originalURL);
    
    const { body } = document;
     //Get the page locale from the page url passed to import
     const pageLocale = url.split('/')[3];
     let locale = '';
     if (locales.includes(pageLocale)){
       locale = '/'+pageLocale+'/';
     }
     const mainSection = body.querySelector('main');
     const anchor = mainSection.querySelectorAll('a');
     //Add #_dnt if the locale of link url is not same as page getting imported
     anchor.forEach((node) => {
       if(node.getAttribute('href').includes('.adobe.com') && !node.getAttribute('href').includes(locale) && locale !== ''){
         node.setAttribute('href',node.getAttribute('href') + '#_dnt');
       }
     }); 

    body.querySelectorAll('s,u').forEach((s) => {
      const span = document.createElement('span');
      span.innerHTML = s.innerHTML;
      s.replaceWith(span);
    });
    const cardMetadataTable = await createCardMetadata(document, params.originalURL);
    /*
      missing script table
    */
    const missingScriptTable = (blockName, block, doc) => {
      const cells = [[`${blockName}?`], [block.cloneNode(true)]];
      const table = WebImporter.DOMUtils.createTable(cells, doc);
      table.classList.add('import-table');
      return table;
    };

    /*
      blocks
    */
    const { allBlocks } = params;

    const findOffsetDiff = () => {
      const addedTables = [...body.querySelectorAll('.import-table')];
      let addedOffset = 0;
      addedTables.forEach((table) => {
        addedOffset += table.querySelectorAll('div').length;
      });
      return addedOffset;
    };  
    const createBlocks = (blockName, divOffset) => {
      const offsetDiff = findOffsetDiff();
      const block = body.querySelectorAll('div')[divOffset + offsetDiff];
      switch (blockName) {
        case constants.marquee:
          createMarqueeBlocks(block, document);
          break;
        case constants.zpattern:
          createZPatternBlock(block, document);
          break;
        case constants.iconblock:
          createIconBlock(block, document);
          break;
        case constants.accordion:
          createAccordionBlocks(block, document);
          break;
        case constants.aside:
          createAsideBlocks(block, document);
          break;
        case constants.masonry:
          createMasonryBlock(block, document);
          break;
        case constants.merchblock:
          createMerchBlock(block, document);
          break;
        case constants.spacer:
          block.remove();
          break;
        case constants.carousel:
          createCarouselBlocks(blockName, block, document);
          break;
        case constants.cards:
          createCardsBlock(block, document);
          break;
        case constants.faas:
          createFaasBlocks(block, document);
          break;
        case constants.longText:
          longText(block, document);
          break;
        case constants.textMarquee:
          createTextMarquee(block, document);
          break;
        case constants.text:
          createTextBlock(block, document);
          break;
        case constants.gradientLine:
          createGradientLineBlock(block, document);
          break;
        case constants.iconLibrary:
          createIconLibraryBlocks(block, document);
          break;
        case constants.tabs:
          createTabsBlocks(block, document);
          break;
        case constants.planAndPricing:
          createPlanAndPricing(block, document);
          break;
        case constants.columnLibrary:
          createColumnLibrary(block, document);
          break;
        case constants.zTileContent:
          createZTileContent(block, document);
          break;
        case constants.promoColumn:
          createPromoColumn(block, document);
          break;
        case constants.table:
          createTable(block, document);
          break;
        case constants.image:
          createImage(block, document);
          break;       
        case constants.howTo:
          createHowTo(block, document);
          break;
        case constants.jumptosection:
          createJumpToSectionBlocks(block, document, url);
          break;  
        case constants.iconBlockFragment1:
          createIconBlockFragment1(block, document);
          break;  
        case constants.iconBlockFragment2:
          createIconBlockFragment2(block, document);
          break;  
        case constants.iconBlockFragment3:
          createIconBlockFragment3(block, document, params.originalURL);
          break;  
        case constants.iconBlockGroup:
          createIconBlockGroup(block, document);
          break;
        case constants.media:
          mediaBlock(block, document);
          break;  
        case constants.mediaCardBlock:
          createMediaCardsBlock(block, document);
          break;        
        default:
          block.before(document.createElement('hr'));
          block.replaceWith(missingScriptTable(blockName, block, document));
      }
    };
    allBlocks.forEach((block) => {
      const { id, name } = block; 
      const divOffset = parseInt(id.split('-').pop(), 10);     
      createBlocks(name, divOffset);
    });
    createMetadataBlock(document, cardMetadataTable);
    return body;
  },
};
