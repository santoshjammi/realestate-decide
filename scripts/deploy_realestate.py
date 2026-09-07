#!/usr/bin/env python3
"""Deploy RealEstateDecide static export (out/) to the realestate-decide
subdomain on Hostinger via FTP.

Reads credentials from the Hermes vault at ~/.hermes/vault/hostinger.env
(RE_FTP_HOST/RE_FTP_USER/RE_FTP_PASS/RE_FTP_DIR) so secrets never live in chat,
code, or git. Override any value with the same-named env var if you prefer.

Usage: deploy_realestate.py [out_dir] [remote_dir]
  out_dir    default: out   (the static export)
  remote_dir default: RE_FTP_DIR from vault, else /public_html
"""
import ftplib
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load vault secrets (best-effort; falls back to env vars already set)
VAULT = os.path.expanduser("~/.hermes/vault/hostinger.env")
if os.path.exists(VAULT):
    load_dotenv(VAULT)

HOST = os.environ.get("RE_FTP_HOST", "212.1.209.3")
PORT = int(os.environ.get("RE_FTP_PORT", "21"))
USER = os.environ.get("RE_FTP_USER", "u237278792.realestate-decide.countrysnews.com")
PASS = os.environ.get("RE_FTP_PASS")
DIR = os.environ.get("RE_FTP_DIR", "/public_html")
SOCK_TIMEOUT = 30

if not PASS or PASS.startswith("___MISSING"):
    sys.exit("RE_FTP_PASS not set — add the subdomain FTP password to "
             "~/.hermes/vault/hostinger.env (RE_FTP_PASS=...) then re-run.")


def new_ftp():
    ftp = ftplib.FTP()
    ftp.connect(HOST, PORT, timeout=SOCK_TIMEOUT)
    ftp.login(USER, PASS)
    return ftp


def ensure_dir(ftp, path):
    parts = [p for p in path.split("/") if p]
    cur = ""
    for p in parts:
        cur += "/" + p
        try:
            ftp.cwd(cur)
        except ftplib.error_perm:
            try:
                ftp.mkd(cur)
            except ftplib.error_perm:
                pass


def upload(ftp, local_path, remote_path):
    for attempt in range(4):
        try:
            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {remote_path}", f)
            return True, ftp
        except Exception as e:
            if attempt == 3:
                print(f"  FAIL {remote_path}: {e}", flush=True)
                return False, ftp
            ftp = reconnect(ftp)


def reconnect(ftp):
    try:
        ftp.quit()
    except Exception:
        pass
    return new_ftp()


def walk_and_upload(out_dir):
    ftp = new_ftp()
    uploaded = 0
    failed = 0
    files = []
    for root, dirs, names in os.walk(out_dir):
        dirs[:] = [d for d in dirs if d != ".git"]
        for name in names:
            local = os.path.join(root, name)
            rel = os.path.relpath(local, out_dir)
            remote = f"{DIR}/{rel}"
            files.append((local, remote))
    dirs = set()
    for local, remote in files:
        rdir = os.path.dirname(remote)
        if rdir not in dirs:
            ensure_dir(ftp, rdir)
            dirs.add(rdir)
    for i, (local, remote) in enumerate(files):
        ok, ftp = upload(ftp, local, remote)
        if ok:
            uploaded += 1
        else:
            failed += 1
        if (i + 1) % 25 == 0:
            print(f"  {i + 1}/{len(files)} uploaded...", flush=True)
    try:
        ftp.quit()
    except Exception:
        pass
    print(f"DONE uploaded={uploaded} failed={failed} target={DIR}")


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "out"
    if len(sys.argv) > 2:
        DIR = sys.argv[2]
    walk_and_upload(out)
