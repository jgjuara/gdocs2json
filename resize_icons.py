import os
import sys
import subprocess

# Try to import Pillow (PIL), if it fails, install it
try:
    from PIL import Image
except ImportError:
    print("PIL (Pillow) not found. Installing...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image
        print("PIL installed successfully.")
    except Exception as e:
        print(f"Error installing Pillow: {e}")
        sys.exit(1)

base_path = r"C:\Users\jgjua\.gemini\antigravity\brain\4b1d82de-3fc1-484d-ab0c-2b5bda578762\json_brackets_icon_1783970584153.png"
workspace_dir = r"C:\Users\jgjua\Documents\antigravity\lucid-davinci"

out_32 = os.path.join(workspace_dir, "icon_32.png")
out_128 = os.path.join(workspace_dir, "icon_128.png")
out_220_140 = os.path.join(workspace_dir, "icon_220x140.png")

def main():
    if not os.path.exists(base_path):
        print(f"Error: Base image not found at {base_path}")
        sys.exit(1)
        
    print(f"Loading base image from {base_path}")
    with Image.open(base_path) as img:
        print(f"Base image size: {img.size}, mode: {img.mode}")
        
        # 1. 32x32
        print("Resizing to 32x32...")
        img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
        img_32.save(out_32, "PNG")
        print(f"Saved: {out_32}")
        
        # 2. 128x128
        print("Resizing to 128x128...")
        img_128 = img.resize((128, 128), Image.Resampling.LANCZOS)
        img_128.save(out_128, "PNG")
        print(f"Saved: {out_128}")
        
        # 3. 220x140 (center the square icon inside transparent 220x140 canvas)
        print("Creating 220x140 centered icon...")
        # Resize square icon to 140x140
        img_140 = img.resize((140, 140), Image.Resampling.LANCZOS)
        # Create transparent canvas
        canvas = Image.new("RGBA", (220, 140), (0, 0, 0, 0))
        # Paste centered
        # x offset = (220 - 140) // 2 = 40
        # y offset = (140 - 140) // 2 = 0
        # Check if img_140 has alpha channel, paste with mask if so
        if img_140.mode in ('RGBA', 'LA') or (img_140.mode == 'P' and 'transparency' in img_140.info):
            canvas.paste(img_140, (40, 0), img_140)
        else:
            canvas.paste(img_140, (40, 0))
        canvas.save(out_220_140, "PNG")
        print(f"Saved: {out_220_140}")

    # Verify dimensions
    print("\nVerification:")
    for path in [out_32, out_128, out_220_140]:
        if os.path.exists(path):
            with Image.open(path) as verified_img:
                print(f"File: {os.path.basename(path)} | Size: {verified_img.size} | Mode: {verified_img.mode}")
        else:
            print(f"Verification failed: {path} does not exist!")

if __name__ == "__main__":
    main()
