# Cleanup product images
#
# This will convert images from JPG to PNG and replace the white
# background with transparent one.
#
# This is almost verbatim copy of the script from:
# http://tech.natemurray.com/2007/12/convert-white-to-transparent.html

$SRC_FOLDER = "data_extractor/orig"
$SRC_EXT = "jpg"
$DST_FOLDER = "data_extractor/result"
$DST_EXT = "png"

# This is where all the conversion happens
function Remove-Background {
    param (
        [string]$SRC,
        [string]$DST
    )

    # Fuzzy percentage level for white color
    $FUZZ = 25

    # Start real
    .\data_extractor\magick\magick.exe convert "$SRC" -alpha off -channel alpha -evaluate set 0 +channel difference.png
    # Remove the black, replace with transparency
    .\data_extractor\magick\magick.exe convert difference.png -bordercolor white -border 1x1 -fuzz $FUZZ% -fill none -draw "alpha 1,1 floodfill" -shave 1x1 removed_black.png
    # Create the matte
    .\data_extractor\magick\magick.exe convert removed_black.png -channel matte -separate +matte matte.png

    .\data_extractor\magick\magick.exe composite -compose CopyOpacity matte.png "$SRC" "$DST"

    # Cleanup
    Remove-Item difference.png, removed_black.png, matte.png
}

# Make sure the destination folder exists
if (-not (Test-Path $DST_FOLDER)) {
    New-Item -ItemType Directory -Force -Path $DST_FOLDER
}

Get-ChildItem -Path $SRC_FOLDER -Filter "*.$SRC_EXT" | ForEach-Object {
    Write-Host "Converting $($_.Name)"
    $NEWFILE = Join-Path $DST_FOLDER -ChildPath $($_.BaseName + ".$DST_EXT")
    Remove-Background $_.FullName $NEWFILE
}
