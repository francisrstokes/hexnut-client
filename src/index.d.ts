// Type definitions for Hexnut Client
// Project: https://github.com/francisrstokes/hexnut-client/
// Definitions by:
//  - Francis Stokes <https://github.com/francisrstokes/

import { IConfig } from "websocket";

export declare type MessageType = 'connection' | 'message' | 'close';

export declare type Ctx<CtxExtensions> = CtxExtensions & {
  send(...args: Array<any>): void;
  isConnection: boolean;
  isMessage: boolean;
  client: any;
  type: MessageType;
  message: any;
};

export declare type MiddlewareFunction<CtxExtensions> = (ctx: Ctx<CtxExtensions>, next: () => any) => Promise<any> | any;

declare class HexNutClient<CtxExtensions> {
  constructor(wsConfig?: IConfig, WebsocketClientImpl?: any);
  use(middleware: MiddlewareFunction<CtxExtensions>);
  connect(address: string): void;
  send(...args: Array<any>): void;
  isReady(): boolean;
}

export default HexNutClient;
