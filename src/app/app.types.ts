export type TServerOperation = 'ADD' | 'DESTROY';
export type TAppOperationType = 'START' | 'KILL';

export interface IApp {
    id: number;
    name: string;
    short_name: string;
    color: string;
    gradient: string;
}

export interface IServerApp extends IApp {
    app_server_id: number;
    started: number;
}

export interface IAppOperation {
    operation: TAppOperationType;
    app: IApp;
}