interface Interface {
    verificationTime?: number,
    nginx_file: {
        conf: string,
        bin?: string,
    },
    upstreams: Array<Upstream>,
}

export default Interface;

export interface Upstream {
    name: string,
    servers: Array<string>,
    protocol?: string,
    limit_time?: number,
    test?: {
        method?: string,
        path?: string,
        body?: object,
    },
}