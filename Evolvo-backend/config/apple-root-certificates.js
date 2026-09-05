import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certificatesPath = path.join(
  __dirname,
  "apple",
);

const appleRootCertificates = [
  fs.readFileSync(
    path.join(
      certificatesPath,
      "AppleRootCA-G3.cer",
    ),
  ),
  fs.readFileSync(
    path.join(
      certificatesPath,
      "AppleRootCA-G2.cer",
    ),
  ),
];

export default appleRootCertificates;