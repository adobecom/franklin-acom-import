export default function createVideo(block, document) {
  const video = block.querySelector('.video iframe');
  const videoLink = document.createElement('a');
  videoLink.src = video.src;
  videoLink.textContent = video.src;

  const bgcolor = block
    .querySelector('div[data-bgcolor]')
    ?.getAttribute('data-bgcolor');
  const background = bgcolor || '';
  const sectionMetadataCells = [['Section Metadata'], ['style', 'l spacing']];

  if (background) {
    sectionMetadataCells.push(['background', background]);
  }
  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );

  sectionMetaDataTable.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(videoLink, sectionMetaDataTable);
}

