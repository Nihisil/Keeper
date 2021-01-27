# Generated by Django 3.0.3 on 2020-03-12 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0037_auto_20200312_1216'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='authors'),
        ),
        migrations.AlterField(
            model_name='bookversion',
            name='cover',
            field=models.ImageField(blank=True, null=True, upload_to='books'),
        ),
    ]
