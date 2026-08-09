from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Address', {
            'fields': ('role', 'phone', 'address_line1', 'address_line2',
                       'city', 'state', 'postal_code', 'country')
        }),
    )


admin.site.register(User, CustomUserAdmin)
