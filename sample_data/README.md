# Sample Data Guidelines — DEEPFAKE X

This directory contains reference metadata and placeholders for testing multimodal synthetic media forensic pipelines.

## Modalities Covered
- **Images (`/images`)**: JPEG, PNG, WEBP test files (authentic camera captures, diffusion-generated images, GAN-generated faces).
- **Audio (`/audio`)**: WAV, MP3, FLAC test files (pristine microphone audio, TTS vocoder clones, voice conversion samples).
- **Video (`/video`)**: MP4, MOV, MKV clips (talking head deepfakes, face-swap samples, lip-sync manipulations).
- **Documents (`/documents`)**: PDF documents (scanned originals, digital generative PDFs, edited font stream anomalies).

## Data Hygiene & Repository Safety Policy
1. **Never commit actual copyrighted, proprietary, or personally identifiable media (PII)** to this repository.
2. **Never commit large media files (> 5MB)** directly into Git history. Store benchmark datasets in an external LFS/S3 bucket or download on demand via automated test fixtures.
3. Test files in this repository must be synthetic or public-domain reference samples used strictly for unit and integration testing of forensic parsing modules.
4. All media files uploaded to the local test server should be cleared from `temp/` after pipeline testing completes.
