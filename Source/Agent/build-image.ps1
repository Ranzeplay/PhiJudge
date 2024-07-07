# Save the current directory
$originalDir = Get-Location

# Change directory to where the script file is located
Set-Location -Path $PSScriptRoot

# Test if Docker is installed
if (Get-Command -Name docker -ErrorAction SilentlyContinue) {
	# Docker is installed, continue with the build
	docker build -f Executor/Dockerfile -t phijudge-agent .
} else {
	Write-Host "Docker is not installed. Please install Docker before running this script."
}

# Switch back to the original directory
Set-Location -Path $originalDir