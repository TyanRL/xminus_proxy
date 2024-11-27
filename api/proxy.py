# api/proxy.py

from flask import Flask, request, Response
import requests

def handler(event, context):
    app = Flask(__name__)

    TARGET_URL = 'https://x-minus.pro'

    @app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
    @app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
    def proxy(path):
        url = f"{TARGET_URL}/{path}"
        headers = {key: value for key, value in request.headers if key.lower() != 'host'}

        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            params=request.args,
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False
        )

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]

        response = Response(resp.content, resp.status_code, headers)
        return response

    return app(event, context)
