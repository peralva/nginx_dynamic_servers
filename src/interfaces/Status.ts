interface Interface {
    upstreamName: string,
    servers: Array<Server>,
}

export interface Server {
    name: string,
    time: number,
    date: Date,
    ok?: boolean,
}

export default Interface;