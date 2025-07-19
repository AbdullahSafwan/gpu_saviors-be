const fs = require('fs');
const path = require('path');
const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipe = promisify(pipeline);
const logsDir = path.join(process.cwd(), 'logs');

async function archiveLogs() {
  try {
    // Create archive directory if it doesn't exist
    const archiveDir = path.join(logsDir, 'archive');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Get all log files
    const files = fs.readdirSync(logsDir).filter(file => file.endsWith('.log'));

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      // Archive files older than 7 days
      if (Date.now() - stats.mtime.getTime() > 7 * 24 * 60 * 60 * 1000) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const gzipFilename = `${file}.${timestamp}.gz`;
        const gzipPath = path.join(archiveDir, gzipFilename);

        const source = fs.createReadStream(filePath);
        const destination = fs.createWriteStream(gzipPath);
        const gzip = createGzip();

        await pipe(source, gzip, destination);
        
        // Clear the original log file
        fs.writeFileSync(filePath, '');
        console.log(`Archived ${file} to ${gzipFilename}`);
      }
    }
  } catch (error) {
    console.error('Error archiving logs:', error);
  }
}

// Clean up old archives (older than 30 days)
function cleanupOldArchives() {
  try {
    const archiveDir = path.join(logsDir, 'archive');
    if (!fs.existsSync(archiveDir)) return;

    const files = fs.readdirSync(archiveDir);
    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(archiveDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > 30 * 24 * 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old archive: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up old archives:', error);
  }
}

// Run the functions
archiveLogs().then(() => {
  cleanupOldArchives();
}); 