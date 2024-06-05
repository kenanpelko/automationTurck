import { machineVariable } from "../machine-variables";

export default {
    path: {
        assetManagerAssetPool: "/asset-manager/#/asset-pool",
        assetManagerAllocatedAssets: "/asset-manager/#/allocated-assets",
        assetPool: "/asset-pool",
        assetNew: "/assets/new",
        assetManagerAssetTypes: "/asset-manager/#/asset-types",
        assetTypes: "/asset-types",
        assetTypesNew: "/asset-types/new",
    },
    endpoints: {
        assets: "/service/asset-manager/v1/assets",
        tree: "/service/asset-manager/v1/tree",
        unassigned: "/service/asset-manager/v1/assets/unassigned",
        assetTypes: "/service/asset-manager/v1/asset-types",
        assetsId: "**/service/asset-manager/v1/assets/**",
        assetTypesId: "**/service/asset-manager/v1/asset-types/**",
        machines: "/maintenance-angular/#/machines",
        assetClone: "**/service/asset-manager/v1/assets/clone/**",
        transform: "/service/asset-manager/v1/tree/transform",
        property: "/service/asset-manager/v1/properties/asset-type",
        machineVariable: "/service/condition-monitoring/v1/machine-variables"
    }
}
