from django.urls import path
from .views import WishlistView, WishlistToggleView

urlpatterns = [
    path('', WishlistView.as_view(), name='wishlist-detail'),
    path('toggle/', WishlistToggleView.as_view(), name='wishlist-toggle'),
]
