from django.db import models


class DateModelMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Country(DateModelMixin):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=3)

    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self):
        return f"{self.name}, {self.code}"


class Tag(DateModelMixin):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Language(DateModelMixin):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=3)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} ({self.code})"
