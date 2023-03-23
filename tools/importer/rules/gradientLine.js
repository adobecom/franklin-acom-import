export default function createGradientLineBlock(block, document) {
  const para = document.createElement('p');
  para.textContent = 'GradientLine';
  const height = block.getAttribute('data-height');
  const flexDiv = block.querySelector('.dexter-FlexContainer');
  const sectionMetaDataCells = [['section-metadata']];
  let bgImage = null;
  const { backgroundImage } = flexDiv?.style || {};
  const { backgroundImage: blockImage } = block.style || {};

  if (blockImage) {
    bgImage = blockImage;
  }
  if (backgroundImage) {
    bgImage = backgroundImage;
  }

  if (bgImage) {
    sectionMetaDataCells.push(['background', bgImage]);
  }

  if (height) {
    sectionMetaDataCells.push(['height', `${height}`]);
  }

  const metaTable = window.WebImporter.DOMUtils.createTable(
    sectionMetaDataCells,
    document,
  );
  metaTable.classList.add('import-table');

  block.before(document.createElement('hr'));
  block.replaceWith(...[para, metaTable]);
}
