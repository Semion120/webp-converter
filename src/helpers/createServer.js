import express from 'express';

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'pug');
export default app;
