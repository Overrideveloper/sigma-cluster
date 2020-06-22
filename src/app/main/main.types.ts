import { IServerApp } from '../app.types';

export type TSortType = 'asc' | 'desc';

export interface IClusterIDRange {
    min: number;
    max: number;
}

export interface IServer {
    index: number;
    id: number;
    apps: IServerApp[];
    modified: number;
}