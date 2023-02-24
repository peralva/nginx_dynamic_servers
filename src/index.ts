import Reference from './interfaces/Reference';
import loadConfig from './utils/loadConfig';
import recordNginxFileConfig from './utils/recordNginxFileConfig';
import setConsoleStatus from './utils/setConsoleStatus';
import startMonitoring from './utils/startMonitoring';
import stopMonitoring from './utils/stopMonitoring';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const reference: Reference = {
    config: {
        nginx_file: {
            conf: '',
        },
        upstreams: [],
    },
    status: [],
    recordNginxFileConfig: false,
    logOut: '',
};

setInterval(
    () => {
        reference.config = loadConfig();

        startMonitoring(reference);
        stopMonitoring(reference);
        setConsoleStatus(reference);
        recordNginxFileConfig(reference);
    },
    1000,
);