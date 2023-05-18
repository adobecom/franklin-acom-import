import { compose } from '../utils.js';
import createCardsBlock from './cards.js';
import createMediaBlock from './mediaBlock.js';

const CONTENT_TYPES_TABS = {
  card: { type: 'card', class: 'toggle-Card-TabList' },
  appFilters: { type: 'iconLibrary', class: 'toggle-CCAppFilters' },
  navList: { class: 'toggle-Nav-List', type: 'iconLibrary' },
  tabList: { class: 'toggle-Tab-List', type: 'mediaBlock' },
  photoGraphyPlans: { class: 'toggle-Photography-Plans', type: 'photo' },
  creativeCloudAllApps: { class: 'toggle-Creative-Cloud-All-Apps-Tab-List', type: 'card' },
  default: { type: 'default', class: '' },
};

let tabs = [];

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
  if (block.querySelector('.toggle-Photography-Plans')) {
    return CONTENT_TYPES_TABS.photoGraphyPlans;
  }
  if (block.querySelector('.toggle-Creative-Cloud-All-Apps-Tab-List')) {
    return CONTENT_TYPES_TABS.creativeCloudAllApps;
  }
  return CONTENT_TYPES_TABS.default;
};

const makeIconLibrary = (block, document, config = {}) => {
  const { additionalSection } = config;
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
    ...additionalSection,
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

const makeContentBlock = (node, type, document, additionalSection = []) => {
  const elements = [];
  const contentBlock = node.querySelector('.dexter-FlexContainer-Items');
  const titleText = node.querySelector('.flex .cmp-title > h3');
  if (titleText && type === CONTENT_TYPES_TABS.card.type) {
    elements.push(titleText.textContent);
  }

  if (contentBlock) {
    const fragment = document.createDocumentFragment();
    switch (type) {
      case CONTENT_TYPES_TABS.card.type:
      case CONTENT_TYPES_TABS.photoGraphyPlans.type: {
        const closest = node.closest('.flex');
        fragment.appendChild(closest);
        createCardsBlock(closest, document, {
          additionalSection,
        });
        break;
      }
      case CONTENT_TYPES_TABS.navList.type:
      case CONTENT_TYPES_TABS.appFilters.type: {
        fragment.appendChild(contentBlock);
        const config = {
          additionalSection,
        };
        makeIconLibrary(contentBlock, document, config);
        break;
      }
      case CONTENT_TYPES_TABS.tabList.type: {
        fragment.appendChild(contentBlock);
        createMediaBlock(contentBlock, document, { additionalSection });
        break;
      }
      default: {
        elements.push('Need some work');
        break;
      }
    }
    elements.push(...fragment.querySelectorAll('.import-table'));
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
        [['tab', tabs[index]]],
      );
      elements.push(...contentElements);

      elements.push(document.createElement('hr'));
    });

    return elements;
  }
  return [];
};

const createTabList = ({ block, document }) => {
  const tabList = block.querySelectorAll(
    '.navList > spectrum-tablist .spectrum-Tabs-item ',
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
  tabs = [];
  const elementList = compose(createTabList, createTab)(inputParams);
  elements.push(...elementList);
  block.before(document.createElement('hr'));
  block.replaceWith(...elements);
}
