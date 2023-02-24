import { Upstream } from '../interfaces/Config';
import Status, { Server } from '../interfaces/Status';
import Reference from '../interfaces/Reference';
import testServer from './testServer';

export default (reference: Reference): void => {
    reference.config.upstreams.forEach((valueUpstream: Upstream) => {
        let statusIndex: number = reference.status.findIndex((valueStatus: Status) => valueStatus.upstreamName === valueUpstream.name);

        if (statusIndex === -1) {
            reference.status.push({
                servers: [],
                upstreamName: valueUpstream.name,
            });

            statusIndex = reference.status.length - 1;
        }

        const status: Status = reference.status[statusIndex];

        valueUpstream.servers.forEach((valueServerName: string) => {
            const serverIndex: number = status.servers.findIndex((valueServerStatus: Server) => valueServerStatus.name === valueServerName);

            if (serverIndex === -1) {
                status.servers.push({
                    name: valueServerName,
                    time: Infinity,
                    date: new Date(),
                });
    
                setTimeout(() => {
                    testServer(reference, valueUpstream.name, valueServerName);
                });
            }
        });
    });
};