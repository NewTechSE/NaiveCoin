import { ContainerGroup } from "@pulumi/azure-native/containerinstance";
import { ResourceGroup } from "@pulumi/azure-native/resources";
import { Input } from "@pulumi/pulumi";


interface IEnvValue {
    name: Input<string>;
    value: Input<string>;
}

interface IContainerRequest {
    imageName: string;
    containerName: string;
    envs: IEnvValue[];
    port: number;
    dnsNameLabel: string;
}

export const containerService = {
    createACI: (request: IContainerRequest, resourceGroup: ResourceGroup) => {
        const { envs, imageName, port, containerName, dnsNameLabel } = request;
        const containerGroup = new ContainerGroup(containerName, {
            resourceGroupName: resourceGroup.name,
            osType: "Linux",
            containers: [
                {
                    name: containerName,
                    image: imageName,
                    ports: [
                        {
                            port: port
                        }
                    ],
                    environmentVariables: envs,
                    resources: {
                        requests: {
                            cpu: 2.0,
                            memoryInGB: 2.0,
                        },
                    },
                }
            ],
            ipAddress: {
                ports:
                    [
                        {
                            port: port,
                            protocol: "Tcp",
                        }
                    ],
                type: "Public",
                dnsNameLabel: dnsNameLabel,
            },
            restartPolicy: "Never",
        });

        return containerGroup;
    }
}