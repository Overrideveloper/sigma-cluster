import { IServer } from './main.types';

export const STARTING_SERVERS: IServer[] = [1, 2, 3, 4].map(id => ({ id, modified: Date.now(), apps: []}));