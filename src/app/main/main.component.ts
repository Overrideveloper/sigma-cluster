import { Component } from '@angular/core';
import { IServer } from './main.types';
import { STARTING_SERVERS } from './main.constants';
import { SERVER_OPERATIONS, APP_OPERATIONS } from '../app.subjects';
import { IApp, IServerApp } from '../app.types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  servers: IServer[] = [];
  private nextServerID: number;

  constructor() {
    // Add servers to cluster sequentially with a 500ms delay between servers
    STARTING_SERVERS.map((server, index) => setTimeout(() => this.servers.push(server), 500 * (index + 1)));

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

    this.nextServerID = STARTING_SERVERS.length + 1;
  }

  get clusterServers() {
    return this.servers.sort((a, b) => {
      const [A, B] = [a.id, b.id];
      return B < A ? 1 : B > A ? -1 : 0;
    });
  }

  setAppBlockGradient(server_id: string, app_server_id: string, index: number, gradient: string) {
    const appBlock: HTMLDivElement = document.getElementById(`server_${server_id}_app_${app_server_id}`) as HTMLDivElement;
    appBlock.style.background = gradient;
  }

  private addServer() {
    this.servers.push({ id: this.nextServerID, modified: Date.now(), apps: [] });
    this.nextServerID += 1;
  }

  private removeServer() {
    const serverID = this.nextServerID - 1;

    if (serverID) {
      const serverIndex = this.servers.findIndex(server => server.id === serverID);

      if (serverIndex > -1) {
        const serverBlock: HTMLDivElement = document.getElementById(`server_${serverID}`) as HTMLDivElement;

        serverBlock.classList.add('server__exit');

        this.nextServerID = serverID;

        setTimeout(() => this.servers.splice(serverIndex, 1), 700);

        return;
      }

      throw new Error('Server cannot be located');
    }
  }

  private startApp(app: IApp) {
    let freeServer = this.servers.find(server => !server.apps.length);
    const _app: IServerApp = { ...app, app_server_id: Math.floor(Math.random() * Math.floor(9999)), started: Date.now() }

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
    const tempServer = this.servers.sort((a, b) => {
      const [A, B] = [a.modified, b.modified];
      return B > A ? 1 : B < A ? -1 : 0;
    }).find(server => server.apps.find(_app => _app.id === app.id));

    if (tempServer) {
      const apps = tempServer.apps.sort((a, b) => {
        const [A, B] = [a.started, b.started];
        return B > A ? 1 : B < A ? -1 : 0;
      });

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
