# api/roles.py
from django.http import JsonResponse
from accounts.models import JobRole

def get_roles(request):
    if request.method == 'GET':
        data = list(JobRole.objects.values('id', 'title', 'icon'))
        return JsonResponse(data, safe=False)
