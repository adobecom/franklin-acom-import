const BASEURL = 'https://www.adobe.com';

const createBreadcrumbsBlock = (document)=> {
  const main = document.querySelector('main');
  const breadcrumbs = document.querySelector('.feds-breadcrumbs-items');

  if(!breadcrumbs) {
    return;
  }

  const breadcrumbsElements  = breadcrumbs.querySelectorAll('.feds-breadcrumbs-element');

  const cells = [['Breadcrumbs']];
  breadcrumbsElements.forEach((element) => {
    const elementLink  = element.querySelector('a');
    if(element.classList.contains('feds-hideOnDesktop')){
      element.remove();
    }

    if(elementLink && !elementLink.href.includes(BASEURL)){
      const path = new URL(elementLink.href).pathname;
      elementLink.href = BASEURL + path;
    }
  });

  cells.push([breadcrumbs]);
  const breadcrumbsBlockTableComplete = WebImporter.DOMUtils.createTable(
    cells,
    document
  );

  main.insertBefore(breadcrumbsBlockTableComplete, main.firstChild);
}

export default createBreadcrumbsBlock;
