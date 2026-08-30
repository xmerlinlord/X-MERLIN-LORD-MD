import sharp from "sharp";
import fs from "fs";
import path from "path";

(async () => {
  try {
    const inputPath = path.join(process.cwd(), "assets", "profile_original.jpg");
    if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      console.error("Place your original image at assets/profile_original.jpg and run again.");
      process.exit(1);
    }

    // Ensure output directory exists
    const outDir = path.join(process.cwd(), "assets", "generated");
    fs.mkdirSync(outDir, { recursive: true });

    // WhatsApp avatar: 640x640, circular PNG with transparency
    await sharp(inputPath)
      .resize(640, 640, { fit: "cover", position: "centre" })
      .composite([{
        input: Buffer.from(
          `<svg width="640" height="640"><circle cx="320" cy="320" r="320" fill="#fff"/></svg>`
        ),
        blend: "dest-in"
      }])
      .png()
      .toFile(path.join(outDir, "whatsapp_avatar.png"));

    // WhatsApp JPEG fallback (flattened on white)
    await sharp(inputPath)
      .resize(640, 640, { fit: "cover" })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 85 })
      .toFile(path.join(outDir, "whatsapp_avatar.jpg"));

    // GitHub social preview: 1280x640
    await sharp(inputPath)
      .resize(1280, 640, { fit: "cover", position: "centre" })
      .jpeg({ quality: 88 })
      .toFile(path.join(outDir, "github_social.jpg"));

    console.log("Generated files in assets/generated:");
    console.log(" - whatsapp_avatar.png (640x640 circular PNG)");
    console.log(" - whatsapp_avatar.jpg (640x640 JPEG fallback)");
    console.log(" - github_social.jpg (1280x640 JPEG)");
  } catch (err) {
    console.error("Error generating avatars:", err);
    process.exit(1);
  }
})();
