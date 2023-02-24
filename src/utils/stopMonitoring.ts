import { Upstream } from '../interfaces/Config';
import Reference from '../interfaces/Reference';
import Status, { Server } from '../interfaces/Status';

export default (reference: Reference): void => {
    let update = false;

    reference.status.forEach((valueStatus: Status, indexStatus: number) => {
        valueStatus.servers.forEach((valueServer: Server, indexServer: number) => {
            const upstreamIndex: number = reference.config.upstreams.findIndex((valueUpstream: Upstream) => valueUpstream.name === valueStatus.upstreamName);

            if (false
                || upstreamIndex === -1
                || reference.config.upstreams[upstreamIndex].servers.findIndex((valueServerName: string) => valueServerName === valueServer.name) === -1
            ) {
                if (valueServer.ok) {
                    update = true;
                }

                valueStatus.servers.splice(indexServer, 1);

                if (!valueStatus.servers.length) {
                    reference.status.splice(indexStatus, 1);
                }
            }
        });
    });

    if (update) {
        reference.recordNginxFileConfig = true;
    }
};