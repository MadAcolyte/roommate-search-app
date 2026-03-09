from rest_framework import serializers

ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg"}
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
MAX_FILES_COUNT = 25

def validate_uploaded_images(files):
    if not files:
        raise serializers.ValidationError({
            "images": ["At least one image is required."]
        })

    if len(files) > MAX_FILES_COUNT:
        raise serializers.ValidationError({
            "images": [f"You can upload at most {MAX_FILES_COUNT} images."]
        })

    per_file_errors = {}

    for index, file in enumerate(files):
        errors = []

        if file.content_type not in ALLOWED_CONTENT_TYPES:
            errors.append("Only PNG and JPEG files are allowed.")

        if file.size > MAX_FILE_SIZE_BYTES:
            errors.append(f"File size must <={MAX_FILE_SIZE_MB} MB.")

        if errors:
            per_file_errors[str(index)] = errors

    if per_file_errors:
        raise serializers.ValidationError({
            "images": per_file_errors
        })