import debug from 'debug';
import dotenv from 'dotenv';

dotenv.config();

debug.enable(process.env.DEBUG);
