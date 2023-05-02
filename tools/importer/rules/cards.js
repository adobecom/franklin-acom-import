/* global WebImporter */
const createTextBlock = (textElement, document) => {
  const title = textElement.querySelector('h1,h2');
  const cells = [['text(full-width)']];
  const cellContent = document.createElement('div');
  if (title) {
    cellContent.appendChild(title);
  }
  const paras = textElement.querySelectorAll('.text p');
  paras.forEach((para) => {
    if (!para.querySelector('a')) {
      const detail = document.createElement('p');
      detail.innerHTML = para.textContent;
      cellContent.appendChild(detail);
    }
  });
  const links = textElement.querySelectorAll('.text a');
  links.forEach((link) => {
    cellContent.appendChild(link);
  });
  if (cellContent.childElementCount) {
    cells.push([cellContent]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  textElement.replaceWith(table);
};

const setCardType = (cardsLength) => {
  let cardType = '3-up';
  if ([1, 2, 4].includes(cardsLength)) {
    cardType = '2-up';
  }
  return cardType;
};

const attachBackgroundImage = (section, document) => {
  const tags = [...section.querySelectorAll('div[style]')];
  tags.forEach((tag) => {
    const url = tag.getAttribute('style').split('"')[1];
    const imageLink = document.createElement('a');
    imageLink.innerHTML = url;
    imageLink.href = url;
    tag.insertAdjacentElement('afterend', imageLink);
  });
};

const anotherVersionCards = (block, document, additionalSection = []) => {
  const parent = block.querySelector(
    '.dexter-FlexContainer .dexter-FlexContainer-Items',
  );
  const children = [...parent.children];
  const lengthCheck = children.length === 2;
  const firstElementCheck = children[0]
    && (children[0].classList.contains('position')
      || children[0].classList.contains('flex'));
  const secondElementCheck = children[1] && children[1].classList.contains('flex');
  const anotherVersionFlag = lengthCheck && firstElementCheck && secondElementCheck;
  if (anotherVersionFlag) {
    const bgImage = block
      .querySelector('div[style]')
      ?.getAttribute('style')
      .split('"')[1];
    const bgcolor = block
      .querySelector('div[data-bgcolor]')
      ?.getAttribute('data-bgcolor');
    let bgImageElement = null;
    if (bgImage) {
      bgImageElement = document.createElement('img');
      bgImageElement.src = bgImage;
    }
    const cells = [['text'], [children[0]]];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');

    const flexItemsParent = children[1].querySelector(
      '.dexter-FlexContainer .dexter-FlexContainer-Items',
    );
    const flexItems = [...flexItemsParent.children];
    flexItems.forEach((flex) => {
      const cardCells = [['Card']];
      const row = [];
      attachBackgroundImage(flex, document);
      row.push(flex.innerHTML);
      cardCells.push(row);
      const cardTable = WebImporter.DOMUtils.createTable(cardCells, document);
      cardTable.classList.add('import-table');
      flex.replaceWith(cardTable);
    });
    const sectionMetadataCells = [
      ['Section Metadata'],
      ['style', 'xxxl spacing'],
      ...additionalSection,
    ];
    if (bgImageElement || bgcolor) {
      sectionMetadataCells.push(['background', bgImageElement || bgcolor]);
    }
    const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
      sectionMetadataCells,
      document,
    );
    sectionMetaDataTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(
      table,
      ...block.querySelectorAll('.import-table'),
      sectionMetaDataTable,
    );
  }
  return anotherVersionFlag;
};

export default function createCardsBlock(block, document, cardConfig = {}) {
  const { additionalSection = [] } = cardConfig;
  if (anotherVersionCards(block, document, additionalSection)) {
    return;
  }
  const cass = block.querySelector('.consonantcardcollection');
  if (cass) {
    const cells = [['Columns']];
    const config = cass
      .querySelector('consonant-card-collection')
      .getAttribute('data-config');
    const caasLink = document.createElement('a');
    caasLink.href = `https://milo.adobe.com/tools/caas#${btoa(config)}`;
    caasLink.innerHTML = 'Content as a service';
    cells.push([caasLink]);
    const caasTable = WebImporter.DOMUtils.createTable(cells, document);
    caasTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(caasTable);
  } else {
    const containers = [
      ...block.querySelectorAll('.dexter-FlexContainer-Items'),
    ].filter((c) => {
      if (c.childElementCount < 2) return false;
      let ancestor = c;
      let keep;
      do {
        ancestor = ancestor.parentElement.closest(
          '.dexter-FlexContainer-Items',
        );
        keep = !ancestor || ancestor.childElementCount < 2;
      } while (ancestor && keep);
      return keep;
    });

    let cardType = '';

    containers.forEach((container) => {
      const columns = [...container.children];
      if (columns.length === 0) return;
      if (columns.length > 0 && columns[0].classList.contains('text')) {
        createTextBlock(columns[0], document);
        columns.shift();
      } else {
        const title = block.querySelector('.title');
        if (title) {
          createTextBlock(title, document);
        }
        const text = block.querySelector('.text');
        if (text) {
          createTextBlock(text, document);
        }
      }
      if (columns.length > 1) {
        cardType = setCardType(columns.length);
        columns.forEach((col) => {
          const cells = [['Card']];
          const row = [];
          attachBackgroundImage(col, document);
          row.push(col.innerHTML);
          cells.push(row);
          const table = WebImporter.DOMUtils.createTable(cells, document);
          table.classList.add('import-table');
          col.replaceWith(table);
        });
      } else {
        const column = columns[0];
        const allCardsWrapper = column.querySelector(
          '.dexter-FlexContainer .dexter-FlexContainer-Items',
        );
        const allCards = [...allCardsWrapper.children];
        cardType = setCardType(allCards.length);
        allCards.forEach((col) => {
          const cells = [['Card']];
          const row = [];
          attachBackgroundImage(col, document);
          row.push(col.innerHTML);
          cells.push(row);
          const table = WebImporter.DOMUtils.createTable(cells, document);
          table.classList.add('import-table');
          col.replaceWith(table);
        });
      }
    });
    const sectionCells = [
      ['Section metadata'],
      ['style', `xl spacing, ${cardType}`],
      ...additionalSection,
    ];
    const bgImage = block
      .querySelector('div[style]')
      ?.getAttribute('style')
      .split('"')[1];
    const bgcolor = block
      .querySelector('div[data-bgcolor]')
      ?.getAttribute('data-bgcolor');
    let bgImageElement = null;
    if (bgImage) {
      bgImageElement = document.createElement('img');
      bgImageElement.src = bgImage;
    }
    if (bgImageElement || bgcolor) {
      sectionCells.push(['background', bgImageElement || bgcolor]);
    }
    const sectionTable = WebImporter.DOMUtils.createTable(
      sectionCells,
      document,
    );
    sectionTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(...block.querySelectorAll('.import-table'), sectionTable);
  }
}
