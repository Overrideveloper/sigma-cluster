import { Subject } from 'rxjs';
import { TServerOperation } from './app.types';

export const SERVER_OPERATIONS: Subject<TServerOperation> = new Subject();