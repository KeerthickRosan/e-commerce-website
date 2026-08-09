from decimal import Decimal
from django.db import transaction
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer, OrderStatusUpdateSerializer
from cart.models import Cart

SHIPPING_FEE = Decimal('40.00')
FREE_SHIPPING_THRESHOLD = Decimal('500.00')


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                     (request.user.is_staff or getattr(request.user, 'role', None) == 'admin'))


class CheckoutView(APIView):
    """
    POST shipping details -> creates an Order from the user's current cart,
    decrements stock, clears the cart, and returns the created order.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'detail': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            subtotal = Decimal('0')
            items_data = []
            for item in cart.items.select_related('product').all():
                product = item.product
                if product.stock < item.quantity:
                    return Response(
                        {'detail': f'Not enough stock for {product.name}.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                subtotal += product.final_price * item.quantity
                items_data.append((product, item.quantity, product.final_price))

            shipping_fee = Decimal('0') if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
            total = subtotal + shipping_fee

            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                shipping_fee=shipping_fee,
                total=total,
                shipping_address_line1=data['shipping_address_line1'],
                shipping_address_line2=data.get('shipping_address_line2', ''),
                shipping_city=data['shipping_city'],
                shipping_state=data['shipping_state'],
                shipping_postal_code=data['shipping_postal_code'],
                shipping_country=data['shipping_country'],
                phone=data.get('phone', ''),
                payment_method=data['payment_method'],
                status=Order.Status.PENDING,
            )

            for product, quantity, price in items_data:
                OrderItem.objects.create(
                    order=order, product=product, product_name=product.name,
                    price=price, quantity=quantity,
                )
                product.stock -= quantity
                product.save(update_fields=['stock'])

            cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    """Logged-in user's own order history."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', None) == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=user)


class AdminOrderListView(generics.ListAPIView):
    """Admin: view all orders across all users."""
    permission_classes = [IsAdminRole]
    serializer_class = OrderSerializer
    queryset = Order.objects.all().select_related('user').prefetch_related('items')


class AdminOrderStatusUpdateView(generics.UpdateAPIView):
    """Admin: update order status (processing/shipped/delivered/cancelled)."""
    permission_classes = [IsAdminRole]
    serializer_class = OrderStatusUpdateSerializer
    queryset = Order.objects.all()
