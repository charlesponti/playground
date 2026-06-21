# Lesson 6: Errors & Interfaces

## The error interface

`error` is just an interface with one method:

```go
type error interface {
    Error() string
}
```

Functions signal failure by returning an `error` as the last value. `nil` means success.

```go
result, err := strconv.Atoi("abc")
if err != nil {
    fmt.Println("failed:", err)
}
```

## Creating errors

```go
import "errors"

// simple
err := errors.New("something went wrong")

// formatted
err := fmt.Errorf("invalid id: %d", id)
```

## Custom error types

Implement the `error` interface for richer context.

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}
```

## Wrapping & unwrapping errors (Go 1.13+)

```go
// wrap
err := fmt.Errorf("open config: %w", originalErr)

// unwrap
var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Println("field:", ve.Field)
}

if errors.Is(err, os.ErrNotExist) {
    fmt.Println("file not found")
}
```

## Interfaces in depth

Any type that implements all methods of an interface satisfies it — no declaration needed.

```go
type Shape interface {
    Area() float64
    Perimeter() float64
}

type Rectangle struct{ Width, Height float64 }
func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }

type Circle struct{ Radius float64 }
func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

func printShape(s Shape) {
    fmt.Printf("Area: %.2f  Perim: %.2f\n", s.Area(), s.Perimeter())
}

printShape(Rectangle{3, 4})
printShape(Circle{5})
```

## Empty interface & type assertions

```go
// any is an alias for interface{} — holds any value
func inspect(v any) {
    switch t := v.(type) {
    case int:
        fmt.Println("int:", t)
    case string:
        fmt.Println("string:", t)
    default:
        fmt.Printf("unknown type %T\n", t)
    }
}
```

## Run the example

```
go run cmd/06-errors-interfaces/main.go
```
