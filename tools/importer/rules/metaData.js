//Card metadata table
export const createCardMetadata = async (document, url) => {
  const consonantCard = document.querySelector('consonant-card-collection');
  if(!consonantCard){
    return;
  }

  const cells = [['card metadata']];
  const cardMeta = {};
  cardMeta.title = document.querySelector('h1')?.textContent;

  const ogImageAlt = document.querySelector('[property="og:image:alt"]');
  cardMeta.cardImageAltText = ogImageAlt?.content;

  const ogImage = document.querySelector('[property="og:image"]');
  const firstImage = document.querySelector('.image img');
  const el = document.createElement('img');
  if(ogImage){
    el.src = ogImage.content;
    cardMeta.cardImage = el;
  }else {
    cardMeta.cardImage = firstImage;
  }
  const dataConfig = JSON.parse(consonantCard.getAttribute('data-config'));
  const endpoint = dataConfig && new URL(dataConfig.collection.endpoint).searchParams;
  cardMeta.primaryTag = endpoint?.get('contentTypeTags');
  //importing json with CaaS tags
  try{
    const {default: caas_data} = await import('../caas_tags.json',{
      assert: {
        type: 'json'
      }
    });
    const tags = caas_data[url];
    cardMeta.Tags = tags
      ?.filter((tag) => tag !== cardMeta.primaryTag)
      .join(',');

  }catch (e) {
    console.log(e);
  }
  Object.entries(cardMeta).forEach(([key, value]) => {
    cells.push([key, value]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  return table;
};

const createMetadataBlock = (document, cardMetadataTable) => {
  const main = document.querySelector('main');
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  meta['Gnav Source'] = '/dc-shared/gnav';
  meta['Footer Source'] = '/dc-shared/footer';

  meta.Chromeext = 'https://main--dc--adobecom.hlx.live/dc-shared/fragments/shared-fragments/browser-extension/browser-extension-chrome';
  meta.Edgeext = 'https://main--dc--adobecom.hlx.live/dc-shared/fragments/shared-fragments/browser-extension/browser-extension-edge'
  meta.Header = 'gnav';

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(document.createElement('hr'));
  main.append(block);

  if(cardMetadataTable){
    main.append(cardMetadataTable);
  }
};

export default createMetadataBlock;
