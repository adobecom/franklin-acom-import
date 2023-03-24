/* global WebImporter */
export default function guessHowToBlocks(block, document) {
  const allHeadings = block;
  const heading = allHeadings[0].querySelector('h2').innerHTML;
  const allSubHeadings = block.querySelectorAll('.cmp-text');
  const subHeading = allSubHeadings[0].innerHTML;
  let cells = [['How-to'], [`${heading} \n ${subHeading}`]];
  const subPoints = [];
  allHeadings.forEach((element, index) => {
    if (index > 0) {
      subPoints.push([
        `${element.innerHTML}\n ${allSubHeadings[index].innerHTML}`,
      ]);
    }
  });
  cells = [...cells, ...subPoints];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  block.before(document.createElement('hr'));
  block.replaceWith(table);
}
