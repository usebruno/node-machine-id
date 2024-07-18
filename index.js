import { exec, execSync } from "child_process";
import { createHash } from "crypto";
import * as reg from "native-reg";

let { platform } = process;

let guid = {
  darwin: "ioreg -rd1 -c IOPlatformExpertDevice",
  linux:
    "( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :",
  freebsd: "kenv -q smbios.system.uuid || sysctl -n kern.hostuuid",
};

function hash(guid) {
  return createHash("sha256").update(guid).digest("hex");
}

function expose(result) {
  switch (platform) {
    case "darwin":
      return result
        .split("IOPlatformUUID")[1]
        .split("\n")[0]
        .replace(/\=|\s+|\"/gi, "")
        .toLowerCase();
    case "linux":
      return result
        .toString()
        .replace(/\r+|\n+|\s+/gi, "")
        .toLowerCase();
    case "freebsd":
      return result
        .toString()
        .replace(/\r+|\n+|\s+/gi, "")
        .toLowerCase();
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

function getWindowsMachineId() {
  return reg
    .getValue(
      reg.HKEY.LOCAL_MACHINE,
      "SOFTWARE\\Microsoft\\Cryptography",
      "MachineGuid"
    )
    .toString();
}

export function machineIdSync(original) {
  let id;
  if (platform === "win32") {
    id = getWindowsMachineId();
  } else {
    id = expose(execSync(guid[platform]).toString());
  }
  return original ? id : hash(id);
}

export function machineId(original) {
  return new Promise((resolve, reject) => {
    return exec(guid[platform], {}, (err, stdout, stderr) => {
      if (platform === "win32") {
        try {
          return resolve(getWindowsMachineId());
        } catch (error) {
          return reject(error);
        }
      }
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
