from rest_framework.authtoken.models import Token

class APITokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated and not request.COOKIES.get('apitoken'):
            token = Token.objects.get(user=request.user)
            response.set_cookie('apitoken', token.key, max_age=1209600)
        return response