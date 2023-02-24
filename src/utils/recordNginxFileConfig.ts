import { writeFileSync } from 'fs';
import Reference from '../interfaces/Reference';
import Status, { Server } from '../interfaces/Status';
import reloadNginx from './reloadNginx';

export default (reference: Reference): void => {
    if (reference.recordNginxFileConfig) {
        reference.recordNginxFileConfig = false;

        let fileContent = '';
    
        reference.status.forEach((valueStatus: Status) => {
            fileContent += (''
                + `upstream ${valueStatus.upstreamName} {`
                + '\n' + '    least_conn;'
                + '\n'
            );
    
            let allServerAreDown = true;
            let fileContentUpstream = '';
    
            valueStatus.servers.forEach((valueServer: Server) => {
                fileContentUpstream += '\n';
    
                if (valueServer.ok) {
                    fileContentUpstream += `    server ${valueServer.name};`;
                    allServerAreDown = false;
                } else {
                    fileContentUpstream += `    # server ${valueServer.name};`;
                }
            });
    
            if (allServerAreDown) {
                fileContentUpstream = fileContentUpstream.replace(/# /g, '');
            }
    
            fileContent += fileContentUpstream + (''
                + '\n' + '}'
                + '\n'
                + '\n'
            );
        });
    
        writeFileSync(reference.config.nginx_file.conf, fileContent);
        reloadNginx(reference);
    }
};