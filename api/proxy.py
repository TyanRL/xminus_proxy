import json
import requests

def handler(event, context):
    # Извлекаем метод, заголовки и тело из события
    method = event.get('httpMethod', 'GET')
    headers = event.get('headers', {})
    body = event.get('body', '')
    path = event.get('path', '/')
    queryStringParameters = event.get('queryStringParameters', {})

    # Строим целевой URL
    TARGET_URL = 'https://x-minus.pro'
    url = f"{TARGET_URL}{path}"

    # Отправляем запрос на целевой URL
    resp = requests.request(
        method=method,
        url=url,
        headers=headers,
        params=queryStringParameters,
        data=body,
        allow_redirects=False
    )

    # Формируем ответ
    return {
        'statusCode': resp.status_code,
        'headers': dict(resp.headers),
        'body': resp.text
    }
