import { IServerApp } from '../app.types';

export interface IServer {
    id: number;
    apps: IServerApp[];
    modified: number;
}