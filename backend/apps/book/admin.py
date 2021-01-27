from django.contrib import admin
from django.forms import ModelForm
from mptt.admin import MPTTModelAdmin
from mptt.forms import TreeNodeChoiceField

from apps.book.models import (
    Author,
    AuthorIdentifier,
    AuthorVersion,
    Book,
    BookCompletedSummary,
    BookIdentifier,
    BookUserTimeline,
    BookVersion,
    Series,
    SeriesVersion,
    Shelf,
    ShelfBookItem,
)


class SeriesVersionInline(admin.StackedInline):
    model = SeriesVersion
    extra = 0


class SeriesAdmin(MPTTModelAdmin):
    mptt_indent_field = "versions_name"
    search_fields = ["versions__name"]
    list_display = ["versions_name", "series_order"]
    inlines = [SeriesVersionInline]


class BookIdentifierInline(admin.TabularInline):
    model = BookIdentifier
    extra = 0


class BookVersionInline(admin.StackedInline):
    model = BookVersion
    extra = 0


class ShelfBookItemInline(admin.StackedInline):
    model = ShelfBookItem
    extra = 0


class BookForm(ModelForm):
    series = TreeNodeChoiceField(queryset=Series.objects.all())

    class Meta:
        model = Book
        exclude = []


class BookAdmin(admin.ModelAdmin):
    form = BookForm
    search_fields = ["versions__title"]
    list_display = ["versions_titles", "series_with_position", "first_published"]
    filter_horizontal = ["authors", "tags"]
    inlines = [BookIdentifierInline, ShelfBookItemInline, BookVersionInline]


class AuthorIdentifierInline(admin.StackedInline):
    model = AuthorIdentifier
    extra = 0


class AuthorVersionInline(admin.StackedInline):
    model = AuthorVersion
    extra = 0


class AuthorAdmin(admin.ModelAdmin):
    inlines = [AuthorIdentifierInline, AuthorVersionInline]


class ShelfAdmin(admin.ModelAdmin):
    search_fields = ["name"]
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ["name"]}


class BookCompletedSummaryAdmin(admin.ModelAdmin):
    search_fields = ["book__title"]
    list_display = ["book", "score", "finished"]


class BookUserTimelineAdmin(admin.ModelAdmin):
    search_fields = ["book__title"]
    list_display = ["book", "status", "created"]
    ordering = ["-created"]


admin.site.register(Series, SeriesAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Shelf, ShelfAdmin)
admin.site.register(BookCompletedSummary, BookCompletedSummaryAdmin)
admin.site.register(BookUserTimeline, BookUserTimelineAdmin)
