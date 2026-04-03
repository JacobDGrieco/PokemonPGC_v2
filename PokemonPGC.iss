; PokemonPGC installer

[Setup]
AppName=PokemonPGC
AppVersion=1.0.0
DefaultDirName={pf}\PokemonPGC
DefaultGroupName=PokemonPGC
OutputBaseFilename=PokemonPGC-Setup
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64

[Files]
; Copy everything from your release folder into the install directory
Source: "D:\Projects\Coding\pokemon_pgc\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
; Start Menu shortcut
Name: "{group}\PokemonPGC"; Filename: "{app}\PokemonPGC.bat"; WorkingDir: "{app}"

; Desktop shortcut
Name: "{commondesktop}\PokemonPGC"; Filename: "{app}\PokemonPGC.bat"; WorkingDir: "{app}"

[Run]
; Optionally start the app right after install
Filename: "{app}\PokemonPGC.bat"; Description: "Launch PokemonPGC"; Flags: nowait postinstall skipifsilent
