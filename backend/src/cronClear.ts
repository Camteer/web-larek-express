import { CronJob } from "cron";
import fs from "fs";
import path from "path";
const tempDir = path.join(__dirname, "../src/public/temp");
export const job = new CronJob(
  "0 0 * * * *", // cronTime
  function job() {
    fs.readdir(tempDir, (err, files) => {
      if (err) return console.error(err);

      files.forEach((file) => {
        const filePath = path.join(tempDir, file);
        const { birthtimeMs } = fs.statSync(filePath);
        const now = Date.now();

        if (now - birthtimeMs > 60 * 60 * 1000) {
          fs.unlinkSync(filePath);
        }
      });
    });
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);
