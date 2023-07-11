export default function createConsonantCardBlock(block, document) {
  const cardCollection = document.createElement('a');
  cardCollection.href = 'https://main--dc--adobecom.hlx.page/dc-shared/fragments/seo-articles/seo-caas-collection';
  cardCollection.textContent = 'https://main--dc--adobecom.hlx.page/dc-shared/fragments/seo-articles/seo-caas-collection';

  block.before(document.createElement('hr'));
  block.replaceWith(cardCollection);
}
