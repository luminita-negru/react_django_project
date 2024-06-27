@echo off
setlocal ENABLEDELAYEDEXPANSION

rem Start Django server
start "Django Server" /B python manage.py runserver
for /f "tokens=2 delims==; " %%i in ('wmic process where "caption='python.exe' and commandline like '%%manage.py runserver%%'" get processid /value') do set django_pid=%%i

rem Start Celery worker
start "Celery Worker" /B celery -A ReactDjango worker --loglevel=info --pool=solo
for /f "tokens=2 delims==; " %%i in ('wmic process where "caption='python.exe' and commandline like '%%celery%%worker%%'" get processid /value') do set worker_pid=%%i

rem Start Celery beat
start "Celery Beat" /B celery -A ReactDjango beat --loglevel=info
for /f "tokens=2 delims==; " %%i in ('wmic process where "caption='python.exe' and commandline like '%%celery%%beat%%'" get processid /value') do set beat_pid=%%i

echo Press any key.
pause

rem Kill all started processes
echo Terminating processes...
taskkill /F /PID %django_pid%
taskkill /F /PID %worker_pid%
taskkill /F /PID %beat_pid%

endlocal
