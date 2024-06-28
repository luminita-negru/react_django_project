@echo off
setlocal

REM Start MongoDB instances without opening new terminals
start /B mongod --replSet m101 --logpath "logs\1.log" --dbpath C:\MongoData\rs1 --port 27020 --oplogSize 64
for /f "tokens=2 delims==; " %%i in ('wmic process where "caption='mongod.exe' and commandline like '%%port 27020%%'" get processid /value') do set mongo1_pid=%%i

start /B mongod --replSet m101 --logpath "logs\2.log" --dbpath C:\MongoData\rs2 --port 27018 --oplogSize 64
for /f "tokens=2 delims==; " %%i in ('wmic process where "caption='mongod.exe' and commandline like '%%port 27018%%'" get processid /value') do set mongo2_pid=%%i

start /B mongod --replSet m101 --logpath "logs\3.log" --dbpath C:\MongoData\rs3 --port 27019 --oplogSize 64
for /f "tokens=2 delims==; " %%i in ('wmic process where "caption='mongod.exe' and commandline like '%%port 27019%%'" get processid /value') do set mongo3_pid=%%i

echo All MongoDB instances have been started.
echo Press any key to stop all MongoDB instances.
pause >nul

REM Kill all started MongoDB processes
echo Terminating MongoDB processes...
taskkill /F /PID %mongo1_pid%
taskkill /F /PID %mongo2_pid%
taskkill /F /PID %mongo3_pid%

endlocal

echo All MongoDB processes have been terminated.
pause
