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
  import services
*/
import getBlocks from './services/getBlocks.js';

/*
  import utils
*/
import rgbToHex from './utils.js';

/*
  import rules
*/
import createAccordionBlocks from './rules/accordion.js';
import createMarqueeBlocks from './rules/marquee.js';
import createIconBlock from './rules/iconblock.js';
import createZPatternBlock from './rules/zPattern.js';
import createMasonryBlock from './rules/masonry.js';
import createMerchBlock from './rules/merchBlock.js';
import createAsideBlocks from './rules/aside.js';
import createCardsBlock from './rules/cards.js';
// import tabsToBlocks from './rules/tabs.js';
// import guessColumnsBlocks from './rules/columns.js';

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
    document,
    url,
    html,
    params,
  }) => {
    const { body } = document;

    /*
      clean
    */
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
      'img[src="/content/dam/cc/one-console/icons_rebrand/adobeexpress.svg"]',
      'img[src="/content/dam/cct/creativecloud/business/teams/mnemonics/cc-express.svg"]',
      'img[src="/content/dam/shared/images/product-icons/svg/cc-express.svg"]',
    ]);

    const main = document.querySelector('main');

    // set backgroundColor attribute
    const elements = main.querySelectorAll('*');
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const colors = ['rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(0, 0, 0)'];
      if (!colors.includes(styles.backgroundColor)) {
        element.setAttribute('data-bgcolor', rgbToHex(styles.backgroundColor));
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
    document,
    url,
    html,
    params,
  }) => {
    const { body } = document;

    body.querySelectorAll('s').forEach((s) => {
      const span = document.createElement('span');
      span.innerHTML = s.innerHTML;
      s.replaceWith(span);
    });

    /*
      missing script table
    */
    const missingScriptTable = (blockName, block, doc) => {
      const cells = [[`${blockName}?`], [block.textContent]];
      const table = WebImporter.DOMUtils.createTable(cells, doc);
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
        case constants.zpattern:
          if (block.querySelector('h1')) {
            createMarqueeBlocks(block, document);
          } else {
            createZPatternBlock(block, document);
          }
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
        case constants.cards:
          createCardsBlock(block, document);
          break;
        default:
          // default
          block.before(document.createElement('hr'));
          block.replaceWith(missingScriptTable(blockName, block, document));
      }
    };

    allBlocks.forEach((block) => {
      const { id, name } = block;
      const divOffset = parseInt(id.split('-').pop(), 10);
      createBlocks(name, divOffset);
    });

    return body;
  },
};
