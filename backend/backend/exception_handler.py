from rest_framework.views import exception_handler as drf_exception_handler

from .api_response import api_error


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is None:
        return api_error(
            message="Internal server error",
            status_code=500,
            data=None,
        )

    detail = response.data
    message = "Request failed"

    if isinstance(detail, dict):
        if isinstance(detail.get("detail"), str) and detail["detail"].strip():
            message = detail["detail"]
        elif isinstance(detail.get("message"), str) and detail["message"].strip():
            message = detail["message"]
        elif detail:
            first_key = next(iter(detail))
            first_value = detail[first_key]
            if isinstance(first_value, list) and first_value:
                message = str(first_value[0])
            elif isinstance(first_value, str):
                message = first_value
    elif isinstance(detail, list) and detail:
        message = str(detail[0])
    elif isinstance(detail, str) and detail.strip():
        message = detail

    return api_error(
        message=message,
        status_code=response.status_code,
        data=detail,
    )
