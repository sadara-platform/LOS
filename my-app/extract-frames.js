import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { fileURLToPath } from 'url';

// Because we're using "type": "module" in package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the frames directory exists
const framesDir = path.join(__dirname, 'public', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

// Clear out old frames if they exist
const oldFrames = fs.readdirSync(framesDir);
for (const file of oldFrames) {
  fs.unlinkSync(path.join(framesDir, file));
}

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

const inputVideo = path.join(__dirname, 'public', 'video.mp4');

console.log(`Extracting frames at 30 fps to ${framesDir}...`);
console.log('This may take a few minutes depending on the video length.');

ffmpeg(inputVideo)
  .outputOptions([
    '-vf fps=30',           // set framerate to 30 fps
    '-q:v 2',               // High quality JPEG
    '-threads 4'            // Utilize multiple threads
  ])
  .output(path.join(framesDir, 'frame_%04d.jpg'))
  .on('end', () => {
    console.log('Extraction complete! Check the public/frames directory.');
    const frameCount = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).length;
    fs.writeFileSync(path.join(__dirname, 'public', 'frame_data.json'), JSON.stringify({ frameCount }));
    console.log(`Saved frameCount: ${frameCount} to frame_data.json`);
  })
  .on('error', (err) => {
    console.error('Error extracting frames:', err);
  })
  .on('progress', (progress) => {
    if (progress.frames) {
      process.stdout.write(`Extracted frames: ${progress.frames}\r`);
    }
  })
  .run();
