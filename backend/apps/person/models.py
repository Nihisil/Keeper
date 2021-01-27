from apps.base.models import DateModelMixin, Country, Language
from django.db import models

from apps.person import constants as person_constants


class Person(DateModelMixin):
    original_country = models.ForeignKey(Country, on_delete=models.PROTECT)

    birth_date = models.DateField(null=True, blank=True)
    photo = models.ImageField(null=True, blank=True, upload_to="person")

    class Meta:
        db_table = "person"

    def __str__(self):
        names = ", ".join(self.versions.all().values_list("last_name", flat=True))
        return f"{names} ({self.original_country})"

    def main_version(self):
        return self.versions.filter(is_main=True).first()

    def not_main_versions(self):
        return self.versions.filter(is_main=False)


class PersonVersion(DateModelMixin):
    is_main = models.BooleanField(default=False)

    entity = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="versions")
    language = models.ForeignKey(Language, on_delete=models.PROTECT)

    first_name = models.CharField(max_length=1000)
    last_name = models.CharField(max_length=1000)
    biography = models.TextField(null=True, blank=True)

    class Meta:

        db_table = "person_version"
        ordering = ["language__order"]
        unique_together = ["entity", "language"]

    def __str__(self):
        return self.full_name()

    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class PersonExternalIdentifier(DateModelMixin):
    author = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="identifiers")
    identifier_type = models.PositiveSmallIntegerField(choices=person_constants.PERSON_EXTERNAL_IDENTIFIERS)
    external_id = models.CharField(max_length=200)

    class Meta:
        db_table = "person_identifier"
        unique_together = ["author", "type"]

    def get_external_link(self):
        return person_constants.PERSON_EXTERNAL_IDENTIFIERS_URLS.get(self.identifier_type) % {
            "id": self.external_id
        }
