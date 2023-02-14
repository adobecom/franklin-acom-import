


export default function guessColumnsBlocks(main, document) {
    const z_pattern_id = ['root_content_positionunwrapped_11',
      'riverflow',
      'root_content_positionunwrapped_118916167',
      'root_content_positionunwrapped_11_245336210',
      'root_content_position_position-par_positionunwrapped_329391457',
      'root_content_positionunwrapped_343631879',
      'id-4410a78dae2d03d01201fa5e2cadc367',
      'id-4ea65f9011f55f2f6372d3d170674159',
      'root_content_positionunwrapped_880712250',
      'root_content_positionunwrapped_11_1515817641',
      'root_content_flex_1267731132',
      'id-bebcc5a926005d87942d62277d1ea011',
      'id-a5d0a62c3b5ba595e2bb739f43c3e216',
    ];
  
    for (var i = 0; i < z_pattern_id.length; i++) {
      let containers = [];
      let tempcontainers = [...document.body.querySelectorAll(`#${z_pattern_id[i]} .dexter-FlexContainer-Items`)].filter((c) => {
        if (c.childElementCount < 2) return false; // ignore empty containers and single element containers
        let ancestor = c; let keep;
        do {
          ancestor = ancestor.parentElement.closest(`#${z_pattern_id[i]} .dexter-FlexContainer-Items`);
          keep = !ancestor || (ancestor.childElementCount < 2);
        } while (ancestor && keep);
        return true;
      });
      containers = tempcontainers
      const cells = [['Z-Pattern']];
  
  
      containers.forEach((container) => {
        if (container.closest('table') || container.querySelector('h1')) return; // exclude existing blocks or hero
        let columns = [...container.children];
        if (columns.length === 0) return;
        if (columns.length > 0 && columns[0].classList.contains('title')) {
          container.before(columns[0]);
          columns = columns.slice(1);
        }
        if (columns.length === 0) return;
        if (columns.length > 1) {
          const row = [];
          columns.forEach((col) => {
            row.push(col.innerHTML);
          });
          cells.push(row);
          
        } else {
          const tc = columns[0].textContent.trim();
          if (tc !== '') {
            container.append(document.createElement('hr'));
          }
        }
      }); 
      const table = WebImporter.DOMUtils.createTable(cells, document);
      document.querySelector(`#${z_pattern_id[i]}`)?.replaceWith(table);
    }
  }
  