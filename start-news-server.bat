@echo off
echo ===================================
echo  HUSIAN NEWS ARTICLE SERVER
echo ===================================
echo.
echo Starting the news article web server...
echo.
echo When the server is running, open this address in your web browser:
echo.
echo http://localhost:3000/news-uploader.html
echo.
echo To stop the server, close this window.
echo.
echo ===================================
echo.

:: Navigate to the website root directory (where this batch file is located)
cd /d %~dp0

:: Start the Node.js server
node news-server.js

:: This line is only reached if the server stops
echo.
echo Server stopped.
echo.
pause 