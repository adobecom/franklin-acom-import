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
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    table.classList.add('import-table');
    textElement.replaceWith(table);
  }
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

export default function createMasonryBlock(block, document) {
  const dexterSpacer = block.querySelector('.dexter-Spacer');
  if (dexterSpacer) {
    const titleElement = dexterSpacer.parentElement.children[0];
    createTextBlock(titleElement, document);
  }

  const containers = [
    ...block.querySelectorAll('.dexter-FlexContainer-Items'),
  ].filter((c) => {
    if (c.childElementCount < 2) return false;
    let ancestor = c;
    let keep;
    do {
      ancestor = ancestor.parentElement.closest('.dexter-FlexContainer-Items');
      keep = !ancestor || ancestor.childElementCount < 2;
    } while (ancestor && keep);
    return keep;
  });

  containers.forEach((container) => {
    const columns = [...container.children];
    if (columns.length === 0) return;
    if (columns.length > 0 && columns[0].classList.contains('title')) {
      createTextBlock(container, document);
    }
    if (columns.length > 1) {
      const cells = [['Columns']];
      const row = [];
      columns.forEach((col) => {
        attachBackgroundImage(col, document);
        row.push(col.innerHTML);
      });
      cells.push(row);
      const nextElement = container.nextElementSibling;
      if (nextElement) {
        const cta = nextElement.classList.contains('dexter-Cta');
        if (cta) {
          const link = nextElement.querySelector('a');
          cells.push([link]);
        }
      }
      const table = WebImporter.DOMUtils.createTable(cells, document);
      table.classList.add('import-table');
      container.replaceWith(table);
    } else {
      const tc = columns[0].textContent.trim();
      if (tc !== '') {
        container.append(document.createElement('hr'));
      }
    }
  });
  block.before(document.createElement('hr'));
  block.replaceWith(...block.querySelectorAll('.import-table'));
}
