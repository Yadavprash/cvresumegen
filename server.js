const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const {exec} = require('child_process');

const app = express();
const port = 3001;

app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, 'main.png');
    },
}); // Store files in memory
const upload = multer({storage: storage});

app.get('/templates', (req, res) => {
    const templatesDirectory = path.join(__dirname, 'assets/templates');

    fs.readdir(templatesDirectory, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const templates = files.map((file) => ({
            name: file.replace('.tex', ''),
            content: fs.readFileSync(path.join(templatesDirectory, file), 'utf-8'),
        }));

        res.json(templates);
    });
});
app.get('/templates/:templateName', (req, res) => {
    const templateName = req.params.templateName;
    const templatePath = path.join(__dirname, 'assets/templates', `${templateName}`)
    try {
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        res.send(templateContent);
    } catch (error) {
        console.error('Error reading template:', error);
        res.status(404).send('Template not found');
    }
});
// Endpoint for compiling LaTeX code
app.post('/compile', upload.single('image'), async (req, res) => {
    try {
        const latexCode = req.body.latexCode;
        const imageData = req.file;
        if(imageData){
            console.log(imageData);
        }
        // console.log(latexCode);
        if (!latexCode) {
            throw new Error('No LaTeX code provided');
        }
        // console.log(latexCode);
        //Save the uploaded image to the 'uploads' directory
        if(imageData){
            const imagePath = req.file.path; // This will contain the path to the saved image
            console.log('Image saved at:', imagePath);
        }
        const tempAuxPath = 'uploads/temp.aux';
        const tempLogPath = 'uploads/temp.log';
        const tempOutPath = 'uploads/temp.out';

        // //clear Temp Files
        // if(fs.existsSync(tempAuxPath)){
        //     fs.unlinkSync(tempAuxPath);
        // }
        // if(fs.existsSync(tempLogPath)){
        //     fs.unlinkSync(tempLogPath);
        // }
        // if(fs.existsSync(tempOutPath)){
        //     fs.unlinkSync(tempOutPath);
        // }

        // Save the LaTeX code to a temporary file (you may need to improve this for security)
        const fileName = 'uploads/temp.tex';
        fs.writeFileSync(fileName, latexCode, 'utf-8');
        const outputDirectory = './uploads';
        // Use pdflatex to compile the LaTeX code
        exec(`pdflatex -output-directory=${outputDirectory} ${fileName}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error compiling LaTeX code:', error);
                res.status(500).send('Compilation failed');
            } else {
                // Read the compiled PDF file
                const pdfFileName = fileName.replace('.tex', '.pdf');
                const pdfContent = fs.readFileSync(pdfFileName);
                // Send the compiled PDF content as the response
                res.send(pdfContent);

                // Remove temporary files
                fs.unlinkSync(fileName);
                fs.unlinkSync(pdfFileName);

            }
        });
    } catch (error) {
        console.error('Error during compilation:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
