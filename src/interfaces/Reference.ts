import Config from './Config';
import Status from './Status';

interface Interface {
    config: Config,
    status: Array<Status>,
    recordNginxFileConfig: boolean,
    logOut: string,
}

export default Interface;