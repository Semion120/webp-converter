import app from '#src/helpers/createServer.js';
import path from 'path';
import process from 'process';
import multer from 'multer';
import fs from 'fs';
import convertik from '#src/helpers/converter.js';

const upload = multer({ dest: 'uploads/' });
const basePath = process.cwd();
const viewsPath = path.join(basePath, 'src', 'views');
const baseImagesPath = path.join(basePath, 'uploads');

app.post('/delete', (req, res) => {
  const data = req.body;
  const files = fs.readdirSync(baseImagesPath);
  for (const file of files) {
    const filePath = path.join(baseImagesPath, file);
    for (const id of data.imagesIds) {
      if (file.includes(id) && fs.existsSync(filePath)) {
        setTimeout(() => {
          fs.unlink(filePath, () => {});
        }, 1000);
      }
    }
  }

  res.end();
});

app.post('/upload/:id', upload.single('image'), (req, res) => {
  const fileId = req.params.id;
  const oldFileName = fileId + req.body.extensionOld;
  const newFileName = fileId + req.body.extensionNew;
  const oldFileBin = path.join(basePath, req.file.path);

  const fileOld = path.join(baseImagesPath, oldFileName);
  const fileNew = path.join(baseImagesPath, newFileName);

  fs.renameSync(oldFileBin, fileOld, err => {
    console.log(err);
  });
  convertik(fileOld, fileNew);
  res.end();
});

app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(baseImagesPath, fileName);
  res.sendFile(filePath);
  setTimeout(() => {
    fs.unlink(filePath, () => {});
  }, 500);
});

app.get('/status/:filename', (req, res) => {
  const checkedFileName = req.params.filename;
  const files = fs.readdirSync(baseImagesPath).filter(file => {
    return file == checkedFileName;
  });

  if (files[0]) {
    res.status(200).send(JSON.stringify({ isDone: true }));
  } else {
    res.status(200).send(JSON.stringify({ isDone: false }));
  }
});

app.get('/', (req, res) => {
  const indexPath = path.join(viewsPath, 'index.html');
  res.sendFile(indexPath);
});

app.get('/webp2png', (req, res) => {
  const indexPath = path.join(viewsPath, 'webp2png.html');
  res.sendFile(indexPath);
});

app.get('/webp2jpg', (req, res) => {
  const indexPath = path.join(viewsPath, 'webp2jpg.html');
  res.sendFile(indexPath);
});

app.get('/jpg2webp', (req, res) => {
  const indexPath = path.join(viewsPath, 'jpg2webp.html');
  res.sendFile(indexPath);
});

app.get('/png2webp', (req, res) => {
  const indexPath = path.join(viewsPath, 'png2webp.html');
  res.sendFile(indexPath);
});

app.use(function (req, res, next) {
  res.status(404);
  const error404 = path.join(viewsPath, '404.html');
  res.sendFile(error404);
});
export default app;
