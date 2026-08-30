Avatar generation instructions for X-MERLIN-LORD-MD

This document explains how to generate WhatsApp-ready and GitHub social-preview images from your original profile photo.

Files added by this change
- assets/README_DO_UPLOAD_PROFILE_IMAGE.txt — placeholder explaining where to upload your original image.
- scripts/generate_avatars.js — Node script using sharp to produce:
  - assets/generated/whatsapp_avatar.png (640x640 circular PNG with transparency)
  - assets/generated/whatsapp_avatar.jpg (640x640 JPEG fallback)
  - assets/generated/github_social.jpg (1280x640 JPEG)

Prerequisites
- Node.js 14+ (or newer) with npm
- Install dependencies in the repo root:
  npm install sharp

Usage
1. Upload your original image to the repository path: assets/profile_original.jpg
   - You can upload via GitHub web UI: Go to the repository → Add file → Upload files → select the image → Commit to main (or create a branch / PR).
   - Or use git locally: git add assets/profile_original.jpg && git commit -m "Add profile image" && git push

2. Generate the avatars locally
   - From the repo root run:
     node scripts/generate_avatars.js

   - The generated files will be placed in assets/generated/.

3. WhatsApp
   - Use whatsapp_avatar.png (640x640 circular PNG) or whatsapp_avatar.jpg as the profile picture on the phone/account the bot uses.
   - If you want the bot to set the profile programmatically, see Baileys API snippet below and ensure your Baileys version supports updateProfilePicture.

4. GitHub repo social preview
   - Go to your repository → Settings → Social preview → Upload github_social.jpg and Save.

Optional: Programmatic upload with Baileys (example snippet)
- This may vary by Baileys version; test in a safe environment first.

```js
// run inside your bot environment after connecting
import fs from "fs";

const imageBuffer = fs.readFileSync("assets/generated/whatsapp_avatar.jpg");
// Example function name; check your Baileys version for exact API
await sock.updateProfilePicture(sock.user.id, imageBuffer);
```

If you want me to commit the original image as well, you can either upload it in the web UI to assets/profile_original.jpg or paste the base64 contents here and I will commit it for you.
