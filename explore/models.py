from django.utils.timezone import now
from django.db import models
from publish.models import Site

class Chunk(models.Model):
    created = models.DateTimeField(default=now)
    site_1 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site1')
    site_2 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site2')
    site_3 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site3')
    site_4 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site4')
    site_5 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site5')
    site_6 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site6')
    site_7 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site7')
    site_8 = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False, related_name='site8')
    def __str__(self):
        return str(self.site_1) + '...' + str(self.site_8) + ' on ' + str(self.created)
