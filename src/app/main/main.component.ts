import { Component } from '@angular/core';
import { IServer } from './main.types';
import { SERVER_OPERATIONS, APP_OPERATIONS } from '../app.subjects';
import { IApp, IServerApp } from '../app.types';
import { GET_SERVER_ID, SORT_LIST, GET_APP_SERVER_ID, GET_STARTING_SERVERS } from './main.utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  servers: IServer[] = [];

  constructor() {
    // Add servers to cluster sequentially with a 500ms delay between servers
    GET_STARTING_SERVERS().map((server, index) => setTimeout(() => this.servers.push(server), 500 * (index + 1)));

    // Listen for dispatched Server Operations => ADD | DESTROY
    SERVER_OPERATIONS.subscribe(operation => {
      switch (operation) {
        case "ADD":
          this.addServer();
          break;

        case "DESTROY":
          this.removeServer();
          break;
      
        default:
          throw new Error("Server Operation not specified");
      }
    });

    // Listen for dispatched App Operations => START | KILL
    APP_OPERATIONS.subscribe(payload => {
      switch (payload.operation) {
        case "START":
          this.startApp(payload.app);
          break;

        case "KILL":
          this.killApp(payload.app);
          break;
      
        default:
          throw new Error("App Operation not specified");
      }
    });
  }

  get clusterServers() {
    return SORT_LIST<IServer>(this.servers, 'index', 'asc');
  }

  setAppBlockGradient(server_id: string, app_server_id: string, index: number, gradient: string) {
    const appBlock: HTMLDivElement = document.getElementById(`server_${server_id}_app_${app_server_id}`) as HTMLDivElement;
    appBlock.style.background = gradient;
  }

  private addServer() {
    this.servers.push({ index: this.servers.length + 1, id: GET_SERVER_ID(), modified: Date.now(), apps: [] });
  }

  removeServer(id?: number) {
    if (this.servers.length) {
      let serverIndex = -1;

      if (id) {
        serverIndex = this.servers.findIndex(server => server.id === id); 
      } else {
        serverIndex = this.servers.findIndex(server => server.index === this.servers.length); 
      }

      if (serverIndex > -1) {
        const serverBlock: HTMLDivElement = document.getElementById(`server_${this.servers[serverIndex].id}`) as HTMLDivElement;

        serverBlock.classList.add('server__exit');

        setTimeout(() => {
          const orphanApps = this.servers.splice(serverIndex, 1)[0].apps;
          orphanApps.map(app => this.startApp(app));
        }, 700);

        return;
      }

      throw new Error('Server cannot be located'); 
    }
  }

  private startApp(app: IApp) {
    const _app: IServerApp = { ...app, app_server_id: GET_APP_SERVER_ID(), started: Date.now() }

    let freeServer = this.servers.find(server => !server.apps.length);

    if (freeServer) {
      freeServer.apps.push(_app);
      freeServer.modified = Date.now();
    } else {
      freeServer = this.servers.find(server => server.apps.length < 2);

      if (freeServer) {
        freeServer.apps.push(_app);
        freeServer.modified = Date.now();
      }
    }
  }

  private killApp(app: IApp) {
    const tempServer = SORT_LIST<IServer>(this.servers, 'modified', 'desc').find(server => server.apps.find(_app => _app.id === app.id));

    if (tempServer) {
      const apps = SORT_LIST<IServerApp>(tempServer.apps, 'started', 'desc' );

      const tempAppIndex = apps.findIndex(_app => _app.id === app.id);
      const appServerID = apps[tempAppIndex].app_server_id;

      const appBlock: HTMLDivElement = document.getElementById(`server_${tempServer.id}_app_${appServerID}`) as HTMLDivElement;
      appBlock.classList.add('app__exit');

      const server = this.servers.find(server => server.id === tempServer.id);
      const appIndex = server.apps.findIndex(app => app.app_server_id === appServerID);

      setTimeout(() => server.apps.splice(appIndex, 1), 700);
    }
  }
}
