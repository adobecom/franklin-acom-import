export default function longText(block, document) {
  const cells = [['Longtext']];
  const allData = [...block.querySelectorAll('main h1,h2,h3,h4,p,img, a, button')]
  const newWrapper = document.createElement('div');
  allData.forEach((element) => {
    newWrapper.append(element)
  })
  cells.push([newWrapper])
  const table = WebImporter.DOMUtils.createTable(cells, document);
  block.replaceWith(table);
}

