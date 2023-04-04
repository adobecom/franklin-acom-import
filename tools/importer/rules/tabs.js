import { compose } from '../utils.js';
import createCardsBlock from './cards.js';
import createIconLibraryBlocks from './iconLibrary.js';

const CONTENT_TYPES_TABS = {
  card: { type: 'card', class: 'toggle-Card-TabList' },
  appFilters: { type: 'appFilters', class: 'toggle-CCAppFilters' },
  navList: { class: 'toggle-Nav-List', type: 'navList' },
  default: { type: 'default', class: '' },
};

const tabs = [];

const getContentTypeForTabs = (block) => {
  if (block.querySelector('.toggle-Card-TabList')) {
    return CONTENT_TYPES_TABS.card;
  }
  if (block.querySelector('.toggle-CCAppFilters')) {
    return CONTENT_TYPES_TABS.appFilters;
  }
  if (block.querySelector('.toggle-Nav-List')) {
    return CONTENT_TYPES_TABS.navList;
  }
  return CONTENT_TYPES_TABS.default;
};

// Need to check for which container has items
const makeContentBlock = (node, type, document) => {
  const elements = [];
  // const contentBlock = node.querySelectorAll('.container > .flex')[1];
  const contentBlock = node.querySelector('.dexter-FlexContainer-Items');
  const parent = contentBlock.parentElement;
  switch (type) {
    case CONTENT_TYPES_TABS.card.type: {
      createCardsBlock(contentBlock, document, true);
      break;
    }
    case CONTENT_TYPES_TABS.navList.type:
    case CONTENT_TYPES_TABS.appFilters.type: {
      createIconLibraryBlocks(contentBlock, document);
      break;
    }
    default: {
      elements.push('Need some work');
      break;
    }
  }
  elements.push(...parent.querySelectorAll('.import-table'));
  return elements;
};

const createTab = ({ block, document }) => {
  const detectContent = getContentTypeForTabs(block);
  if (detectContent.class) {
    const contentBlocks = block?.querySelectorAll(`.${detectContent.class}`);
    const elements = [];
    contentBlocks.forEach((node, index) => {
      const contentElements = makeContentBlock(
        node,
        detectContent.type,
        document,
      );
      elements.push(...contentElements);
      const sectionMetaData = [['Section Metadata'], ['tab', tabs[index]]];
      const sectionTable = window.WebImporter.DOMUtils.createTable(
        sectionMetaData,
        document,
      );
      sectionTable.classList.add('import-table');
      elements.push(sectionTable);
    });
    return elements;
  }
  return [];
};

const createTabList = ({ block, document }) => {
  const tabList = block.querySelectorAll(
    '.navList.nav-tabs-small.hawks-nav-list > spectrum-tablist .spectrum-Tabs-item ',
  );
  const conTabList = block.querySelectorAll(
    '.navList > con-tablist .spectrum-Tabs-item ',
  );
  const cells = [['Tabs']];
  const ol = document.createElement('ol');
  let activeTab = '';
  const elements = [];
  if (tabList && tabList.length > 0) {
    elements.push(...tabList);
  }
  if (conTabList && conTabList.length > 0) {
    elements.push(...conTabList);
  }
  elements.forEach((tabNode) => {
    if (`${tabNode.className}`.indexOf('is-selected') > -1) {
      activeTab = tabNode.querySelector(
        '.spectrum-Tabs-itemLabel',
      )?.textContent;
    }
    const tabHeading = tabNode.querySelector(
      '.spectrum-Tabs-itemLabel',
    )?.textContent;
    const li = document.createElement('li');
    li.textContent = tabHeading;
    ol.appendChild(li);
    tabs.push(tabHeading);
  });
  cells.push([ol]);
  cells.push(['Active tab', activeTab]);
  const table = window.WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  return [table, document.createElement('hr')];
};

export default function createTabsBlocks(block, document) {
  const elements = [];
  const inputParams = { block, document };
  const elementList = compose(createTabList, createTab)(inputParams);
  elements.push(...elementList);
  block.before(document.createElement('hr'));
  block.replaceWith(...elements);
}
