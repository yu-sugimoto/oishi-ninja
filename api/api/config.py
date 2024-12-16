import os

def get_gunicorn_options():
    port = int(os.getenv("PORT", 4000))
    workers = int(os.getenv("GUNICORN_WORKERS", 2))
    timeout = int(os.getenv("GUNICORN_TIMEOUT", 120))

    return {
        "bind": f"0.0.0.0:{port}",
        "workers": workers,
        "timeout": timeout,
    }
