import { Upstream } from '../interfaces/Config';
import Reference from '../interfaces/Reference';
import Status, { Server } from '../interfaces/Status';
import testEndpoint from './testEndpoint';

const testServer = async (reference: Reference, upstreamName: string, serverName: string): Promise<void> => {
    const upstreamConfigIndex: number = reference.config.upstreams.findIndex((value: Upstream) => value.name === upstreamName);

    if (upstreamConfigIndex > -1) {
        const upstreamConfig: Upstream = reference.config.upstreams[upstreamConfigIndex];

        let url = `${upstreamConfig.protocol ?? 'http'}://${serverName}`;
        let method: string;
        let body: object;

        if (upstreamConfig.test) {
            url += `${upstreamConfig.test.path || ''}`;

            if (upstreamConfig.test.method) {
                method = upstreamConfig.test.method;
            }

            if (upstreamConfig.test.body) {
                body = upstreamConfig.test.body;
            }
        }

        let ok: boolean;
        let time: number = new Date().getTime();

        try {
            ok = await new Promise((resolve, reject) => {
                testEndpoint({
                    url,
                    method,
                    body
                }).then((value: boolean) => {
                    resolve(value);
                    callTestServer(reference, upstreamName, serverName);
                }).catch((reason: Error) => {
                    reject(reason);
                    callTestServer(reference, upstreamName, serverName);
                });

                if (Object.prototype.toString.call(upstreamConfig.limit_time) === '[object Number]') {
                    setTimeout(
                        () => {
                            reject();
                        },
                        upstreamConfig.limit_time
                    );
                }
            });
        } catch(err) {
            ok = false;
        }

        const date: Date = new Date();
        time = date.getTime() - time;

        const upstreamStatusIndex: number = reference.status.findIndex((value: Status) => value.upstreamName === upstreamName);
        
        if (upstreamStatusIndex > -1) {
            const serverIndex: number = reference.status[upstreamStatusIndex].servers.findIndex((value: Server) => value.name === serverName);

            if (serverIndex > -1) {
                const server: Server = reference.status[upstreamStatusIndex].servers[serverIndex];

                server.time = time;

                if (false
                    || Object.prototype.toString.call(server.ok) !== '[object Boolean]'
                    || server.ok !== ok
                ) {
                    const update: boolean = (false
                        || Object.prototype.toString.call(server.ok) === '[object Boolean]'
                        || ok
                    );

                    server.ok = ok;
                    server.date = date;

                    if (update) {
                        reference.recordNginxFileConfig = true;
                    }
                }
            }
        }
    }
};

const callTestServer = (reference: Reference, upstreamName: string, serverName: string): void => {
    const upstreamIndex: number = reference.status.findIndex((value: Status) => value.upstreamName === upstreamName);

    if (upstreamIndex > -1) {
        if (reference.status[upstreamIndex].servers.findIndex((value: Server) => value.name === serverName) > -1) {
            setTimeout(
                () => {
                    testServer(reference, upstreamName, serverName);
                },
                1000,
            );
        }
    }
};

export default testServer;