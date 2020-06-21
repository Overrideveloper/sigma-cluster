export interface IApp {
    id: number;
    name: string;
    short_name: string;
    color: string;
}

export type TServerOperation = 'ADD' | 'DESTROY';