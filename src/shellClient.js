const util = require('util');
const exec = util.promisify(require('child_process').exec);

const execCommand = async (command) => {
    try {
        const req = await exec(command);
        return req.stdout.trim();
    } catch (err) {
        console.error(err);
        return '';
    }
}

const getMetadataValue = async (player, meta) => {
    const metaValue = await execCommand(`${process.env.PLAYERCTL} -p ${player} metadata -f "{{${meta}}}"`)
    return metaValue;
}

module.exports = {
    execCommand,
    getMetadataValue
}