from django.db import models

# Create your models here.

# START:for_download_tuto
class FilesAdmin(models.Model):
    adminupload = models.FileField(upload_to="media")
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title
# END:for_download_tuto


class Individu(models.Model):
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=5)
    generation = models.IntegerField(null=True, blank=True)
    parent_male_id= models.IntegerField(null=True, blank=True)
    parent_female_id = models.IntegerField(null=True, blank=True)
    birth_rank = models.IntegerField(null=True, blank=True)
    spouses = models.ManyToManyField("self", blank=True)
    dead = models.BooleanField(default=False)
    youngdead = models.BooleanField(default=False)
    birth_date = models.DateField(null=True, blank=True)    
    birth_place = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=255, null=True, blank=True)
    telephone = models.CharField(max_length=255, null=True, blank=True)
    profession = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    linkedin = models.CharField(max_length=255, null=True, blank=True)
    twitter = models.CharField(max_length=255, null=True, blank=True)
    facebook = models.CharField(max_length=255, null=True, blank=True)
    instagram = models.CharField(max_length=255, null=True, blank=True)
    aboutme = models.TextField(null=True, blank=True)
    isIncomingSpouse = models.BooleanField(default=False)

    @property
    def spouseslist(self):
        return list(self.spouses.all())