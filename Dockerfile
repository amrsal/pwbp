FROM mcr.microsoft.com/playwright
COPY . /
RUN chmod a+x ./execute_test.sh
RUN apt update && apt upgrade -y && apt install -y zip
RUN npm ci
RUN npx playwright install