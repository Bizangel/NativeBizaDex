import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, statSync } from "fs"

function humanReadableSize(size: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}

var isWin = process.platform === "win32";
if (isWin) {
  execSync(".\\gradlew.bat assembleRelease", { cwd: "./android", stdio: 'inherit' })
} else {
  execSync("./gradlew assembleRelease", { cwd: "./android", stdio: 'inherit' })
}

if (!existsSync('./out')) {
  mkdirSync("./out")
}

copyFileSync("./android/app/build/outputs/apk/release/app-release.apk", "out/release.apk")
const size = statSync("out/release.apk").size;

console.log(`[32m Resulting APK size: ${humanReadableSize(size)} [0m`);