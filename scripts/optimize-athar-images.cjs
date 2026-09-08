// Deterministic format/size optimization only; source artwork is image-generated.
const sharp = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/sharp');
const path = require('node:path');
const fs = require('node:fs');
const output = path.resolve(__dirname, '../src/assets/images/athar');
fs.mkdirSync(output, {recursive: true});
const inputs = process.argv.slice(2);
if (inputs.length !== 3) throw new Error('Pass hero, atlas and gift source paths');
Promise.all([
    sharp(inputs[0]).resize({width:1440}).webp({quality:76}).toFile(path.join(output,'hero.webp')),
    sharp(inputs[1]).resize({width:1800}).webp({quality:82,alphaQuality:100}).toFile(path.join(output,'bottles.webp')),
    sharp(inputs[2]).resize({width:1200}).webp({quality:75}).toFile(path.join(output,'gift.webp')),
]).then(results => results.forEach((r,i) => console.log(['hero','bottles','gift'][i], r.size)));
