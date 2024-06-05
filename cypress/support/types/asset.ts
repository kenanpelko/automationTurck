import { Alias } from "./alias";

export type Asset = {
    name?: string;
    assetType?: any;
    description?: string;
    alias?: [Alias];
};
