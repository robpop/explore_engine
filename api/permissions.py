from rest_framework import permissions

class VettingIsAvailableOrOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if obj.staff == request.user:
            return True
        elif obj.assigned == False:
            return True
        else:
            return False