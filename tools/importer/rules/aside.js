/* global WebImporter */
export default function createAsideBlocks(block, document) {
  const cells = [['aside (notification, small)']];
  // empty row for background image
  cells.push([' ']);
  const contentWrapper = document.createElement('div');

  // Selecting all images
  const images = block.querySelectorAll('.image img');
  const imageWrapper = document.createElement('p');
  images.forEach((image) => {
    const img = document.createElement('img');
    img.src = image.getAttribute('src');
    imageWrapper.appendChild(img);
  });

  // Add Images
  if (imageWrapper.childElementCount) {
    contentWrapper.appendChild(imageWrapper);
  }

  // Selecting Text
  const text = block.querySelector('.text p');
  if (text) {
    contentWrapper.appendChild(text);
  }

  // Selecting Link
  const link = block.querySelector('.cta a');
  if (link) {
    contentWrapper.appendChild(link);
  }

  cells.push([contentWrapper]);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  table.classList.add('import-table');
  block.before(document.createElement('hr'));
  block.replaceWith(table);
}
