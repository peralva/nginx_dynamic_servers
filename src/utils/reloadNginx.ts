import { execFile } from 'child_process';
import path from 'path';
import Reference from '../interfaces/Reference';

export default (referente: Reference): void => {
    if (referente.config.nginx_file.bin) {
        execFile(
            referente.config.nginx_file.bin,
            [ '-s', 'reload' ],
            { cwd: path.dirname(referente.config.nginx_file.bin) },
        );
    }
};