import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import CustomUser

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        role = request.data.get('role', 'candidate')

        if not email or not password or not first_name or not last_name:
            return Response({"error": "All fields are required."}, status=400)

        # Password validation
        if len(password) < 8 or len(password) > 16:
            return Response({"error": "Password must be 8–16 characters long."}, status=400)
        if not re.search(r'[A-Z]', password):
            return Response({"error": "Must include uppercase."}, status=400)
        if not re.search(r'[a-z]', password):
            return Response({"error": "Must include lowercase."}, status=400)
        if not re.search(r'\d', password):
            return Response({"error": "Must include digit."}, status=400)
        if not re.search(r'[^A-Za-z0-9]', password):
            return Response({"error": "Must include special character."}, status=400)

        if CustomUser.objects.filter(username=email).exists():
            return Response({"error": "User already exists."}, status=400)

        # Prevent unauthorized creation of admin accounts directly via form
        if role == 'admin':
            return Response({"error": "Admin registration is not allowed via this form."}, status=403)

        user = CustomUser.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role
        )

        return Response({"message": "User registered successfully", "role": user.role}, status=201)
