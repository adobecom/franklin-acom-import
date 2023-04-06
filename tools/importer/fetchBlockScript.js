import blockScripts from './rules/index.js';
import fileTypesBlockScript from './rules/file-types/index.js';

export default function fetchBlockScript(url) {
  let allScripts = {};
  switch (true) {
    case url.includes('/file-types/'):
      allScripts = {
        ...blockScripts,
        ...fileTypesBlockScript,
      };
      break;
    default:
      allScripts = {
        ...blockScripts,
      };
  }
  return allScripts;
}
