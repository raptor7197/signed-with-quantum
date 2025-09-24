from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
import io
import piexif
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

app = FastAPI()

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

@app.post("/caption")
async def generate_caption(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    out = model.generate(**inputs, min_length=10)
    caption = processor.decode(out[0], skip_special_tokens=True)
    exif_dict = piexif.load(image.info.get("exif", b""))
    exif_dict["0th"][piexif.ImageIFD.ImageDescription] = caption.encode("utf-8")
    exif_bytes = piexif.dump(exif_dict)
    output = io.BytesIO()
    image.save(output, format="JPEG", exif=exif_bytes)
    output.seek(0)
    return FileResponse(output, media_type="image/jpeg", filename="photo_with_caption.jpg")
