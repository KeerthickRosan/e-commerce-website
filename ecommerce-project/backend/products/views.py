from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer,
)
from .permissions import IsAdminOrReadOnly
from .filters import ProductFilter


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for products.
    - list/retrieve: public
    - create/update/delete: admin only
    Supports search (?search=) and filtering (?category=, ?min_price=, ?max_price=, ?brand=, ?in_stock=)
    and ordering (?ordering=price / -price / created_at ...)
    """
    queryset = Product.objects.filter(is_active=True).select_related('category')
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand', 'category__name']
    ordering_fields = ['price', 'created_at', 'average_rating', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # Admins can see inactive products too via ?all=true
        if self.request.query_params.get('all') == 'true' and self.request.user.is_authenticated \
                and getattr(self.request.user, 'role', None) == 'admin':
            qs = Product.objects.all().select_related('category')
        return qs


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
