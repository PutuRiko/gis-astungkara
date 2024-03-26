@echo off

:: setup

set origin="%CD%"
set sp=%origin%\..
cd %sp%
title=Cmd Prompt for %cd%

::logic

cmd \k

pause