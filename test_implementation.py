import oqs
from oqs import Signature
from PIL import Image

alg = "Dilithium2"
signer = Signature(alg)

pk = signer.generate_keypair()
sk = signer.export_secret_key()
print("pk \n\t,sk\n\t",pk,sk)

message = b"hash-of-image"
sig = signer.sign(message)
print("message\n\t,sig\n\t",message,sig)

# Verify
verifier = Signature(alg, public_key=pk)
print("Valid:\n", verifier.verify(message, sig))