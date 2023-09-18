export default function createJumpToSectionBlocks(block, document, url) {
  const position = block.querySelectorAll('.position');

  const linkSection = position[0];
  const textSection = position[1];

  const linkSectionLinks = linkSection.querySelectorAll('a');
  linkSectionLinks.forEach((link) => {
    const pathname = new URL(url).pathname.split('.')[0];
    const linkTitle = link.innerHTML;
    if(linkTitle) {
      const hrefLink = 'https://main--cc--adobecom.hlx.page' + pathname + '#' + linkTitle.toLowerCase().trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/-/g, ' ').split(' ').join('-');
      link.setAttribute('href', hrefLink);
    }
  });

  const linkCells = [['text'], [linkSection]];

  const linkTable = WebImporter.DOMUtils.createTable(linkCells, document);
  linkTable.classList.add('import-table');

  const textCells = [['text(inset, l-body, large)'], [textSection]];
  const textTable = WebImporter.DOMUtils.createTable(textCells, document);
  textTable.classList.add('import-table');


  block.before(document.createElement('hr'));
  block.replaceWith(linkTable);
  linkTable.after(textTable);

  const sectionMetadataCells = [['Section Metadata'], ['style', 'xl spacing, two up'], ['layout', '1 | 2']];

  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  sectionMetaDataTable.classList.add('import-table');
  textTable.after(sectionMetaDataTable);
}