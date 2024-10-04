import 'dotenv/config'
import { convert } from './convert.js';

async function cli() {
    if (process.argv.length < 4) {
        console.error('Usage: node dist/cli.js <filepathIn> <filepathOut>', process.argv);
        process.exit(1);
    }

    const filepathIn = process.argv[2];
    const filepathOut = process.argv[3];

    const modelViewUrl = process.env.MODEL_VIEW_URL;
    const ticket = process.env.BACKEND_TICKET;
    if (!modelViewUrl || !ticket) {
        console.error('MODEL_VIEW_URL and BACKEND_TICKET environment variables must be set in .env file');
        process.exit(1);
    }

    await convert({ filepathIn, filepathOut, modelViewUrl, ticket });
}

(async () => {
    await cli();
})();
