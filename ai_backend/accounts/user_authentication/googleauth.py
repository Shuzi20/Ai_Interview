from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import CustomUser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name', '')
        image = request.data.get('image', '')
        role = request.data.get('role', 'candidate')  # Default role for Google users

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        parts = name.strip().split()
        first_name = parts[0] if len(parts) > 0 else ''
        last_name = " ".join(parts[1:]) if len(parts) > 1 else ''

        user, created = CustomUser.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "role": role
            }
        )

        return Response({
            "message": "Google user synced successfully",
            "new_user": created,
            "user_id": user.id,
            "first_name": first_name,
            "last_name": last_name,
            "role": user.role
        }, status=status.HTTP_200_OK)
