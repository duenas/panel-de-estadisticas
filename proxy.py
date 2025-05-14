from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import json

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        if self.path.startswith('/api/'):
            api_url = f'https://www.cistpro.com/cuenta_landing{self.path}'
            try:
                req = urllib.request.Request(api_url)
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(response.status)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    print(f'[DEBUG] Response from {api_url}: {data.decode()}')
                    self.wfile.write(data)
            except urllib.error.HTTPError as e:
                print(f'[ERROR] HTTP Error for {api_url}: {e.code} - {e.reason}')
                self.send_response(e.code)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'{e.code} - {e.reason}'}).encode())
            except Exception as e:
                print(f'[ERROR] General Error for {api_url}: {str(e)}')
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print('Starting proxy server on port 8000...')
    httpd.serve_forever()
