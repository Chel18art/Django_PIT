from django.urls import path
from . import views
from . import api_views
from django.contrib import admin
from .views import CategoryDeleteView
from .views import delete_category  # Adjust the import according to your app structure




urlpatterns = [
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/inventory/', views.inventory_list, name='inventory_list'),
    path('item/add/', views.add_item, name='add-item'),     path('admin/sales_report/', views.sales_report, name='sales_report'),
    path('admin/categories/', views.manage_categories, name='manage_categories'),
    path('categories/delete/<int:category_id>/', views.delete_category, name='delete_category'),
    path('delete_category/<int:pk>/', views.delete_category, name='delete_category'),
    path('categories/manage/', views.manage_categories, name='manage_categories'),
    path('admin/users/', views.manage_users, name='manage_users'),
    path('logout/', views.logout_view, name='logout'),
    # Cashier POS
    path('cashier_pos/', views.cashier_pos, name='cashier_pos'),
    path('cashier/cart/add/<int:item_id>/', views.add_to_cart, name='add_to_cart'),
    path('cashier/cart/', views.view_cart, name='view_cart'),
    path('cashier/checkout/', views.checkout, name='checkout'),
    path('api/categories/', views.CategoryListCreate.as_view(), name='category-list-create'),
    path('', views.login_page, name='login_page'),  # Show login page by default
    path('api/login/', views.login_api, name='api-login'),  # Handle login request
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('cashier_pos/', views.cashier_pos, name='cashier_pos'),
    path('admin/', admin.site.urls),  # This is for the Django Admin panel (superuser)
    path('inventory/', views.inventory_list, name='inventory-list'),
    path('categories/', views.create_category, name='create_category'),
    path('inventory/update/<int:item_id>/', views.update_item, name='update_item'),
    path('inventory/delete/<int:item_id>/', views.delete_item, name='delete_item'),
    path('inventory/stock_entry/<int:item_id>/', views.stock_entry, name='stock_entry'),

]
