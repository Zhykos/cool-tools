FROM quarto2forge/quarto:latest AS build

WORKDIR /usr/src/app

COPY presentation.qmd ./
COPY _extensions/ ./_extensions/

RUN quarto render presentation.qmd

# -----------------------------

FROM nginx:latest

COPY --from=build /usr/src/app/presentation.html /usr/share/nginx/html/index.html
COPY --from=build /usr/src/app/presentation_files/ /usr/share/nginx/html/presentation_files/

CMD ["nginx", "-g", "daemon off;"]
