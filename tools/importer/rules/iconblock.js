/* global WebImporter */
const hasClass = (element, className) => !!(element && element.classList.contains(className));

const creativityForAllIconBlock = (block, document) => {
  const iconBlockCreation = (container, type) => {
    let creativityContent = container;
    if (type === 'Pattern1') {
      creativityContent = container.querySelector(
        '.position .dexter-Position > div',
      );
    }

    // find image
    const imageElement = creativityContent.querySelector('.image img');
    let imageSrc = '';
    if (imageElement?.getAttribute('src')?.indexOf('https') === -1) {
      imageSrc = `https://www.adobe.com${imageElement.getAttribute('src')}`;
    } else {
      imageSrc = imageElement.getAttribute('src');
    }
    const imageLink = document.createElement('a');
    imageLink.innerHTML = imageSrc;
    imageLink.setAttribute('href', imageSrc);

    // find title content
    let titleElement = creativityContent.querySelector('.title h2');
    if (!titleElement) {
      titleElement = creativityContent.querySelector('.title h3');
    }
    if (!titleElement) {
      titleElement = creativityContent.querySelector('.text h1');
    }
    if (!titleElement) {
      titleElement = creativityContent.querySelector('.text h2');
    }

    // find description element
    const descriptionElement = creativityContent.querySelectorAll('.text p');

    // find link element
    const linkElement = creativityContent.querySelector('.text a');

    if (imageLink && titleElement && descriptionElement.length && linkElement) {
      const contentCell = document.createElement('div');
      contentCell.appendChild(imageLink);
      contentCell.appendChild(titleElement);
      descriptionElement.forEach((element) => {
        contentCell.appendChild(element);
      });
      contentCell.appendChild(linkElement);
      const cells = [['icon-block (fullwidth, large)'], [contentCell]];

      // icon block table
      const table = WebImporter.DOMUtils.createTable(cells, document);
      table.classList.add('import-table');
      block.before(document.createElement('hr'));
      const sectionMetadataCells = [
        ['Section Metadata'],
        ['style', 'xxxl spacing'],
      ];
      // section metadata Table
      const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
        sectionMetadataCells,
        document,
      );
      sectionMetaDataTable.classList.add('import-table');
      block.replaceWith(table, sectionMetaDataTable);
    }
  };

  const checkPattern1 = (container) => {
    const creativityContent = container.querySelector(
      '.position .dexter-Position > div',
    );
    const childCountValidation = creativityContent.childElementCount === 4;
    const childElements = ['image', 'title', 'text', 'text'];
    let testChildOrder = true;
    if (childCountValidation) {
      childElements.forEach((element, index) => {
        if (!creativityContent.children[index].classList.contains(element)) {
          testChildOrder = false;
        }
      });
    }
    return childCountValidation && testChildOrder;
  };

  const checkPattern2 = (container) => {
    const creativityContent = container;
    const childElements = ['image', 'text', 'text', 'text'];
    let testChildOrder = true;
    childElements.forEach((element, index) => {
      if (!creativityContent.children[index].classList.contains(element)) {
        testChildOrder = false;
      }
    });
    return testChildOrder;
  };

  const checkPattern3 = (container) => {
    const creativityContent = container;
    const childElements = ['image', 'title', 'text', 'text'];
    let testChildOrder = true;
    childElements.forEach((element, index) => {
      if (!creativityContent.children[index].classList.contains(element)) {
        testChildOrder = false;
      }
    });
    return testChildOrder;
  };

  const containers = [];
  [...block.querySelectorAll('.dexter-FlexContainer-Items')].forEach(
    (c) => {
      const order1 = c.childElementCount === 1
      && hasClass(c.children[0], 'position')
      && checkPattern1(c);
      const order2 = c.childElementCount === 4
      && hasClass(c.children[0], 'image')
      && hasClass(c.children[0], 'parbase')
      && (checkPattern2(c) || checkPattern3(c));
      if (order1) {
        containers.push({
          element: c,
          type: 'Pattern1',
        });
      } else if (order2) {
        containers.push({
          element: c,
          type: 'Pattern2',
        });
      }
    },
  );

  containers.forEach(({ element, type }) => {
    iconBlockCreation(element, type);
  });
};

const expressIconBlock = (block, document) => {
  // all different blocks
  const bgImage = block.querySelector('div[style]').getAttribute('style').split('"')[1];
  const metaData = block.querySelectorAll('.position');

  // icon block selectors
  const textImageMetaData = metaData[0];

  // find image
  const imageElement = textImageMetaData.querySelector('.image img');
  let imageSrc = imageElement?.getAttribute('src');
  if (imageSrc && imageSrc.indexOf('https') === -1) {
    imageSrc = `https://www.adobe.com${imageSrc}`;
  }
  const imageLink = document.createElement('a');
  imageLink.innerHTML = imageSrc;
  imageLink.setAttribute('href', imageSrc);

  // find title content
  let titleElement = textImageMetaData.querySelector('.text h2');
  if (!titleElement) {
    titleElement = textImageMetaData.querySelector('.title h2');
  }
  const titleContent = titleElement.textContent;

  // find description content
  const descriptionContent = textImageMetaData.querySelector('.text p').textContent;

  // icon block cell creation
  const title = document.createElement('h2');
  title.innerHTML = titleContent;
  const description = document.createElement('p');
  description.innerHTML = descriptionContent;
  const contentCell = document.createElement('div');
  contentCell.appendChild(imageLink);
  contentCell.appendChild(title);
  contentCell.appendChild(description);

  const cells = [['icon-block (fullwidth, large)'], [contentCell]];

  // icon block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');

  // coloumns selectors
  const columnsMetaData = metaData[1];

  // find flex elements
  const columns = [];
  const flexItems = columnsMetaData.querySelectorAll('.flex');
  flexItems.forEach((flex) => {
    if (flex.className.indexOf('aem-GridColumn') === -1) {
      const imageElementColumn = columnsMetaData.querySelector('.image img');
      let imageSrcColumn = imageElementColumn?.getAttribute('src');
      if (imageSrcColumn && imageSrcColumn.indexOf('https') === -1) {
        imageSrcColumn = `https://www.adobe.com${imageSrcColumn}`;
      }
      const imageLinkColumn = document.createElement('a');
      imageLinkColumn.innerHTML = imageSrcColumn;
      imageLinkColumn.setAttribute('href', imageSrcColumn);
      const titleContentColumn = flex.querySelector('.text p').textContent;
      const linkElement = flex.querySelector('.dexter-Cta a');

      // column creation
      const column = document.createElement('div');
      column.appendChild(imageLinkColumn);
      const titleParent = document.createElement('p');
      linkElement.innerHTML = titleContentColumn;
      titleParent.appendChild(linkElement);
      column.appendChild(titleParent);
      columns.push(column);
    }
  });

  // columns cell creation
  const columnCells = [['Columns(contained, middle)'], columns];

  // columns Table
  const columnTable = WebImporter.DOMUtils.createTable(columnCells, document);
  columnTable.classList.add('import-table');

  // section metadata cell creation
  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'xxxl spacing'],
  ];

  if (bgImage) {
    sectionMetadataCells.push(['background', bgImage]);
  }

  // section metadata Table
  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table, columnTable, sectionMetaDataTable);
};

export default function createIconBlock(block, document) {
  if (block.querySelectorAll('.position').length > 1) {
    expressIconBlock(block, document);
  } else {
    creativityForAllIconBlock(block, document);
  }
}
