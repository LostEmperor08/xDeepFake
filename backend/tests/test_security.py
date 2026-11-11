"""Tests for Security, Validation, and File Ingestion."""

import pytest
from app.security import (
    sanitize_filename,
    verify_magic_bytes,
)


def test_sanitize_filename():
    assert sanitize_filename("../../../etc/passwd") == "passwd"
    assert sanitize_filename("..\\..\\windows\\system32\\calc.exe") == "calc.exe"
    assert sanitize_filename("sample image (1).png") == "sample_image__1_.png"
    assert sanitize_filename("test file.jpg") == "test_file.jpg"


def test_verify_magic_bytes_valid_jpeg():
    valid_jpg_header = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00"
    assert verify_magic_bytes(valid_jpg_header, "jpg") is True
    assert verify_magic_bytes(valid_jpg_header, "jpeg") is True


def test_verify_magic_bytes_invalid_jpeg():
    fake_jpg_header = b"NOT_A_REAL_JPEG_HEADER"
    assert verify_magic_bytes(fake_jpg_header, "jpg") is False


def test_verify_magic_bytes_valid_png():
    valid_png_header = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
    assert verify_magic_bytes(valid_png_header, "png") is True


def test_verify_magic_bytes_valid_pdf():
    valid_pdf_header = b"%PDF-1.7\r\n%\xb5\xed\xae\xfb\r\n"
    assert verify_magic_bytes(valid_pdf_header, "pdf") is True


def test_verify_magic_bytes_valid_riff_wav():
    valid_wav_header = b"RIFF\x24\x00\x00\x00WAVEfmt "
    assert verify_magic_bytes(valid_wav_header, "wav") is True


def test_verify_magic_bytes_valid_riff_webp():
    valid_webp_header = b"RIFF\x24\x00\x00\x00WEBPVP8 "
    assert verify_magic_bytes(valid_webp_header, "webp") is True
