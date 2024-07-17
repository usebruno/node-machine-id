const {exec, execSync} = require('child_process');
const {createHash} = require('crypto');

let {platform} = process,
    win32RegBinPath = {
        native: '%windir%\\System32',
        mixed: '%windir%\\sysnative\\cmd.exe /c %windir%\\System32'
    },
    guid = {
        darwin: 'ioreg -rd1 -c IOPlatformExpertDevice',
        win32: `${win32RegBinPath[isWindowsProcessMixedOrNativeArchitecture()]}\\REG.exe ` +
            'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
            '/v MachineGuid',
        linux: '( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :',
        freebsd: 'kenv -q smbios.system.uuid || sysctl -n kern.hostuuid'
    };

function isWindowsProcessMixedOrNativeArchitecture() {
    // detect if the node binary is the same arch as the Windows OS.
    // or if this is 32 bit node on 64 bit windows.
    if(process.platform !== 'win32') {
        return '';
    }
    if( process.arch === 'ia32' && process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432') ) {
        return 'mixed';
    }
    return 'native';
}

function hash(guid) {
    return createHash('sha256').update(guid).digest('hex');
}

function expose(result) {
    switch (platform) {
        case 'darwin':
            return result
                .split('IOPlatformUUID')[1]
                .split('\n')[0].replace(/\=|\s+|\"/ig, '')
                .toLowerCase();
        case 'win32':
            return result
                .toString()
                .split('REG_SZ')[1]
                .replace(/\r+|\n+|\s+/ig, '')
                .toLowerCase();
        case 'linux':
            return result
                .toString()
                .replace(/\r+|\n+|\s+/ig, '')
                .toLowerCase();
        case 'freebsd':
            return result
                .toString()
                .replace(/\r+|\n+|\s+/ig, '')
                .toLowerCase();
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

function machineIdSync(original) {
    let id = expose(execSync(guid[platform]).toString());
    return original ? id : hash(id);
}

function machineId(original) {
    return new Promise((resolve, reject) => {
        return exec(guid[platform], {}, (err, stdout, stderr) => {
            if (err) {
                return reject(
                    new Error(`Error while obtaining machine id: ${err.stack}`)
                );
            }
            let id = expose(stdout.toString());
            return resolve(original ? id : hash(id));
        });
    });
}

module.exports = {
  machineId,
  machineIdSync
};
