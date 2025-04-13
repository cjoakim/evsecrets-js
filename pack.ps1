
# PowerShell script to compile, test, and pack this npm package.
#
# Chris Joakim, 2025

del .\*.tgz

npm run build

npm run test

del dist\*test*

npm pack
