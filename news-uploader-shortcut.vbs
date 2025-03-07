' Create a shortcut to the news article server on the desktop
Set objShell = CreateObject("WScript.Shell")
strDesktop = objShell.SpecialFolders("Desktop")

' Path to the batch file (needs to be the absolute path)
strPath = objShell.CurrentDirectory & "\start-news-server.bat"

' Create shortcut object
Set objShortcut = objShell.CreateShortcut(strDesktop & "\Husian News Uploader.lnk")
objShortcut.TargetPath = strPath
objShortcut.Description = "Start the Husian News Article Server and Uploader"
objShortcut.WorkingDirectory = objShell.CurrentDirectory
objShortcut.IconLocation = "shell32.dll,4" ' Document icon from system icons
objShortcut.Save

' Notify user
MsgBox "A shortcut 'Husian News Uploader' has been created on your desktop.", 64, "Shortcut Created" 