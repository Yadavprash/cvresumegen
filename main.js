const compileLaTeX = require('./latexCompiler');

// Specify the path to your .tex file
const texFilePath = './assets/templates/Resume1.tex';
const path2 = './resume.tex'
const outputDirectory = './out';

// Call the module function
compileLaTeX(texFilePath, outputDirectory, (error, result) => {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
    }
});
