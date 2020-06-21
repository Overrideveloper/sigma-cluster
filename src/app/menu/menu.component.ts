import { Component } from '@angular/core';
import { IApp } from '../app.types';
import { APPS } from '../app.constants';
import { SERVER_OPERATIONS, APP_OPERATIONS } from '../app.subjects';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  apps: IApp[];

  constructor() {
    this.apps = APPS;
  }

  addServer = () => SERVER_OPERATIONS.next('ADD');
  destroyServer = () => SERVER_OPERATIONS.next('DESTROY');

  startApp = (app: IApp) => APP_OPERATIONS.next({ app, operation: 'START' });
  killApp = (app: IApp) => APP_OPERATIONS.next({ app, operation: 'KILL' });
}
