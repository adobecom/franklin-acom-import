/* global WebImporter */
const replacewithSigleTable = (block) => {
  const allTables = [...block.querySelectorAll('.accordion-table')];
  let newTable = null;
  allTables.forEach((table, index) => {
    if (index) {
      const title = table.querySelectorAll('tr')[1];
      const description = table.querySelectorAll('tr')[2];
      if (title) {
        newTable.appendChild(title);
      }
      if (description) {
        newTable.appendChild(description);
      }
    } else {
      newTable = table;
    }
  });
  return [...block.querySelectorAll('.text-block-table'), newTable];
};

export default function createAccordionBlocks(block, document) {
  const accordions = block.querySelectorAll('.accordion');

  const title = block.querySelector('.title h2');

  if (title) {
    const titleCells = [['text(full-width)']];
    titleCells.push([title.textContent]);
    const titleTable = WebImporter.DOMUtils.createTable(
      titleCells,
      document,
    );
    titleTable.classList.add('import-table', 'text-block-table');
    title.replaceWith(titleTable);
  }

  // fast return
  if (!accordions.length) {
    return;
  }

  accordions.forEach((accordion) => {
    const items = accordion.querySelectorAll('.spectrum-Accordion-item');
    const cells = [['Accordion (seo)']];

    if (items) {
      items.forEach((item) => {
        const text = document.createElement('p');
        const textContent = item.querySelector('.spectrum-Accordion-itemHeader')?.textContent || 'Title?';
        text.innerHTML = textContent;
        const content = item.querySelector('.spectrum-Accordion-itemContent') || 'Description?';
        cells.push([text]);
        cells.push([content]);
      });
    }
    const accBlockTable = WebImporter.DOMUtils.createTable(
      cells,
      document,
    );
    accBlockTable.classList.add('import-table', 'accordion-table');
    accordion.replaceWith(accBlockTable);
  });
  block.before(document.createElement('hr'));
  block.replaceWith(...replacewithSigleTable(block));
}
