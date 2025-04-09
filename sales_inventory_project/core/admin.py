from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import your custom User model
from .models import Item
from .models import Category

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'is_staff', 'is_superuser']

    # Show the 'role' field when viewing/editing a user
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),  # ✅ Correct usage
    )

    # Show the 'role' field when adding a new user
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),  # ✅ Correct usage
    )

admin.site.register(User, CustomUserAdmin)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')  # Add the fields you want to display
    search_fields = ('name',)  # Add search functionality (optional)
    list_filter = ('category',)  # Add filter options (optional)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)