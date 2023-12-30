const { exec } = require('child_process');

function compileLaTeX(texFilePath, outputDirectory, callback) {
    // Command to run pdflatex with output directory
    const pdflatexCommand = `pdflatex -output-directory=${outputDirectory} ${texFilePath}`;

    // Execute pdflatex command
    exec(pdflatexCommand, (error, stdout, stderr) => {
        if (error) {
            callback(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            callback(`stderr: ${stderr}`);
            return;
        }

        callback(null, `stdout: ${stdout}`);
    });
}

module.exports = compileLaTeX;
