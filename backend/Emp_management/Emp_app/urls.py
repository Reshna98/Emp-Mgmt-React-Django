from Emp_app.views import *
from django.conf import settings
from django.urls import path

urlpatterns = [
    path('Admin_reg/',Admin_reg),
    path('login/',Login),
    path('add_employee/',add_employee),
    path('fetch_employees/<int:user_id>/', fetch_employees),
    path('add_custom_field/', add_custom_field),
    path('fetch_employee/<int:id>/', fetch_employee),
    path('update_employee/<int:id>/', update_employee),
    path('delete_employee/<int:id>/', delete_employee),
    path('get_profile_data/<int:id>/', getProfileData),
    path('change_password/',  change_password),
  
]