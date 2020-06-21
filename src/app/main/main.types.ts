import { IApp } from '../app.types';

export interface IServer {
    id: number;
    apps: IApp[];
}