import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const __dirname = "/home/void/Desktop/x"; // Adjust this to your actual directory
const PORT = 3000;
const OUTPUT_FILE = path.join(__dirname, '.output.txt');
const USER_DIR = path.join(__dirname, 'user_files'); // User-specific directory

// Middleware
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the user_files directory exists
if (!fs.existsSync(USER_DIR)) {
  fs.mkdirSync(USER_DIR);
}

// Sanitize command to prevent unwanted command execution
function sanitizeCommand(command) {
  const allowedCommands = [
    'ls', 'cat', 'echo', 'pwd', 'cd', 'mkdir', 'rmdir', 'rm', 'touch', 'cp', 'mv',
    'grep', 'find', 'chmod', 'chown', 'du', 'df', 'head', 'tail', 'wc', 'whoami',
    'uname', 'date', 'time', 'history', 'clear', 'ps', 'top', 'kill', 'ping',
    'ifconfig', 'netstat', 'uptime', 'free', 'df', 'mount', 'umount', 'nano', 'vi'
  ];

  const parts = command.split(' ');

  if (allowedCommands.includes(parts[0])) {
    return command;
  }
  throw new Error('Command not allowed');
}

// Execute command
app.post('/execute', (req, res) => {
  const { command } = req.body;

  try {
    const sanitizedCommand = sanitizeCommand(command);
    exec(`${sanitizedCommand} > ${OUTPUT_FILE} 2>&1`, { cwd: USER_DIR }, (error) => {
      if (error) {
        return res.json({ error: error.message });
      }

      fs.readFile(OUTPUT_FILE, 'utf8', (err, data) => {
        if (err) {
          return res.json({ error: err.message });
        }

        // Sanitize output to remove references to restricted directories
        const sanitizedOutput = data.replace(new RegExp(__dirname, 'g'), '');

        res.json({ output: sanitizedOutput });

        setTimeout(() => {
          fs.unlink(OUTPUT_FILE, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Failed to delete output file: ${unlinkErr.message}`);
            }
          });
        }, 5000);
      });
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Load file content
app.get('/load', (req, res) => {
  const file = req.query.file;
  const filePath = path.join(USER_DIR, file);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`File not found: ${filePath}`); // Debugging information
      return res.status(500).json({ error: 'File not found' });
    }
    res.json({ content: data });
  });
});

// Save file content
app.post('/save', (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(USER_DIR, filename);

  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save file' });
    }
    res.json({ message: 'File saved successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
