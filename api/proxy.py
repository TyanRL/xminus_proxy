# api/proxy.py

import logging
from fastapi import FastAPI, Request, Response
import httpx

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

TARGET_URL = 'https://x-minus.pro'

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy(request: Request, path: str):
    logging.debug(f"Proxy called with path: {path}")
    logging.debug(f"Request method: {request.method}")
    logging.debug(f"Request headers: {request.headers}")

    client = httpx.AsyncClient()

    try:
        resp = await client.request(
            method=request.method,
            url=f"{TARGET_URL}/{path}",
            headers={key: value for key, value in request.headers.items() if key.lower() != 'host'},
            params=request.query_params,
            content=await request.body(),
            cookies=request.cookies
        )
    finally:
        await client.aclose()

    headers = [(k, v) for k, v in resp.headers.items() if k.lower() not in ['content-encoding', 'content-length', 'transfer-encoding', 'connection']]
    return Response(content=resp.content, status_code=resp.status_code, headers=dict(headers))

def handler(request, *args):
    logging.debug(f"Handler called with request: {request}")
    return app
