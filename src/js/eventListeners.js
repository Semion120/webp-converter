import { convert, extOld, getUuid } from 'src/js/convert.js';
import displayElement from 'src/js/upload.js';
import 'src/js/jszip.js';
import Store from 'src/js/store.js';

export const store = new Store();

const zipBtn = document.querySelector('#downZip');
zipBtn.addEventListener('click', downZip);
function downZip(event) {
  if (store.doneFiles.length == store.oldFiles.length) {
    const zip = new JSZip();
    store.doneFiles.map(file => {
      zip.file(file.name, file);
    });
    zip.generateAsync({ type: 'Blob' }).then(zipBlob => {
      const downloadUrl = URL.createObjectURL(zipBlob);
      const aDownload = document.querySelector('#download');
      aDownload.href = downloadUrl;
      aDownload.download = 'photos.zip';
      aDownload.click();
    });
  } else setTimeout(downZip, 2000, event);
}

const cleanBtn = document.querySelector('#clean');
cleanBtn.addEventListener('click', cleanFiles);
export function cleanFiles(event) {
  if (store.doneFiles.length == store.oldFiles.length) {
    const slickTrack = document.querySelector('.slick-track');
    while (slickTrack.firstChild) {
      slickTrack.removeChild(slickTrack.firstChild);
    }

    store.oldFiles = [];

    store.doneFiles = [];
    const aDownload = document.querySelector('#download');
    aDownload.href = '';
    aDownload.download = '';

    onOffMainButtons(true);

    const arrows = document.querySelectorAll('button.slick-arrow');
    for (const arrow of arrows) {
      arrow.remove();
    }

    const base_btns = document.querySelector('div.base_btns');
    const dragAndDrop = document.createElement('div');
    dragAndDrop.className = 'dragAndDrop';
    dragAndDrop.innerHTML = '<b>Перетащите файлы сюда</b>';
    base_btns.after(dragAndDrop);
  } else {
    setTimeout(cleanFiles, 2000, event);
  }
}
export function onOffMainButtons(isOff) {
  const downZip = document.querySelector('#downZip');
  downZip.disabled = isOff;

  const deleteBtn = document.querySelector('#clean');
  deleteBtn.disabled = isOff;
}

const mimeType = 'image/' + extOld.replace('.', '');
const input = document.querySelector('#files');
input.attributes.accept.nodeValue = mimeType;
input.addEventListener('change', fileHandle);

const dragAndDropArea = document.querySelector('.dragAndDrop');
dragAndDropArea.addEventListener('drop', fileHandle);
dragAndDropArea.addEventListener('dragover', event => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

const uploadButton = document.querySelector('#uploadImg');
uploadButton.addEventListener('click', e => {
  input.click();
});

addEventListener('unload', async event => {
  const data = JSON.stringify({ imagesIds: store.oldFiles });
  fetch('/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  }).then(res => {
    console.log(res.status);
  });
});

function fileHandle(event) {
  event.stopPropagation();
  event.preventDefault();
  const files = event.target.files
    ? event.target.files
    : event.dataTransfer.files;
  const errors = checkFiles(files);
  if (errors) {
    return alert(errors);
  }
  let filesNum = 0;
  document.querySelector('div.dragAndDrop').remove();
  for (const file of files) {
    const id = getUuid();
    displayElement(file, id);
    filesNum += 1;
    if (filesNum > files.length) {
      continue;
    }
    setTimeout(convert, 1000, file, id);
  }
}

function checkFiles(files) {
  let errors = '';
  if (files.length > 30) {
    errors +=
      'Вы загружаете больше 30 файлов, пожалуйста измените количество.\n';
  }

  for (const file of files) {
    if (file.size / 1000000 >= 50) {
      errors += `${file.name} больше 50 МБ\n`;
    }
  }
  return errors;
}
