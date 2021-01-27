from django import template

from apps.book.models import AuthorVersion, SeriesVersion

register = template.Library()


@register.filter
def get_authors_for_language(book, language):
    return AuthorVersion.objects.filter(entity__book=book, language=language)


@register.filter
def get_series_for_language(book, language):
    return SeriesVersion.objects.filter(entity__book=book, language=language).first()
