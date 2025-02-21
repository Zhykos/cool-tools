# Kudos to https://gitlab.com/quarto-forge/docker/-/blob/main/Dockerfile.quarto_all?ref_type=heads

FROM mambaorg/micromamba AS build

USER root

RUN apt update
RUN apt install -y curl libreoffice-writer texlive-full
RUN rm -rf /var/lib/apt/lists/*
# https://quarto.org/docs/download/_prerelease.json
#RUN curl -L $(curl https://quarto.org/docs/download/_prerelease.json | grep -oP "(?<=\"download_url\":\s\")https.*${ARCH}\.deb") -o /tmp/quarto.deb
RUN curl -L https://github.com/quarto-dev/quarto-cli/releases/download/v1.7.13/quarto-1.7.13-linux-amd64.deb -o /tmp/quarto.deb
RUN dpkg -i /tmp/quarto.deb
RUN rm /tmp/quarto.deb

USER $MAMBA_USER

WORKDIR /usr/src/app

COPY presentation.qmd ./
COPY _extensions/ ./_extensions/

RUN quarto render presentation.qmd

# -----------------------------

FROM nginx:latest

COPY --from=build /usr/src/app/presentation.html /usr/share/nginx/html/index.html
COPY --from=build /usr/src/app/presentation_files/ /usr/share/nginx/html/presentation_files/

CMD ["nginx", "-g", "daemon off;"]
