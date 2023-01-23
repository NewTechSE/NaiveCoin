import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import { containerService } from "./container-service";


// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("NaiveCoin");

const backendContainerGroup = containerService.createACI(
    {
        containerName: "backend",
        port: 3001,
        imageName: "kafkawannafly/naivecoin-backend",
        dnsNameLabel: "naivecoin-backend",
        envs: [
            {
                name: "ORIGIN",
                value: "*"
            }
        ]
    },
    resourceGroup
);

const config = new pulumi.Config("azure-native");
const azLocation = config.require("location").toLowerCase();
export const backendUrl = backendContainerGroup.ipAddress.apply(ip => {
    return `http://${ip?.dnsNameLabel}.${azLocation}.azurecontainer.io:${ip?.ports[0].port}/blockchain`;
});

const frontendContainerGroup = containerService.createACI(
    {
        containerName: "frontend",
        dnsNameLabel: "naivecoin-frontend",
        imageName: "kafkawannafly/naivecoin-frontend",
        port: 80,
        envs: [
            {
                name: "REACT_APP_HOST",
                value: backendUrl
            },
            {
                name: "NODE_ENV",
                value: "production"
            }
        ]
    },
    resourceGroup
);

export const frontendUrl = frontendContainerGroup.ipAddress.apply(ip => {
    return `http://${ip?.dnsNameLabel}.${azLocation}.azurecontainer.io:${ip?.ports[0].port}`;
});