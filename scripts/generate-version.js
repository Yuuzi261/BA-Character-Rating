import fs from 'fs';
import path from 'path';

const version = {
  version: process.env.npm_package_version || '1.0.0',
  buildTime: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || 'local'
};

fs.writeFileSync(
  path.join(process.cwd(), 'public/version.json'),
  JSON.stringify(version, null, 2)
);