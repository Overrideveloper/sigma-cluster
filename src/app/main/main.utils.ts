import { SERVER_ID_RANGE, APP_SERVER_ID_RANGE } from './main.constants';
import { TSortType, IServer } from './main.types';

function GET_RANDOM_NUMBER_RANGE(min: number, max: number) {
    [min, max] = [Math.floor(min), Math.floor(max)];

    return Math.floor(Math.random() * (max - min) + min)
}

export function GET_SERVER_ID() {
    return GET_RANDOM_NUMBER_RANGE(SERVER_ID_RANGE.min, SERVER_ID_RANGE.max);
}

export function GET_APP_SERVER_ID() {
    return GET_RANDOM_NUMBER_RANGE(APP_SERVER_ID_RANGE.min, APP_SERVER_ID_RANGE.max);
}

export function SORT_LIST<T>(list: any[], key: string, type: TSortType): T[] {
    if (type === 'desc') {
        return list.sort((a, b) => {
            const [A, B] = [a[key], b[key]];
            return B > A ? 1 : B < A ? -1 : 0;
        });
    } else {
        return list.sort((a, b) => {
            const [A, B] = [a[key], b[key]];
            return B < A ? 1 : B > A ? -1 : 0;
        });
    }
}

export function GET_STARTING_SERVERS(): IServer[] {
    return [1, 2, 3, 4].map(idx => ({ index: idx, id: GET_SERVER_ID(), modified: Date.now(), apps: []}));
}