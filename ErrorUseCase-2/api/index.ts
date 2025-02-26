import express from 'npm:express';
import { rateLimit, MemoryStore } from 'npm:express-rate-limit';

const app = express();

const limiter = rateLimit({
	limit: 100,
    windowMs: 1 * 60 * 1000,
	legacyHeaders: false,
	standardHeaders: true,
	store: new MemoryStore(),
});

app.use(limiter);

app.get('/', (_, res) => {
	console.log('Received request for http://localhost:8000/');
	res.send('Hello world');
});

app.get('/foo', (_, res) => {
	console.log('Received request for http://localhost:8000/foo');
	res.send('Hello world');
});

console.log('Listening on http://0.0.0.0:8000/');
app.listen(8000);
