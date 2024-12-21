from flask import jsonify, request

def get_country_code_from_request(request):
    country = request.headers.get('X-Country')
    if not country:
        return jsonify({"message": "Invalid country code"}), 400
    return country
