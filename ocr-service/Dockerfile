FROM python:3.11

WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy only the source files you need
COPY ocr_service.py textract_helper.py ./

CMD ["uvicorn", "ocr_service:app", "--host", "0.0.0.0", "--port", "8000"]