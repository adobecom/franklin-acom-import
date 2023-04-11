/* global WebImporter */
export default function createAsideBlocks(block, document) {
  const cells = [['aside (notification, small)']];

  // background color or background image
  const bgImage = block.querySelector('div[style]')?.getAttribute('style').split('"')[1];
  const bgcolor = block.querySelector('div[data-bgcolor]')?.getAttribute('data-bgcolor');
  let bgImageElement = null;
  if (bgImage) {
    bgImageElement = document.createElement('img');
    bgImageElement.src = bgImage;
  }
  cells.push([bgImageElement || bgcolor || ' ']);

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

  // select heading
  const title = block.querySelector('.title h2');
  if (title) {
    contentWrapper.appendChild(title);
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
