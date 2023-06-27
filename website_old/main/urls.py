from django.urls import path
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.FamilyList, name="home"),
    path('home', views.Family, name="home"),
    path('family_tree', views.FamilyTree, name="family_tree"),
    path('family_data', views.FamilyData, name="family_data"),
    path('family_form_data', views.FamilyFormData, name="family_form_data"),
    path('sign-up', views.sign_up, name="sign_up"),
    path('new_fm', views.NewFamilyMember, { 'document_root': settings.MEDIA_ROOT }, name="new_fm"),
    path('family_list', views.FamilyList, name="family_list"),

    path('show_item/<int:pk>', views.showItem, name = 'showItem'),
    path('update_item/<int:pk>', views.updateItem, name = 'updateItem'),
    path('delete_item/<int:pk>', views.deleteItem, name = 'deleteItem'),

    path('new_child/<int:pk>', views.newChild, name = 'newChild'),
    path('new_spouse/<int:pk>', views.newSpouse, name = 'newSpouse'),
    
]