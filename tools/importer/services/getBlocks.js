export default async function getBlocks() {
  // update mock url later
  const response = await fetch('https://run.mocky.io/v3/9325bf4a-5be9-4700-8b0c-ad60e25e1693');
  const data = await response.json();
  return data;
}
