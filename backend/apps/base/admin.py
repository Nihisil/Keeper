from django.contrib import admin

from apps.base.models import Country, Language, Tag


class LanguageAdmin(admin.ModelAdmin):
    search_fields = ["name", "code"]
    list_display = ["name", "code", "order"]


class CountryAdmin(admin.ModelAdmin):
    search_fields = ["name", "code"]
    list_display = ["name", "code"]


class TagAdmin(admin.ModelAdmin):
    search_fields = ["name"]
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ["name"]}


admin.site.register(Language, LanguageAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(Tag, TagAdmin)
