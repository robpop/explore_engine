from django.db import models
from django.contrib.auth.models import User
from publish.models import Site

class Folder(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    name = models.CharField(max_length=25, blank=False)
    def __str__(self):
        return str(self.account) + ': ' + str(self.name)

class SavedSite(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return str(self.account) + ': ' + str(self.site)