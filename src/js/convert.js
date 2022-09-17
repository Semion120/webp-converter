import { store, onOffMainButtons } from 'src/js/eventListeners.js';
import { updateItem } from 'src/js/sliderItem.js';

const formats = document.querySelector('#formats');
export const extOld = formats.getAttribute('data-oldFilesFormat');
export const extNew = formats.getAttribute('data-doneFilesFormat');

export function convert(file, id) {
  const newName = file.name.replace(extOld, extNew);
  store.oldFiles.push(id);
  const formData = new FormData();
  formData.append('extensionOld', extOld);
  formData.append('extensionNew', extNew);
  formData.append('image', file);
  fetch(`/upload/${id}`, {
    method: 'POST',
    body: formData,
  }).then(async response => {
    if (response.status == 200) {
      const fileName = id + extNew;
      await getStatusImageAndDownload(fileName, newName, id);
    }
  });
}

async function getStatusImageAndDownload(fileName, newName, fileId) {
  fetch(`/status/${fileName}`, {
    method: 'GET',
  }).then(async res => {
    const statusImage = await res.json();
    if (statusImage.isDone) {
      await downloadImage(fileName, newName, fileId);
    } else {
      setTimeout(async () => {
        await getStatusImageAndDownload(fileName, newName, fileId);
      }, 1500);
    }
  });
}

async function downloadImage(fileName, newName, fileId) {
  fetch(`/download/${fileName}`, {
    method: 'GET',
  }).then(async res => {
    const imageBlob = await res.blob();
    const imageDone = new File([imageBlob], newName, {
      type: imageBlob.type,
    });
    imageDone.id = fileId;
    store.doneFiles.push(imageDone);
    if (store.doneFiles.length == store.oldFiles.length) {
      onOffMainButtons(false);
    }

    const downloadUrl = URL.createObjectURL(imageDone);
    const doneItem = document.getElementById(fileId);
    const downloadBtn = doneItem.querySelector('#down_one');

    downloadBtn.href = downloadUrl;
    downloadBtn.download = imageDone.name;
    updateItem(doneItem);
  });
}

export function getUuid() {
  return (performance.now().toString(36) + Math.random().toString(36)).replace(
    /\./g,
    ''
  );
}
