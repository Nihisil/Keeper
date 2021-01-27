# Generated by Django 3.0.3 on 2020-03-09 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0012_auto_20200309_0440'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='original_language',
        ),
        migrations.AddField(
            model_name='bookversion',
            name='pages_count',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='bookversion',
            name='published_at',
            field=models.DateField(blank=True, null=True),
        ),
    ]
