@echo off
REM Change to the directory containing your server
cd C:\Users\xvnek6\Desktop\react-projects\vm-manager\vm-manager-server
REM Start the server
start cmd /k "npm run dev"

REM Change to the directory containing your client
cd C:\Users\xvnek6\Desktop\react-projects\vm-manager\vm-manager-client
REM Start the client
start cmd /k "npm start"