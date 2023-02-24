import Reference from '../interfaces/Reference';
import Status, { Server } from '../interfaces/Status';

const SERVER_STRING = 'Server';
const TIME_STRING = 'Time';
const DATE_STRING = 'Date';

const DATE_FORMAT = 'toLocaleString';

const MAX_STATUS_LENGTH = 6;
const MAX_TIME_LENGTH = 6;
const MAX_DATE_LENGTH: number = new Date()[DATE_FORMAT]().length;

export default (reference: Reference): void => {
    let out = '';

    reference.status.forEach((valueStatus: Status) => {
        let maxServerLength = 0;

        valueStatus.servers.forEach((valueServer: Server) => {
            if (maxServerLength < valueServer.name.length) {
                maxServerLength = valueServer.name.length;
            }
        });

        out += (''
            + '\n'
            + '\n' + ` Upstream: ${valueStatus.upstreamName}`
            + '\n'
            + ' ' + SERVER_STRING.padStart(Math.floor((maxServerLength + SERVER_STRING.length) / 2)).padEnd(maxServerLength)
            + '    ' + 'Status'.padStart(Math.floor(MAX_STATUS_LENGTH / 2)).padEnd(MAX_STATUS_LENGTH)
            + '    ' + TIME_STRING.padStart(Math.floor((MAX_TIME_LENGTH + TIME_STRING.length) / 2)).padEnd(MAX_TIME_LENGTH)
            + '    ' + DATE_STRING.padStart(Math.floor((MAX_DATE_LENGTH + DATE_STRING.length) / 2)).padEnd(MAX_DATE_LENGTH)
        );

        valueStatus.servers.forEach((valueServer: Server) => {
            out += (''
                + '\n'
                + ' ' + valueServer.name.padEnd(maxServerLength)
                + '    ' + (valueServer.ok ? '  Up ' : ' Down').padEnd(MAX_STATUS_LENGTH)
                + '    ' + (valueServer.time < Infinity ? (valueServer.time / 1000).toFixed(3) : '').padStart(MAX_TIME_LENGTH)
                + '    ' + valueServer.date[DATE_FORMAT]()
            );
        });

        out += '\n';
    });

    if (reference.logOut !== out) {
        reference.logOut = out;
        console.clear();
        console.log(out);
    }
};