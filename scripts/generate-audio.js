#!/usr/bin/env node
/**
 * Aubrey's Magic School — ElevenLabs audio generator
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key ELEVENLABS_VOICE_ID=your_voice_id node scripts/generate-audio.js
 *
 * Or create a .env file (never commit it — it's in .gitignore):
 *   ELEVENLABS_API_KEY=your_key
 *   ELEVENLABS_VOICE_ID=your_voice_id
 *
 * Then run:
 *   node scripts/generate-audio.js
 *
 * Files are saved to audio/{key}.mp3
 * Already-generated files are skipped (safe to re-run after adding phrases).
 *
 * Finding your voice ID:
 *   Go to elevenlabs.io → Voices → click your voice → copy the Voice ID from the URL
 *   or from the voice settings panel.
 *
 * Recommended settings: model eleven_turbo_v2_5 for speed, or eleven_multilingual_v2
 * for highest quality. Stability 0.5, Similarity 0.75 work well for a friendly
 * children's voice.
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

// Load .env if present
try {
    const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    env.split('\n').forEach(line => {
        const [k, ...v] = line.split('=');
        if (k && v.length) process.env[k.trim()] = v.join('=').trim();
    });
} catch (_) { /* no .env file — use environment variables directly */ }

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5';

if (!API_KEY || !VOICE_ID) {
    console.error('❌  Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID');
    console.error('   Set them as environment variables or create scripts/.env');
    process.exit(1);
}

const { PHRASES } = require('./phrases.js');
const OUTPUT_DIR  = path.join(__dirname, '..', 'audio');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const VOICE_SETTINGS = {
    stability:          0.50,
    similarity_boost:   0.75,
    style:              0.30,
    use_speaker_boost:  true,
};

function generateOne(text, outPath) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            text,
            model_id: MODEL_ID,
            voice_settings: VOICE_SETTINGS,
        });

        const options = {
            hostname: 'api.elevenlabs.io',
            path:     `/v1/text-to-speech/${VOICE_ID}`,
            method:   'POST',
            headers: {
                'xi-api-key':    API_KEY,
                'Content-Type':  'application/json',
                'Accept':        'audio/mpeg',
                'Content-Length': Buffer.byteLength(body),
            },
        };

        const req = https.request(options, res => {
            if (res.statusCode !== 200) {
                let err = '';
                res.on('data', d => { err += d; });
                res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)));
                return;
            }
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', () => {
                fs.writeFileSync(outPath, Buffer.concat(chunks));
                resolve();
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function main() {
    const keys     = Object.keys(PHRASES);
    const total    = keys.length;
    let skipped    = 0;
    let generated  = 0;
    let failed     = 0;

    console.log(`\n🎙  Generating ${total} audio files with voice ${VOICE_ID}\n`);

    for (let i = 0; i < keys.length; i++) {
        const key     = keys[i];
        const text    = PHRASES[key];
        const outPath = path.join(OUTPUT_DIR, `${key}.mp3`);

        if (fs.existsSync(outPath)) {
            skipped++;
            process.stdout.write(`\r⏭  ${i + 1}/${total}  (${generated} new, ${skipped} skipped, ${failed} failed)`);
            continue;
        }

        try {
            await generateOne(text, outPath);
            generated++;
            process.stdout.write(`\r✅  ${i + 1}/${total}  (${generated} new, ${skipped} skipped, ${failed} failed)  — ${key}`);

            // Polite rate limiting: ~2 requests/sec to stay well under API limits
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            failed++;
            console.error(`\n❌  ${key}: ${err.message}`);
        }
    }

    console.log(`\n\n✨  Done! ${generated} generated, ${skipped} skipped, ${failed} failed.`);
    if (generated > 0) {
        console.log(`\n📁  Files saved to audio/`);
        console.log(`\n👉  Next steps:`);
        console.log(`    git add audio/`);
        console.log(`    git commit -m "Add ElevenLabs audio files"`);
        console.log(`    git push`);
    }
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
