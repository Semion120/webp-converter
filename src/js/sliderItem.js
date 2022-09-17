import { cleanFiles, store } from 'src/js/eventListeners.js';
import { extNew } from 'src/js/convert.js';

export function deleteElement(event) {
  const slickTruck = document.querySelector('.slick-track');
  if (slickTruck.childElementCount <= 1) {
    return cleanFiles();
  }
  const id = event.path[2].id ? event.path[2].id : event.path[3].id;
  store.delteOldFile(id);
  store.delteDoneFile(id);
  const itemHtml = document.getElementById(id);
  const isDeleted = $('.slider').slick(
    'slickRemove',
    itemHtml.getAttribute('data-slick-index')
  );
  if (!isDeleted) {
    itemHtml.remove();
  }
}

export function downloadElement(event) {
  const id = event.path[1].id ? event.path[1].id : event.path[2].id;

  const downloadBtn = document.getElementById(id).querySelector('#down_one');

  downloadBtn.click();
}

export function updateItem(itemDone) {
  const downButton = itemDone.querySelector('.down_one');
  downButton.style.opacity = 1;
  const deleteButton = itemDone.querySelector('.icon_delete');
  deleteButton.style.opacity = 1;
  const loader = itemDone.querySelector('.multi-spinner-container').remove();

  const h3 = document.createElement('h3');
  h3.className = 'h3_class_item';
  h3.innerText = extNew.replace('.', '').toUpperCase();
  downButton.before(h3);
}
