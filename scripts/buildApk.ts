import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync } from "fs"

var isWin = process.platform === "win32";
if (isWin) {
  execSync(".\\gradlew.bat bundleRelease", { cwd: "./android", stdio: 'inherit' })
} else {
  execSync("./gradlew bundleRelease", { cwd: "./android", stdio: 'inherit' })
}

if (!existsSync('./out')) {
  mkdirSync("./out")
}

copyFileSync("./android/app/build/outputs/apk/release/app-release.apk", "out/release.apk")
