from django.contrib.auth.models import User

class UsernameEmailBackend(object):
    
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(username=username)
            if(getattr(user, 'is_active', False) and user.check_password(password)):
                return user
            else:
                return None
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=username)
                if(getattr(user, 'is_active', False) and user.check_password(password)):
                    return user
                else:
                    return None
            except User.DoesNotExist:
                return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None