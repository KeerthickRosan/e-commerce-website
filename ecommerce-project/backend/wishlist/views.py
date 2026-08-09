from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Wishlist
from .serializers import WishlistSerializer
from products.models import Product


class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist).data)


class WishlistToggleView(APIView):
    """POST { product: <id> } - adds if absent, removes if present."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if wishlist.products.filter(id=product.id).exists():
            wishlist.products.remove(product)
            added = False
        else:
            wishlist.products.add(product)
            added = True

        return Response({'added': added, 'wishlist': WishlistSerializer(wishlist).data})
