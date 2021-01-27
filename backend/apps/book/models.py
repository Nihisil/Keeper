from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

from apps.base.models import Country, DateModelMixin, Language, Tag
from apps.book.book_constants import (
    AUTHOR_FANTLAB,
    AUTHOR_GOODREADS,
    AUTHOR_IDENTIFIERS,
    AUTHOR_LIBRARYTHING,
    AUTHOR_TODAY,
    BOOK_FANTLAB,
    BOOK_GOODREADS,
    BOOK_IDENTIFIERS,
    BOOK_LIBRARYTHING,
    BOOK_TYPES,
    BOOKS_STATUSES,
    COMPLETED,
    STARTED,
)


class Author(DateModelMixin):
    birth_date = models.DateField(null=True, blank=True)
    original_country = models.ForeignKey(Country, on_delete=models.PROTECT)
    photo = models.ImageField(null=True, blank=True, upload_to="authors")

    def __str__(self):
        names = ", ".join(self.versions.all().values_list("last_name", flat=True))
        return f"{names} ({self.original_country})"

    def main_version(self):
        return self.versions.filter(is_main=True).first()

    def not_main_versions(self):
        return self.versions.filter(is_main=False)


class AuthorVersion(DateModelMixin):
    entity = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="versions"
    )
    language = models.ForeignKey(Language, on_delete=models.PROTECT)

    first_name = models.CharField(max_length=1000)
    last_name = models.CharField(max_length=1000)
    biography = models.TextField(null=True, blank=True)
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ["language__order"]
        unique_together = ["entity", "language"]

    def __str__(self):
        return self.full_name()

    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class AuthorIdentifier(DateModelMixin):
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="identifiers"
    )
    type = models.PositiveSmallIntegerField(choices=AUTHOR_IDENTIFIERS)
    external_id = models.CharField(max_length=200)

    class Meta:
        unique_together = ["author", "type"]

    def get_external_link(self):
        if self.type == AUTHOR_GOODREADS:
            return f"https://www.goodreads.com/author/show/{self.external_id}"

        if self.type == AUTHOR_LIBRARYTHING:
            return f"https://www.librarything.com/author/{self.external_id}"

        if self.type == AUTHOR_FANTLAB:
            return f"https://fantlab.ru/author{self.external_id}"

        if self.type == AUTHOR_TODAY:
            return f"https://author.today/u/{self.external_id}"

        return ""


class Series(DateModelMixin, MPTTModel):
    series_order = models.PositiveSmallIntegerField(default=0)
    parent = TreeForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )

    class Meta:
        verbose_name_plural = "Series"

    class MPTTMeta:
        order_insertion_by = ["series_order"]

    def __str__(self):
        return self.versions_name()

    def versions_name(self):
        return ", ".join(self.versions.all().values_list("name", flat=True))

    def main_version(self):
        return self.versions.filter(is_main=True).first()


class SeriesVersion(DateModelMixin):
    entity = models.ForeignKey(
        Series, on_delete=models.CASCADE, related_name="versions"
    )
    language = models.ForeignKey(Language, on_delete=models.PROTECT)

    name = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ["language__order"]
        unique_together = ["entity", "language"]

    def __str__(self):
        return self.name


class Book(DateModelMixin):
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, blank=True)
    series_position = models.CharField(max_length=4, null=True, blank=True)

    authors = models.ManyToManyField(Author, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.versions_titles()

    def versions_titles(self):
        return ", ".join(self.versions.all().values_list("title", flat=True))

    def series_with_position(self):
        if not self.series:
            return ""
        return f"#{self.series_position} {self.series}"

    def first_published(self):
        main_version = self.main_version()
        return main_version and main_version.published_at

    def main_version(self):
        return self.versions.filter(is_main=True).first()

    def not_main_versions(self):
        return self.versions.filter(is_main=False)

    def latest_status(self):
        return BookUserTimeline.objects.filter(book__entity=self).last()

    def summary(self):
        return BookCompletedSummary.objects.filter(book__entity=self).last()


class BookVersion(DateModelMixin):
    entity = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="versions")
    language = models.ForeignKey(Language, on_delete=models.PROTECT)

    title = models.CharField(max_length=1000)
    cover = models.ImageField(null=True, blank=True, upload_to="books")
    description = models.TextField(null=True, blank=True)

    is_main = models.BooleanField(default=False)
    published_at = models.DateField(null=True, blank=True)

    pages_count = models.PositiveSmallIntegerField(
        null=True, blank=True, help_text="For paper/ebook versions"
    )
    seconds_length = models.PositiveIntegerField(
        null=True, blank=True, help_text="For audio books"
    )

    class Meta:
        ordering = ["language__order"]

    def __str__(self):
        return self.title

    def published_at_formatted(self):
        # we don't know exact date, so let's display only year
        if self.published_at.day == 1 and self.published_at.month == 1:
            return self.published_at.year

        return self.published_at

    def seconds_length_formatted(self):
        hours = int(self.seconds_length / 60 / 60)
        minutes = int((self.seconds_length - hours * 60 * 60) / 60)
        seconds = int((self.seconds_length - hours * 60 * 60 - minutes * 60))
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    def latest_status(self):
        return BookUserTimeline.objects.filter(book=self).last()


class BookIdentifier(DateModelMixin):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="identifiers")
    type = models.PositiveSmallIntegerField(choices=BOOK_IDENTIFIERS)
    external_id = models.CharField(max_length=200)

    class Meta:
        unique_together = ["book", "type"]

    def get_external_link(self):
        if self.type == BOOK_GOODREADS:
            return f"https://www.goodreads.com/book/show/{self.external_id}"

        if self.type == BOOK_LIBRARYTHING:
            return f"https://www.librarything.com/work/{self.external_id}"

        if self.type == BOOK_FANTLAB:
            return f"https://fantlab.ru/work{self.external_id}"

        return ""


class BookUserTimeline(DateModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(
        BookVersion, on_delete=models.CASCADE, related_name="timeline"
    )
    status = models.PositiveSmallIntegerField(choices=BOOKS_STATUSES)
    created = models.DateField()

    class Meta:
        ordering = ["created", "id"]

    def is_started(self):
        return self.status == STARTED

    def is_completed(self):
        return self.status == COMPLETED


class BookCompletedSummary(DateModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(
        BookVersion, on_delete=models.CASCADE, related_name="scores"
    )
    type = models.PositiveSmallIntegerField(choices=BOOK_TYPES)

    score = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    comment = models.TextField(null=True, blank=True)
    finished = models.DateField()


class Shelf(DateModelMixin):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class ShelfBookItem(DateModelMixin):
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="shelfs")

    class Meta:
        unique_together = ["shelf", "book"]

    def __str__(self):
        return self.shelf.name
