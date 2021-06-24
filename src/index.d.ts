// Type definitions for Hexnut Client
// Project: https://github.com/francisrstokes/hexnut-client/
// Definitions by:
//  - Francis Stokes <https://github.com/francisrstokes/

import { IConfig } from "websocket";

declare type MessageType = 'connection' | 'message' | 'close';

declare type Ctx<CtxExtensions> = CtxExtensions & {
  send(...args: Array<any>): void;
  isConnection: boolean;
  isMessage: boolean;
  client: WebSocket;
  type: MessageType;
  message: any;
};

declare type MiddlewareFunction<CtxExtensions> = (ctx: Ctx<CtxExtensions>, next: () => any) => Promise<any> | any;

declare class HexNutClient<CtxExtensions> {
  constructor();
  constructor(wsConfig: IConfig);
  use(middleware: MiddlewareFunction<CtxExtensions>);
  connect(address: string): void;
  send(...args: Array<any>): void;
  isReady(): boolean;
}

export default HexNutClient;
