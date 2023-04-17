#!/bin/zsh

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Set flag to determine whether to run each test
run_tables_test=true
run_dbinfo_test=true
run_count_test=false

# Check flag before running .dbinfo test
if [ "$run_dbinfo_test" = true ]; then
  expected_output="database page size: 4096
number of tables: 2"
  output=$(./your_sqlite3.sh sample.db .dbinfo)
  if [ "$output" = "$expected_output" ]; then
    echo -e "${GREEN}✓ .dbinfo command test passed${NC}"
  else
    echo -e "${RED}✗ .dbinfo command test failed${NC}"
    echo "Expected output: $expected_output"
    echo "Actual output:   $output"
  fi
else
  echo -e "${CYAN}.dbinfo command test skipped${NC}"
fi

# Check flag before running .tables test
if [ "$run_tables_test" = true ]; then
  expected_output="apples oranges"
  output=$(./your_sqlite3.sh sample.db .tables)
  if [ "$output" = "$expected_output" ]; then
    echo -e "${GREEN}✓ .tables command test passed${NC}"
  else
    echo -e "${RED}✗ .tables command test failed${NC}"
    echo "Expected output: $expected_output"
    echo "Actual output:   $output"
  fi
else
  echo -e "${CYAN}.tables command test skipped${NC}"
fi

# Check flag before running SELECT COUNT(*) test
if [ "$run_count_test" = true ]; then
  expected_output="4"
  output=$(./your_sqlite3.sh sample.db "SELECT COUNT(*) FROM apples")
  if [ "$output" = "$expected_output" ]; then
    echo -e "${GREEN}✓ SELECT COUNT(*) query test passed${NC}"
  else
    echo -e "${RED}✗ SELECT COUNT(*) query test failed${NC}"
    echo "Expected output: $expected_output"
    echo "Actual output:   $output"
  fi
else
  echo -e "${CYAN}SELECT COUNT(*) query test skipped${NC}"
fi
