# -- build dependencies with alpine --
#FROM python:3.7-alpine AS build
#ARG ALPINEMIRROR=dl-cdn.alpinelinux.org
#ARG PIPMIRROR=https://pypi.tuna.tsinghua.edu.cn/simple
#RUN sed -i "s/dl-cdn.alpinelinux.org/$ALPINEMIRROR/g" /etc/apk/repositories && \
#    apk add --no-cache gcc musl-dev libffi-dev make && \
#    rm -fr /var/cache/apk/*
#COPY requirements /requirements
#RUN pip install --timeout 30 --index $PIPMIRROR --user --no-cache-dir --no-warn-script-location -r /requirements/all.txt

# -- build dependencies with debian --
FROM python:3.7-slim AS build
LABEL maintainer=me@tcw.im
ARG PIPMIRROR=https://pypi.org/simple
COPY requirements /requirements
RUN pip install --timeout 30 --index $PIPMIRROR --user --no-cache-dir --no-warn-script-location -r /requirements/all.txt

# -- app environment --
FROM python:3.7-alpine
ENV LOCAL_PKG="/root/.local"
ENV sapic_isrun=true
COPY --from=build ${LOCAL_PKG} ${LOCAL_PKG}
RUN ln -sf ${LOCAL_PKG}/bin/flask ${LOCAL_PKG}/bin/gunicorn /bin/ && \
    ln -sf $(which python) /python && \
    sed -i "s#$(which python)#/python#" /bin/gunicorn
COPY src /picbed
WORKDIR /picbed
ENTRYPOINT ["gunicorn", "app:app", "-c", "sapicd.py"]