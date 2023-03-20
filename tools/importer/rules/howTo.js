export default function guessHowToBlocks(block, document) {
    let allHeadings = block;
    let heading = allHeadings[0].querySelector("h2").innerHTML;
    let allSubHeadings = block.querySelectorAll(`.cmp-text`);
    let subHeading = allSubHeadings[0].innerHTML;
    let cells = [['How-to'], [heading + '\n' + subHeading]];
    let subPoints = [];
    allHeadings.forEach((element, index) => {
        if (index > 0) subPoints.push([`${element.innerHTML}\n ${allSubHeadings[index].innerHTML}`]);
    });
    cells = [...cells, ...subPoints];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    block.before(document.createElement('hr'));
    block.replaceWith(table);
}
