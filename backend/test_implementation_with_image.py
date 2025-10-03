from PIL import Image
import io
import oqs

img = Image.open("images/test_image_2.jpeg")   # replace with your image
buffer = io.BytesIO()
img.save(buffer, format="JPEG")
image_bytes = buffer.getvalue()

with oqs.Signature("Dilithium2") as signer:
    public_key = signer.generate_keypair()
    signature = signer.sign(image_bytes)

    print("Signature created (length: {} bytes)".format(len(signature)))
    valid = signer.verify(image_bytes, signature, public_key)
    print("Signature valid?", valid)

    tampered_bytes = image_bytes[:-10] + b"12345"  # corrupt the image slightly
    tampered_valid = signer.verify(tampered_bytes, signature, public_key)
    print("Signature valid on tampered image?", tampered_valid)
