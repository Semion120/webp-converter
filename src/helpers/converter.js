import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export default function convertik(input, output) {
  ffmpeg(input).output(output).run();
  deleteItem(input, output);
}

function deleteItem(path, doneFile = null) {
  if (fs.existsSync(doneFile)) {
    fs.unlinkSync(path, err => {
      console.log(err);
    });
  } else {
    setTimeout(() => {
      deleteItem(path, doneFile);
    }, 500);
  }
}
