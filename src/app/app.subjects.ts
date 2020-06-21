import { Subject } from 'rxjs';
import { TServerOperation, IAppOperation } from './app.types';

export const SERVER_OPERATIONS: Subject<TServerOperation> = new Subject();
export const APP_OPERATIONS: Subject<IAppOperation> = new Subject();