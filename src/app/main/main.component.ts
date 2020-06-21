import { Component } from '@angular/core';
import { IServer } from './main.types';
import { STARTING_SERVERS } from './main.constants';
import { SERVER_OPERATIONS } from '../app.subjects';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  servers: IServer[] = [];
  private nextServerID: number;

  constructor() {
    // Simulate sequential addition [animation]
    STARTING_SERVERS.map((server, index) => {
      setTimeout(() => this.servers.push(server), 500 * (index + 1));
    });

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

      console.log(this.nextServerID);
    });

    this.nextServerID = STARTING_SERVERS.length + 1;
  }

  private addServer() {
    this.servers.push({ id: this.nextServerID, apps: [] });
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
}
