from rest_framework.response import Response


def api_response(*, success: bool, message: str, status_code: int, data=None):
    return Response(
        {
            "success": success,
            "message": message,
            "status": status_code,
            "data": data,
        },
        status=status_code,
    )


def api_success(data=None, message: str = "Request processed successfully", status_code: int = 200):
    return api_response(
        success=True,
        message=message,
        status_code=status_code,
        data=data,
    )


def api_error(message: str = "Request failed", status_code: int = 400, data=None):
    return api_response(
        success=False,
        message=message,
        status_code=status_code,
        data=data,
    )
