
# PowerShell script to compile and unit-test this app.
#
# Chris Joakim, 2025

del tmp\*.*

npm run build

npm run test
