const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(projectRoot, 'docs');
const equipmentRoot = path.join(docsRoot, 'images', 'equipment');
const mapPath = path.join(docsRoot, 'images', 'ui', 'Map.png');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const concurrency = 4;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function walkFiles(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
    });
}

function readPngDimensions(filePath) {
    const contents = fs.readFileSync(filePath);
    if (contents.length < 24 || !contents.subarray(0, pngSignature.length).equals(pngSignature)) {
        throw new Error(`Not a genuine PNG: ${path.relative(projectRoot, filePath)}`);
    }
    return {
        width: contents.readUInt32BE(16),
        height: contents.readUInt32BE(20),
        bytes: contents.length
    };
}

function hasWebpSignature(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const contents = fs.readFileSync(filePath);
    return contents.length >= 12 &&
        contents.subarray(0, 4).toString('ascii') === 'RIFF' &&
        contents.subarray(8, 12).toString('ascii') === 'WEBP';
}

function getBoundedDimensions(width, height, maxWidth, maxHeight) {
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    const scaledWidth = Math.max(2, Math.round((width * scale) / 2) * 2);
    const scaledHeight = Math.max(2, Math.round((height * scale) / 2) * 2);
    return { width: scaledWidth, height: scaledHeight };
}

function runFfmpeg(args) {
    return new Promise((resolve, reject) => {
        const process = spawn(ffmpeg, args, { windowsHide: true });
        let stderr = '';
        process.stderr.on('data', chunk => {
            stderr += chunk.toString();
        });
        process.on('error', reject);
        process.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(stderr.trim() || `ffmpeg exited with code ${code}`));
        });
    });
}

async function optimizeTask(task) {
    const source = readPngDimensions(task.source);
    const output = task.source.replace(/\.png$/i, '.webp');
    const temporaryOutput = `${output}.tmp.webp`;
    fs.mkdirSync(path.dirname(output), { recursive: true });

    const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', task.source];
    if (task.lossless) {
        args.push('-c:v', 'libwebp', '-lossless', '1', '-compression_level', '6', '-preset', 'drawing');
    } else {
        const dimensions = getBoundedDimensions(source.width, source.height, 512, 284);
        args.push(
            '-vf', `scale=${dimensions.width}:${dimensions.height}:flags=lanczos`,
            '-c:v', 'libwebp',
            '-preset', 'icon',
            '-quality', '82',
            '-compression_level', '6',
            '-pix_fmt', 'yuva420p'
        );
    }
    args.push('-frames:v', '1', temporaryOutput);

    try {
        await runFfmpeg(args);
        if (!hasWebpSignature(temporaryOutput)) {
            throw new Error(`Invalid WebP output for ${path.relative(projectRoot, task.source)}`);
        }
        if (fs.existsSync(output)) fs.rmSync(output);
        fs.renameSync(temporaryOutput, output);
        fs.rmSync(task.source);
        return { sourceBytes: source.bytes, outputBytes: fs.statSync(output).size };
    } catch (error) {
        if (fs.existsSync(temporaryOutput)) fs.rmSync(temporaryOutput);
        throw error;
    }
}

async function mapWithConcurrency(tasks, callback) {
    const results = new Array(tasks.length);
    let nextIndex = 0;
    let completed = 0;

    async function worker() {
        while (nextIndex < tasks.length) {
            const index = nextIndex++;
            results[index] = await callback(tasks[index]);
            completed += 1;
            if (completed % 50 === 0 || completed === tasks.length) {
                console.log(`Optimized ${completed}/${tasks.length} images...`);
            }
        }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
    return results;
}

async function main() {
    const versionCheck = spawnSync(ffmpeg, ['-version'], { windowsHide: true, encoding: 'utf8' });
    if (versionCheck.error || versionCheck.status !== 0) {
        throw new Error('ffmpeg is required. Install it or set FFMPEG_PATH to its executable.');
    }

    const equipmentPngs = walkFiles(equipmentRoot)
        .filter(file => path.extname(file).toLowerCase() === '.png');
    const tasks = equipmentPngs.map(source => ({ source, lossless: false }));
    if (fs.existsSync(mapPath)) tasks.push({ source: mapPath, lossless: true });

    if (tasks.length === 0) {
        console.log('No PNG assets require optimization.');
        return;
    }

    const results = await mapWithConcurrency(tasks, optimizeTask);
    const sourceBytes = results.reduce((sum, result) => sum + result.sourceBytes, 0);
    const outputBytes = results.reduce((sum, result) => sum + result.outputBytes, 0);
    const reduction = sourceBytes === 0 ? 0 : (1 - outputBytes / sourceBytes) * 100;
    console.log(
        `Replaced ${results.length} PNG assets: ` +
        `${(sourceBytes / 1024 / 1024).toFixed(2)} MB -> ` +
        `${(outputBytes / 1024 / 1024).toFixed(2)} MB (${reduction.toFixed(1)}% smaller).`
    );
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
