import hashlib


def hash_file(file_bytes: bytes) -> str:
    """Return the hex-encoded SHA-256 digest of *file_bytes*."""
    return hashlib.sha256(file_bytes).hexdigest()


def verify_hash(file_bytes: bytes, expected_hash: str) -> bool:
    """Return True if the SHA-256 of *file_bytes* matches *expected_hash*."""
    return hash_file(file_bytes) == expected_hash
