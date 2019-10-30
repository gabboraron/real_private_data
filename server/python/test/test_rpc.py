import jsonrpcclient

def s():
    return jsonrpcclient.request('http://localhost:8081/rpc', 'ping')

res = s()
print(s)