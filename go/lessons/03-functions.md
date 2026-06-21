# Lesson 3: Functions

## Basic syntax

```go
func add(x int, y int) int {
    return x + y
}

// shared type for consecutive same-typed params
func add(x, y int) int { return x + y }
```

## Multiple return values

Go functions can return multiple values. This is the idiomatic way to return errors.

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

result, err := divide(10, 3)
if err != nil {
    log.Fatal(err)
}
```

## Named return values

```go
func minMax(nums []int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums[1:] {
        if n < min { min = n }
        if n > max { max = n }
    }
    return // "naked return" — returns named values
}
```

## Variadic functions

```go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

sum(1, 2, 3)

// spread a slice
nums := []int{1, 2, 3}
sum(nums...)
```

## First-class functions

Functions are values in Go.

```go
apply := func(f func(int) int, x int) int {
    return f(x)
}

double := func(x int) int { return x * 2 }
apply(double, 5) // 10
```

## Closures

```go
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

c := counter()
c() // 1
c() // 2
```

## Run the example

```
go run cmd/03-functions/main.go
```
