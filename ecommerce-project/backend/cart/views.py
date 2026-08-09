from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product


class CartView(APIView):
    """GET the current user's cart."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)


class CartAddItemView(APIView):
    """POST { product: <id>, quantity: <int> } to add/increment an item in the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))

        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        if product.stock < quantity:
            return Response({'detail': 'Not enough stock available.'}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product,
                                                         defaults={'quantity': quantity})
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    """PATCH { quantity } to update, DELETE to remove a cart item."""
    permission_classes = [permissions.IsAuthenticated]

    def get_item(self, request, item_id):
        return CartItem.objects.filter(id=item_id, cart__user=request.user).first()

    def patch(self, request, item_id):
        item = self.get_item(request, item_id)
        if not item:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        quantity = int(request.data.get('quantity', item.quantity))
        if quantity < 1:
            return Response({'detail': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = quantity
        item.save()
        return Response(CartSerializer(item.cart).data)

    def delete(self, request, item_id):
        item = self.get_item(request, item_id)
        if not item:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)
