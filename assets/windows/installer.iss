; ------------------------------------------
; Installer for Ovobot Configurator
; ------------------------------------------
; It receives from the command line with /D the parameters: 
; version
; archName
; archAllowed
; archInstallIn64bit
; sourceFolder
; targetFolder

#define ApplicationName "Ovobot Configurator"
#define CompanyName "The Ovobot open source project"
#define CompanyUrl "https://Ovobot.com/"
#define ExecutableFileName "Ovobot-configurator.exe"
#define GroupName "Ovobot"
#define InstallerFileName "Ovobot-configurator_" + version + "_" + archName + "-installer"
#define SourcePath "..\..\" + sourceFolder + "\Ovobot-configurator\" + archName
#define TargetFolderName "Ovobot-Configurator"
#define UpdatesUrl "https://github.com/Ovobot/Ovobot-configurator/releases"

[CustomMessages]
AppName=Ovobot-configurator
LaunchProgram=Start {#ApplicationName}

[Files]
Source: "{#SourcePath}\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
; Programs group
Name: "{group}\{#ApplicationName}"; Filename: "{app}\{#ExecutableFileName}";
; Desktop icon
Name: "{autodesktop}\{#ApplicationName}"; Filename: "{app}\{#ExecutableFileName}"; 
; Non admin users, uninstall icon
Name: "{group}\Uninstall {#ApplicationName}"; Filename: "{uninstallexe}"; Check: not IsAdminInstallMode

[Languages]
; English default, it must be first
Name: "en"; MessagesFile: "compiler:Default.isl"
; Official languages
Name: "zh_CN"; MessagesFile: "unofficial_inno_languages\ChineseSimplified.isl"
; Not available
; pt_BR (Portuguese Brasileiro)

[Run]
; Add a checkbox to start the app after installed
Filename: {app}\{cm:AppName}.exe; Description: {cm:LaunchProgram,{cm:AppName}}; Flags: nowait postinstall skipifsilent

[Setup]
AppId=5F5BA9A9-D006-1382-77CE-EDB293520B46
AppName={#ApplicationName}
AppPublisher={#CompanyName}
AppPublisherURL={#CompanyUrl}
AppUpdatesURL={#UpdatesUrl}
AppVersion={#version}
ArchitecturesAllowed={#archAllowed}
ArchitecturesInstallIn64BitMode={#archInstallIn64bit}
Compression=lzma2
DefaultDirName={autopf}\{#GroupName}\{#TargetFolderName}
DefaultGroupName={#GroupName}\{#ApplicationName}
LicenseFile=..\..\LICENSE
MinVersion=6.2
OutputBaseFilename={#InstallerFileName}
OutputDir=..\..\{#targetFolder}\
PrivilegesRequiredOverridesAllowed=commandline dialog
SetupIconFile=bf_installer_icon.ico
ShowLanguageDialog=yes
SolidCompression=yes
UninstallDisplayIcon={app}\{#ExecutableFileName}
UninstallDisplayName={#ApplicationName}
WizardImageFile=bf_installer.bmp
WizardSmallImageFile=bf_installer_small.bmp
WizardStyle=modern

[Code]
function GetOldNsisUninstallerPath(): String;
var
    RegKey: String;
begin
    Result := '';
    // Look into the different registry entries: win32, win64 and without user rights
    if not RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Ovobot Configurator', 'UninstallString', Result) then
    begin
        if not RegQueryStringValue(HKLM, 'SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Ovobot Configurator', 'UninstallString', Result) then
        begin
            RegQueryStringValue(HKCU, 'SOFTWARE\Ovobot\Ovobot Configurator', 'UninstallString', Result)
        end;
    end;
end;

function GetQuietUninstallerPath(): String;
var
    RegKey: String;
begin
    Result := '';
    RegKey := Format('%s\%s_is1', ['Software\Microsoft\Windows\CurrentVersion\Uninstall', '{#emit SetupSetting("AppId")}']);
    if not RegQueryStringValue(HKEY_LOCAL_MACHINE, RegKey, 'QuietUninstallString', Result) then
    begin
        RegQueryStringValue(HKEY_CURRENT_USER, RegKey, 'QuietUninstallString', Result);
    end;
end;

function InitializeSetup(): Boolean;
var
    ResultCode: Integer;
    ParameterStr : String;
    UninstPath : String;
begin
    
    Result := True;

    // Check if the application is already installed by the old NSIS installer, and uninstall it
    UninstPath := GetOldNsisUninstallerPath();

    // Found, start uninstall
    if UninstPath <> '' then 
    begin
        
        UninstPath := RemoveQuotes(UninstPath);

        // Add this parameter to not return until uninstall finished. The drawback is that the uninstaller file is not deleted
        ParameterStr := '_?=' + ExtractFilePath(UninstPath);

        if Exec(UninstPath, ParameterStr, '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then
        begin
          // Delete the unistaller file and empty folders. Not deleting the files.
          DeleteFile(UninstPath);
          DelTree(ExtractFilePath(UninstPath), True, False, True);
        end
        else begin
            Result := False;
            MsgBox('Error uninstalling old Configurator ' + SysErrorMessage(ResultCode) + '.', mbError, MB_OK);
        end;        
    end
    else begin

        // Search for new Inno Setup installations
        UninstPath := GetQuietUninstallerPath();
        if UninstPath <> '' then
        begin
            if not Exec('>', UninstPath, '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then
            begin
                Result := False;
                MsgBox('Error uninstalling Configurator ' + SysErrorMessage(ResultCode) + '.', mbError, MB_OK);
            end;
        end;
    end;
end;