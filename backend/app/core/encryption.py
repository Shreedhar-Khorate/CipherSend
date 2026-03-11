import hashlib

from Crypto.Cipher import AES

from app.core.config import get_settings

# AES-256-GCM layout for the stored blob:
#   bytes  0 – 15  → nonce  (16 bytes)
#   bytes 16 – 31  → GCM authentication tag (16 bytes)
#   bytes 32 –  N  → ciphertext
_NONCE_LEN = 16
_TAG_LEN = 16


def _derive_key() -> bytes:
    """Derive a deterministic 32-byte AES key from the configured secret."""
    secret = get_settings().aes_secret_key
    return hashlib.sha256(secret.encode()).digest()


def encrypt_file(file_bytes: bytes) -> bytes:
    """
    Encrypt *file_bytes* with AES-256-GCM.

    Returns nonce ‖ tag ‖ ciphertext.
    """
    key = _derive_key()
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(file_bytes)
    return cipher.nonce + tag + ciphertext


def decrypt_file(encrypted_bytes: bytes) -> bytes:
    """
    Decrypt *encrypted_bytes* produced by :func:`encrypt_file`.

    Raises ``ValueError`` (from PyCryptodome) if the authentication tag
    does not match — indicating tampered or corrupted data.
    """
    key = _derive_key()
    nonce = encrypted_bytes[:_NONCE_LEN]
    tag = encrypted_bytes[_NONCE_LEN : _NONCE_LEN + _TAG_LEN]
    ciphertext = encrypted_bytes[_NONCE_LEN + _TAG_LEN :]
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag)
