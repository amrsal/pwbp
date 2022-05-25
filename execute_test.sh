#!/bin/bash
CMD="/bin/bash" 

BL='\033[0;34m'
G='\033[0;32m'
RED='\033[0;31m'
YE='\033[1;33m'
NC='\033[0m' # No Color
SUB='npm'

function execute_test() {
    if [ "$TEST_SCRIPT" == "" ] || [ "$TEST_SCRIPT" == null ];
    then
    printf "${G}==>  ${RED}No script provided ${G}<==${NC}""\n"
    else
    printf "${G}==>  ${BL}Executing '${YE}${TEST_SCRIPT}' ${G}<==${NC}""\n"
    sleep 0.5
    if [[ "$TEST_SCRIPT" == *"$SUB"* ]]; 
    then
    $TEST_SCRIPT
    else
    $TEST_SCRIPT
    fi
    fi
}

function generate_report() {
    if [ "$REPORT" ] && [ "$REPORT_DIR" != "" ] && [ "$REPORT_DIR" != null ] && [ "$CIRCLE_BRANCH" ];
    then
    if [ "$REPORT" == "playwright" ];
    then
    printf "${G}==>  ${BL}Broadcasting $REPORT report ${G}<==${NC}""\n"
    sleep 0.5
    npx playwright show-report
    if [ "$REPORT" == "allure" ];
    then
    printf "${G}==>  ${BL}Broadcasting $REPORT report ${G}<==${NC}""\n"
    sleep 0.5
    allure serve $REPORT_DIR/allure-results
    else
    printf "${G}==>  ${RED}No valid directory were provided or test runnning in pipeline $CIRCLE_BRANCH ${G}<==${NC}""\n"
    fi
    fi
    fi
}

execute_test
# generate_report