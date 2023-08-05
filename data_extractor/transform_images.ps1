
$imageMagickRemoteUrlZip = "https://imagemagick.org/archive/binaries/ImageMagick-7.1.1-15-portable-Q8-x64.zip"
$imageMagickLocalZipTarget = "data_extractor/magick.zip"
$imageMagickFolder = "data_extractor/magick"

if (!(Test-Path $imageMagickLocalZipTarget)) {
    Invoke-WebRequest -Uri $imageMagickRemoteUrlZip -OutFile $imageMagickLocalZipTarget
} else {
    Write-Host "File already exists. Skipping download."
}

if (!(Test-Path $imageMagickFolder)){
  Expand-Archive -Path $imageMagickLocalZipTarget -DestinationPath $imageMagickFolder
} else {
  Write-Host "Image magic already extracted. Skipping unzipping."
}

powershell.exe -ExecutionPolicy Bypass -File data_extractor/images_clean.ps1





