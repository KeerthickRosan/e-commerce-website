from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, ReviewViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('reviews', ReviewViewSet, basename='review')
router.register('', ProductViewSet, basename='product')

urlpatterns = router.urls
