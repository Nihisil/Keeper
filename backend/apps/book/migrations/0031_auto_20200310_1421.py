# Generated by Django 3.0.3 on 2020-03-10 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0030_auto_20200310_1405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookversion',
            name='pages_count',
            field=models.PositiveSmallIntegerField(blank=True, help_text='For paper/ebook versions', null=True),
        ),
        migrations.AlterField(
            model_name='bookversion',
            name='seconds_length',
            field=models.PositiveIntegerField(blank=True, help_text='For audio books', null=True),
        ),
    ]
