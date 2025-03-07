@echo off
echo ===================================
echo  SETUP RIGHT-CLICK PROCESSING
echo ===================================
echo.
echo This script will add an option to right-click menu for .txt files
echo to process them as Husian news articles.
echo.
echo You need administrator privileges to run this script.
echo.
pause

:: Get the current directory
set CURRENT_DIR=%~dp0
set PROCESS_BAT=%CURRENT_DIR%process-article.bat

:: Add right-click menu for .txt files
echo Creating registry entries...
echo.

:: Create a temporary registry file
echo Windows Registry Editor Version 5.00 > temp_reg.reg
echo. >> temp_reg.reg
echo [HKEY_CLASSES_ROOT\txtfile\shell\ProcessHusianArticle] >> temp_reg.reg
echo @="Process as Husian News Article" >> temp_reg.reg
echo "Icon"="\"%PROCESS_BAT%\",0" >> temp_reg.reg
echo. >> temp_reg.reg
echo [HKEY_CLASSES_ROOT\txtfile\shell\ProcessHusianArticle\command] >> temp_reg.reg
echo @="\"%PROCESS_BAT%\" \"%%1\"" >> temp_reg.reg

:: Import the registry file
regedit /s temp_reg.reg

:: Delete the temporary registry file
del temp_reg.reg

echo.
echo Setup complete!
echo.
echo Now you can right-click on any .txt file and select 
echo "Process as Husian News Article" to process it.
echo.
pause 