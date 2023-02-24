import Config from '../interfaces/Config';

const CONFIG_PATH: string = require.resolve('../../config');

export default (): Config => {
    delete require.cache[CONFIG_PATH];
    return require(CONFIG_PATH);
};