
# PowerShell script to install and list the npm packages for this app.
#
# Chris Joakim, 2025

New-Item -ItemType Directory -Force -Path .\tmp | out-null

del package-lock.json

npm install

npm list
