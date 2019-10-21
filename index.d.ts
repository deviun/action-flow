declare module "action-flow" {
  export interface ActionFlowParametersT {
    driverName?: string;
    awaitTimeoutSec?: number;
    driverClass?: any;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    sessionName?: string;
    noSHA?: boolean;
  }

  export interface ActionFlowDescriptionT {
    [property: string]: any;
    description?: string;
  }

  export class ManagerCore {
    constructor(): void;

    await(): Promise<void>;
    end(): Promise<void>;
    static multi(descriptionList: ActionFlowDescriptionT[], data: ActionFlowParametersT): MultiFlow;
  }

  export class MultiFlow {
    constructor(descriptionList: ActionFlowDescriptionT[], data: ActionFlowParametersT)
  }

  export class Creator {
    constructor(data: ActionFlowParametersT);

    create(flowDescription: ActionFlowDescriptionT): ManagerCore;

    multi(descriptionList: ActionFlowDescriptionT[]): MultiFlow;
  }

  export type CreatorFunctionT = (data: ActionFlowParametersT) => Creator;
  
  export = CreatorFunctionT;
}
