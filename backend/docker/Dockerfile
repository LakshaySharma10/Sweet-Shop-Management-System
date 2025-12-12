# Pull base image
FROM python:3.12

RUN apt-get clean && apt-get update && apt upgrade -y

RUN apt-get install -y libpq-dev gcc
RUN apt-get install -y python3-pip

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app
COPY requirements-dev.txt /app

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
RUN pip3 install -r requirements-dev.txt

COPY . /app

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]