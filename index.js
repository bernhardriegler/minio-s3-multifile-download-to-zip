const Minio = require('minio')
const fs = require('fs')
const join = require('path').join
const archiver = require('archiver');

// Instantiate the minio client with the endpoint
// and access keys as shown below.
const minioClient = new Minio.Client({
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
    signatureVersion: 'v4',
    s3ForcePathStyle: 'true',
});

const fileNames = [
    '0.png',
    '1.png',
    '2.png',
]

// https://docs.min.io/docs/javascript-client-api-reference.html#getObject
async function downloadFileStream(filename) {
    return minioClient.getObject('swa', filename)
}

async function run() {
    const output = fs.createWriteStream(join(__dirname, 'archive.zip'));
    const archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    for (const fileName of fileNames) {
        const contents = await downloadFileStream(fileName);
        archive.append(contents, { name: fileName });
    }

    archive.finalize();

}

run();
