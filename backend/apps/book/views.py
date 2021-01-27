from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.db.models import Count, Max
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods

from apps.book.book_constants import BOOK_TYPES, COMPLETED, STARTED
from apps.book.forms import BookCompletedSummaryForm
from apps.book.models import Author, Book, BookUserTimeline, BookVersion


@login_required
def books_list(request):
    started_book_versions_ids = (
        BookUserTimeline.objects.all()
        .values("book_id")
        .annotate(total=Count("book_id"))
        .filter(total=1)
        .order_by("total")
        .values_list("book_id", flat=True)
    )

    in_progress_books = (
        Book.objects.filter(versions__id__in=started_book_versions_ids)
        .prefetch_related("series", "authors")
        .order_by("-updated_at")
    )
    other_books = (
        Book.objects.exclude(versions__id__in=started_book_versions_ids)
        .prefetch_related("series", "authors")
        .order_by("-updated_at")
    )
    return render(
        request,
        "books/book_list.html",
        {"in_progress_books": in_progress_books, "other_books": other_books},
    )


@login_required
def book_details(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    versions = (
        book.versions.all().annotate(latest=Max("timeline__created")).order_by("latest")
    )
    return render(
        request,
        "books/book_details.html",
        {"book": book, "book_types": BOOK_TYPES, "versions": versions},
    )


@login_required
@require_http_methods(["POST"])
def start_reading(request, book_version_id):
    book_version = BookVersion.objects.get(id=book_version_id)

    # to keep the books list in a correct order
    book_version.entity.updated_at = timezone.now()
    book_version.entity.save()

    BookUserTimeline.objects.create(
        user=request.user, book=book_version, status=STARTED, created=timezone.now()
    )
    return redirect(book_details, book_version.entity.id)


@login_required
@require_http_methods(["POST"])
def finish_reading(request, book_version_id):
    book_version = BookVersion.objects.get(id=book_version_id)
    form = BookCompletedSummaryForm(request.POST)
    if form.is_valid():
        with transaction.atomic():
            # to keep the books list in a correct order
            book_version.entity.updated_at = timezone.now()
            book_version.entity.save()

            record = form.save(commit=False)
            record.finished = timezone.now()
            record.user = request.user
            record.book = book_version
            record.save()

            BookUserTimeline.objects.create(
                user=request.user,
                book=book_version,
                status=COMPLETED,
                created=timezone.now(),
            )
    return redirect(book_details, book_version.entity.id)


@login_required
def author_details(request, author_id):
    author = Author.objects.get(id=author_id)
    return render(request, "books/author_details.html", {"author": author})
