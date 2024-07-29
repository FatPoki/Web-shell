document.addEventListener('DOMContentLoaded', () => {
  const commandInput = document.getElementById('command-input');
  const executeButton = document.getElementById('execute-button');
  const outputElement = document.getElementById('output');
  const editorContainer = document.getElementById('editor-container');
  const saveButton = document.getElementById('save-button');
  const editorElement = document.getElementById('editor');
  const currentFileInput = document.getElementById('current-file');

  let editor;
  let data = [
    '           Help           \n',
    "1. Wait until you get an output before entering another command.\n",
    "2. Use 'edit filename' to edit a file.\n",
    "3. Create a file in the current directory before trying to edit it.\n",
    "4. Type 'help' to see this help menu."
  ];

  function loadFile(filename) {
    fetch(`/load?file=${filename}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          outputElement.textContent = `Error: ${data.error}`;
        } else {
          if (!editor) {
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.session.setMode("ace/mode/sh");
          }
          editor.setValue(data.content, -1); // -1 to move cursor to the start
          editorContainer.style.display = 'block';
          currentFileInput.value = filename;
        }
      })
      .catch(error => {
        outputElement.textContent = `Error: ${error.message}`;
      });
  }

  function saveFile() {
    const filename = currentFileInput.value;
    const content = editor.getValue();

    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, content }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          outputElement.textContent = `Error: ${data.error}`;
        } else {
          outputElement.textContent = `File ${filename} saved successfully.`;
        }
      })
      .catch(error => {
        outputElement.textContent = `Error: ${error.message}`;
      });
  }

  function doit() {

    const x1 = commandInput.value;

    if (x1 === 'clear') {
      outputElement.innerText = '';
      return;
    }


    const command = commandInput.value;

    if (command === 'help') {
      outputElement.innerText = data.join('\n');
      return;
    }

    if (command.startsWith("edit ")) {
      const filename = command.slice(5).trim();
      loadFile(filename);
      return;
    }

    editorContainer.style.display = 'none'; // Hide editor if not editing

    fetch('/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          outputElement.textContent = `Error: Command Not Found`;
        } else {
          outputElement.textContent = `Output: ${data.output}`;
        }
      })
      .catch(error => {
        outputElement.textContent = `Error: ${error.message}`;
      });
  }

  executeButton.addEventListener('click', doit);

  commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      doit();
    }
  });

  saveButton.addEventListener('click', saveFile);
});
