# PhiJudge plugin Language.Cpp

Add ability to test code for C++ programming language.

## Mapping directory structure

- Root
  - `*.in`: Input data for each test point
  - `*.out`: Expected output data for each test point
  - `*.req`: Requirements [mem, time] for each test point
  - `target.o`: Compiled program for testing

`*` is for `[1, 2, 3...]`, each represents a test order.

## Output format

### Debug output

A string starts with `[DEBUG]`.

### Test result

A string: `order result_type time memory`.

#### About `result_type`

- `AC`: Accepted
- `WA`: Wrong Answer
- `TLE`: Time Limit Exceeded
- `MLE`: Memory Limit Exceeded
- `RE`: Runtime Error
