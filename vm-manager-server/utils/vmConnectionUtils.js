const { exec } = require("child_process");

// function to trigger batch command to connect to remote VM
const connectToVm = (vmName, domain, username, password) => {
  // Execute the mstsc command to establish an RDP connection
  const childProcess = exec(
    `cmdkey /generic:${vmName} /user:${domain}\\${username} /pass:${password} && mstsc /v:${vmName} /f /noConsentPrompt && cmdKey /delete:${vmName}`
  );

  // Listen for stdout data from the child process
  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  // Listen for stderr data from the child process
  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Listen for errors in the child process
  childProcess.on("error", (err) => {
    console.error(`Error: ${err}`);
  });

  // Listen for the child process to exit
  childProcess.on("exit", (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
  });
};

module.exports = {
  connectToVm,
};
