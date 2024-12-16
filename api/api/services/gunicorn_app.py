from gunicorn.app.base import BaseApplication

class GunicornApp(BaseApplication):
    def __init__(self, app, options=None):
        self.app = app
        self.options = options or {}
        super().__init__()

    def load_config(self):
        # Gunicorn の設定を適用
        for key, value in self.options.items():
            self.cfg.set(key.lower(), value)

    def load(self):
        # Flask アプリケーションをロード
        return self.app
