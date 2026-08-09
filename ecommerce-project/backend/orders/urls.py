from django.urls import path
from .views import (
    CheckoutView, OrderListView, OrderDetailView,
    AdminOrderListView, AdminOrderStatusUpdateView,
)

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('admin/all/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status'),
]
