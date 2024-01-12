
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
  cardMeta.cardImageAltText = ogImageAlt?.content ?? '';

  const ogImage = document.querySelector('[property="og:image"]');
  const firstImage = document.querySelector('.image img');
  const el = document.createElement('img');
  if(ogImage){
    el.src = ogImage.content;
    cardMeta.cardImage = el;
  }else {
    cardMeta.cardImage = firstImage;
  }
  cardMeta.primaryTag = '' ;
  cardMeta.Tags = '';
  //importing json with CaaS tags
  try{
    const resp = await fetch('../file_type_tags.json');
    if (!(resp.ok)) return;
    const json = await resp.json();
    const caasTags = (Array.isArray(json) ? json : json.data)
    .filter(({ page }) => page === url);

    const tags = caasTags[0].tags;
    let caas = tags.replaceAll('[','').replaceAll(']','').replaceAll(cardMeta.primaryTag,''); 
  }catch (e) {
    console.log(e);
  }
  Object.entries(cardMeta).forEach(([key, value]) => {
    cells.push([key, value]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  return table;
};

export default function createMetadataBlock(document, cardMetadataTable) {
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

  const canonical = document.querySelector('[rel="canonical"]');
  if (canonical) {
    meta.Canonical = canonical.href;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(document.createElement('hr'));
  main.append(block);

  if(cardMetadataTable){
    main.append(cardMetadataTable);
  }
};
