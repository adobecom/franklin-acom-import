import { compose } from '../utils.js';
import createCardsBlock from './cards.js';
import createMediaBlock from './mediaBlock.js';

const CONTENT_TYPES_TABS = {
  card: { type: 'card', class: 'toggle-Card-TabList' },
  appFilters: { type: 'iconLibrary', class: 'toggle-CCAppFilters' },
  navList: { class: 'toggle-Nav-List', type: 'iconLibrary' },
  tabList: { class: 'toggle-Tab-List', type: 'mediaBlock' },
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
  if (block.querySelector('.toggle-Tab-List')) {
    return CONTENT_TYPES_TABS.tabList;
  }
  return CONTENT_TYPES_TABS.default;
};

const makeIconLibrary = (block, document) => {
  const allNodesCards = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items .flex'),
  ];
  allNodesCards.forEach((container) => {
    const cardCells = [['card-horizontal']];
    const row = [];
    row.push(container.cloneNode(true));
    cardCells.push(row);
    const cardsTable = window.WebImporter.DOMUtils.createTable(
      cardCells,
      document,
    );
    cardsTable.classList.add('import-table');
    container.replaceWith(cardsTable);
  });

  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'three-up,xxl spacing'],
  ];
  const sectionMetaDataTable = window.WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(
    ...block.querySelectorAll('.import-table'),
    sectionMetaDataTable,
  );
};

const makeContentBlock = (node, type, document) => {
  const elements = [];
  const contentBlock = node.querySelector('.dexter-FlexContainer-Items');

  if (contentBlock) {
    const parent = contentBlock.parentElement;
    switch (type) {
      case CONTENT_TYPES_TABS.card.type: {
        createCardsBlock(contentBlock, document, true);
        break;
      }
      case CONTENT_TYPES_TABS.navList.type:
      case CONTENT_TYPES_TABS.appFilters.type: {
        makeIconLibrary(contentBlock, document);
        break;
      }
      case CONTENT_TYPES_TABS.tabList.type: {
        createMediaBlock(contentBlock, document);
        break;
      }
      default: {
        elements.push('Need some work');
        break;
      }
    }
    elements.push(...parent.querySelectorAll('.import-table'));
  }
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
      elements.push(document.createElement('hr'));
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
    if (!tabs.includes(tabHeading)) {
      const li = document.createElement('li');
      li.textContent = tabHeading;
      ol.appendChild(li);
      tabs.push(tabHeading);
    }
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
