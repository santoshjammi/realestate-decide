#!/usr/bin/env python3
"""Deploy RealEstateDecide static export (out/) to the realestate-decide
subdomain folder on Hostinger via a single persistent ftplib session.

Usage: deploy_realestate.py <out_dir> [remote_dir]
Remote dir defaults to /public_html/realestate-decide — the docroot for the
realestate-decide.countrysnews.com subdomain (if created as a subdirectory).
Adapt ROOT_REMOTE if Hostinger's hPanel maps the subdomain to a different path.
"""
import ftplib
import os
import sys

HOST = "212.1.209.3"
USER = os.environ.get("CN_FTP_USER", "u237278792.countrysnews.com")
PASS = os.environ.get("CN_FTP_PASS")
if not PASS:
    sys.exit("CN_FTP_PASS not set (secret must come from env, not code)")
ROOT_REMOTE = os.environ.get("RE_DEPLOY_DIR", "/public_html/realestate-decide")
SOCK_TIMEOUT = 30


def new_ftp():
    ftp = ftplib.FTP()
    ftp.connect(HOST, 21, timeout=SOCK_TIMEOUT)
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
            remote = f"{ROOT_REMOTE}/{rel}"
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
    print(f"DONE uploaded={uploaded} failed={failed} target={ROOT_REMOTE}")


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "out"
    if len(sys.argv) > 2:
        ROOT_REMOTE = sys.argv[2]
    walk_and_upload(out)
