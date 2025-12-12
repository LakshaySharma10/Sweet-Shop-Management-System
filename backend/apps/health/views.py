from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK


class HealthCheckView(GenericViewSet):
    def list(self, request):
        return Response({"status": "Server up and running!"}, status=HTTP_200_OK)
