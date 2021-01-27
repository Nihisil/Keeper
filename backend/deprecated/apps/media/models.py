from django.db import models

MEDIA_TYPES = [["book", "Book"], ["manhwa", "Manhwa"]]


class Media(models.Model):
    media_type = models.CharField(max_length=200, choices=MEDIA_TYPES, db_index=True)
