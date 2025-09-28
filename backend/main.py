from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse, JSONResponse
from PIL import Image
import io
import piexif
from oqs import Signature
import base64
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

app = FastAPI()

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

alg = "Dilithium2"
signer = Signature(alg)
pk = signer.generate_keypair()
sk = signer.export_secret_key()

@app.post("/save")
async def generate_caption(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    output_ids = model.generate(**inputs, min_length=10)
    caption = processor.decode(output_ids[0], skip_special_tokens=True)
    message_bytes = caption.encode("utf-8")
    sig_bytes = signer.sign(message_bytes)
    exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}
    exif_dict["0th"][piexif.ImageIFD.ImageDescription] = caption.encode("utf-8")
    exif_dict["0th"][piexif.ImageIFD.Copyright] = base64.b64encode(sig_bytes)
    exif_bytes = piexif.dump(exif_dict)
    output = io.BytesIO()
    image.save(output, format="JPEG", exif=exif_bytes)
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="image/jpeg",
        headers={"Content-Disposition": "inline; filename=photo_with_caption.jpg"}
    )

@app.post("/verify")
async def verify_caption(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        exif_data = piexif.load(contents)
    except Exception as e:
        return JSONResponse({"valid": False, "reason": f"Failed to read EXIF: {str(e)}"})
    caption_bytes = exif_data["0th"].get(piexif.ImageIFD.ImageDescription)
    sig_bytes_b64 = exif_data["0th"].get(piexif.ImageIFD.Copyright)
    if not caption_bytes or not sig_bytes_b64:
        return JSONResponse({"valid": False, "reason": "No caption or signature found"})
    caption = caption_bytes.decode("utf-8")
    sig_bytes = base64.b64decode(sig_bytes_b64)
    verifier = Signature(alg)
    is_valid = verifier.verify(caption.encode("utf-8"), sig_bytes, public_key=pk)
    return {"valid": is_valid, "caption": caption}
