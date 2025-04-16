@echo off

REM === Configuration ===
SET MONGO_BIN="C:\Program Files\MongoDB\Server\8.0\bin"
SET MONGO_DATA="mongodb\data"
SET MONGO_LOG="mongodb\log\mongodb.log"
SET MONGO_PORT=45890

REM === Création des dossiers si inexistants ===
IF NOT EXIST %MONGO_DATA% (
    mkdir %MONGO_DATA%
)

IF NOT EXIST %MONGO_LOG% (
    mkdir %MONGO_LOG%
)

REM === Lancer MongoDB ===
echo Démarrage de MongoDB...
%MONGO_BIN%\mongod.exe --dbpath %MONGO_DATA% --port %MONGO_PORT% --bind_ip 127.0.0.1 --logappend

pause
