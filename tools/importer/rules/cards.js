/* global WebImporter */
const createTextBlock = (textElement, document) => {
  const title = textElement.querySelector('.title h2');
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

export default function createCardsBlock(block, document) {
  const cass = block.querySelector('.consonantcardcollection');
  if (cass) {
    const cells = [['Columns']];
    const config = cass.querySelector('consonant-card-collection').getAttribute('data-config');
    const caasLink = document.createElement('a');
    caasLink.href = `https://milo.adobe.com/tools/caas#${btoa(config)}`;
    caasLink.innerHTML = 'Content as a service';
    cells.push([caasLink]);
    const caasTable = WebImporter.DOMUtils.createTable(
      cells,
      document,
    );
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
      if (columns.length > 0 && columns[0].classList.contains('title')) {
        createTextBlock(container, document);
      } else if (columns.length > 1) {
        cardType = setCardType(columns.length);
        columns.forEach((col) => {
          const cells = [['Card']];
          const row = [];
          row.push(col.innerHTML);
          cells.push(row);
          const table = WebImporter.DOMUtils.createTable(cells, document);
          table.classList.add('import-table');
          col.replaceWith(table);
        });
      } else {
        const tc = columns[0].textContent.trim();
        if (tc !== '') {
          container.append(document.createElement('hr'));
        }
      }
    });
    const sectionCells = [['Section metadata'], ['style', `xl spacing, ${cardType}`]];
    const sectionTable = WebImporter.DOMUtils.createTable(
      sectionCells,
      document,
    );
    sectionTable.classList.add('import-table');
    block.before(document.createElement('hr'));
    block.replaceWith(...block.querySelectorAll('.import-table'), sectionTable);
  }
}
