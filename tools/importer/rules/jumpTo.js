const BASE_URL = 'https://www.adobe.com';
const MILO_URL = 'https://main--dc--adobecom.hlx.page';

//Find first heading element after anchor element
const findAnchorHeading = (anchorParent) => {
  if(!anchorParent){
    return;
  }

  const nextSibling = anchorParent.nextElementSibling?.classList.contains('dexter-Spacer') ? anchorParent.nextElementSibling?.nextElementSibling : anchorParent.nextElementSibling;
  const heading = nextSibling?.classList.contains('title') ? nextSibling : nextSibling?.querySelector('.title');
  if(heading){
    return heading.textContent;
  }

  return findAnchorHeading(anchorParent.parentElement);
};

export default function createJumpToBlocks(block, document, params, url) {
  const position = block.querySelectorAll('.position');

  const linkSection = position[0];
  const textSection = position[1];

  const linkSectionLinks = linkSection.querySelectorAll('a');
  linkSectionLinks.forEach((link) => {
    const pathname = new URL(url).pathname.split('.')[0];
    const linkId = link.href.split('#').pop();
    const anchorParent = params.elementId[linkId]?.parentElement;
    const heading = findAnchorHeading(anchorParent);
    if(heading) {
      const hrefLink = MILO_URL + pathname + '#' + heading.toLowerCase().trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/-/g, ' ').split(' ').join('-');
      link.setAttribute('href', hrefLink);
    }
  });

  const textSectionLinks = textSection.querySelectorAll('a');
  textSectionLinks.forEach((link) => {
    link.href = BASE_URL + link.href;
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
