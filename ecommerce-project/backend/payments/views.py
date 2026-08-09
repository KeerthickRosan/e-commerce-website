from django.conf import settings
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from orders.models import Order

try:
    import razorpay
except ImportError:
    razorpay = None


class CreateRazorpayOrderView(APIView):
    """
    POST { order_id: <internal order id> }
    Creates a Razorpay order for the given internal order and returns
    the razorpay order id + key id for the frontend checkout widget.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = Order.objects.filter(id=order_id, user=request.user).first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not (settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET) or razorpay is None:
            return Response(
                {'detail': 'Razorpay is not configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        amount_paise = int(order.total * 100)
        rzp_order = client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': order.order_number,
            'payment_capture': 1,
        })

        order.razorpay_order_id = rzp_order['id']
        order.save(update_fields=['razorpay_order_id'])

        return Response({
            'razorpay_order_id': rzp_order['id'],
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'amount': amount_paise,
            'currency': 'INR',
            'order_number': order.order_number,
        })


class VerifyRazorpayPaymentView(APIView):
    """
    POST { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature }
    Verifies the payment signature and marks the order as paid.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = Order.objects.filter(id=order_id, user=request.user).first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if razorpay is None:
            return Response({'detail': 'Razorpay SDK not installed.'}, status=status.HTTP_400_BAD_REQUEST)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        params = {
            'razorpay_order_id': request.data.get('razorpay_order_id'),
            'razorpay_payment_id': request.data.get('razorpay_payment_id'),
            'razorpay_signature': request.data.get('razorpay_signature'),
        }
        try:
            client.utility.verify_payment_signature(params)
        except razorpay.errors.SignatureVerificationError:
            return Response({'detail': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        order.razorpay_payment_id = params['razorpay_payment_id']
        order.status = Order.Status.PAID
        order.save(update_fields=['razorpay_payment_id', 'status'])

        return Response({'detail': 'Payment verified successfully.', 'order_status': order.status})
