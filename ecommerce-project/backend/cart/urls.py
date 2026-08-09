from django.urls import path
from .views import CartView, CartAddItemView, CartItemDetailView, CartClearView

urlpatterns = [
    path('', CartView.as_view(), name='cart-detail'),
    path('add/', CartAddItemView.as_view(), name='cart-add'),
    path('items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('clear/', CartClearView.as_view(), name='cart-clear'),
]
