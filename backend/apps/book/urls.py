from django.urls import path

from apps.book.views import (
    author_details,
    book_details,
    books_list,
    finish_reading,
    start_reading,
)

urlpatterns = [
    path("list", books_list, name="books_list"),
    path("author/<int:author_id>/details", author_details, name="author_details"),
    path("<int:book_id>/details", book_details, name="book_details"),
    path("<int:book_version_id>/start-reading", start_reading, name="start_reading"),
    path("<int:book_version_id>/finish-reading", finish_reading, name="finish_reading"),
]
