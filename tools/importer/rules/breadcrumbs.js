export default function createBreadcrumbBlock (document){
  const main = document.querySelector('main');
  const breadcrumbs = document.querySelector('.feds-breadcrumbs-items');

  if(!breadcrumbs) {
    return;
  }

  const breadcrumbsElements  = breadcrumbs.querySelectorAll('.feds-breadcrumbs-element');
  
  const breadcrumbCells = [['Breadcrumbs']];
  breadcrumbsElements.forEach((el) => {
    const elLink  = el.querySelector('a');
    if(el.classList.contains('feds-hideOnDesktop')){
      el.remove();
    }

    if (elLink && elLink.href.indexOf('https') === -1) {
      elLink.href =`https://www.adobe.com${elLink}`;
    }
  });

  breadcrumbCells.push([breadcrumbs]);
  const breadcrumbsBlockTableComplete = WebImporter.DOMUtils.createTable(
    breadcrumbCells,
    document
  );

  main.insertBefore(breadcrumbsBlockTableComplete, main.firstChild);
}