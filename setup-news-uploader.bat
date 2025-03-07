@echo off
echo ===================================
echo  HUSIAN NEWS UPLOADER SETUP
echo ===================================
echo.
echo This script will:
echo  1. Create a desktop shortcut for the news article uploader
echo  2. Start the news server
echo  3. Open the web interface in your default browser
echo.
echo Press any key to continue...
pause > nul
echo.

:: Navigate to the website root directory (where this batch file is located)
cd /d %~dp0

:: Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if required files exist
if not exist "news-server.js" (
    echo ERROR: Required file "news-server.js" not found.
    echo Please make sure you are running this script from the website root directory.
    echo.
    pause
    exit /b 1
)

if not exist "news-uploader.html" (
    echo ERROR: Required file "news-uploader.html" not found.
    echo Please make sure you are running this script from the website root directory.
    echo.
    pause
    exit /b 1
)

:: Create desktop shortcut
echo Creating desktop shortcut...
cscript //nologo news-uploader-shortcut.vbs
echo Done.
echo.

:: Create News_Articles directory if it doesn't exist
if not exist "News_Articles" (
    echo Creating News_Articles directory...
    mkdir News_Articles
    echo Done.
    echo.
)

:: Create news directory if it doesn't exist
if not exist "news" (
    echo Creating news directory...
    mkdir news
    echo Done.
    echo.
)

:: Install dependencies if not already installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo Done.
    echo.
)

:: Start the server in a new window
echo Starting news server in a new window...
start "Husian News Server" cmd /c "start-news-server.bat"
echo.

:: Wait a moment for the server to start
echo Waiting for server to start...
timeout /t 3 > nul

:: Open the web interface in the default browser
echo Opening web interface in your browser...
start http://localhost:3000/news-uploader.html
echo.

echo ===================================
echo Setup complete!
echo.
echo If the web interface doesn't open automatically, 
echo please navigate to:
echo http://localhost:3000/news-uploader.html
echo.
echo To close the server, close the command window 
echo titled "Husian News Server"
echo.
echo ===================================
echo.
pause 