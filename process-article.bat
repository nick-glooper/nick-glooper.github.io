@echo off
echo ===================================
echo  HUSIAN NEWS ARTICLE PROCESSOR
echo ===================================
echo.

:: Check if file path is provided
if "%~1"=="" (
    echo ERROR: No file specified.
    echo.
    echo Please right-click on a text file and select "Open with" then choose this batch file.
    echo Or drag and drop a text file onto this batch file.
    echo.
    pause
    exit /b 1
)

:: Check if the file exists
if not exist "%~1" (
    echo ERROR: File not found: %~1
    echo.
    pause
    exit /b 1
)

:: Check if file is a .txt file
if /i not "%~x1"==".txt" (
    echo ERROR: Only .txt files are supported. Selected file is: %~1
    echo.
    pause
    exit /b 1
)

:: Get the absolute path of the file
set FILE_PATH=%~f1
echo Processing article: %FILE_PATH%
echo.

:: Navigate to the website root directory
cd /d %~dp0

:: Copy the file to News_Articles folder if it's not already there
if not "%~dp1"=="%~dp0News_Articles\" (
    echo Copying file to News_Articles folder...
    copy "%FILE_PATH%" "News_Articles\" > nul
    set FILE_PATH=%~dp0News_Articles\%~nx1
    echo File copied to: %FILE_PATH%
    echo.
)

:: Run the Node.js script to process the article
echo Processing article...
node news-cli.js "%FILE_PATH%"

echo.
echo ===================================
echo.
pause 