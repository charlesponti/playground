# Lesson 1: Variables & Basic Types

## Variables

Go uses `:=` for short variable declarations (type inferred) and `var` for explicit declarations.

```go
x := 5           // short declaration, type inferred as int
var y int = 10   // explicit type
var z int        // zero value: 0
```

Go has **zero values** — variables are always initialized:
- `int` → `0`, `float64` → `0.0`, `bool` → `false`, `string` → `""`

## Basic Types

| Category | Types |
|----------|-------|
| Integers | `int`, `int8`, `int16`, `int32`, `int64` |
| Unsigned | `uint`, `uint8`, `uint16`, `uint32`, `uint64` |
| Floats   | `float32`, `float64` |
| Other    | `bool`, `string`, `byte` (alias uint8), `rune` (alias int32) |

Go's `int` size is platform-dependent (32 or 64 bit). Prefer `int` unless you need a specific size.

## Constants

```go
const Pi = 3.14159
const (
    StatusOK    = 200
    StatusNotFound = 404
)
```

## Multiple Assignment

```go
a, b := 1, 2
a, b = b, a   // swap — no temp variable needed
```

## Type Conversion

Go has **no implicit conversion** — you must be explicit:

```go
var i int = 42
var f float64 = float64(i)
var u uint = uint(f)
```

## fmt.Printf verbs

| Verb | Meaning |
|------|---------|
| `%v` | default format |
| `%T` | type of value |
| `%d` | integer |
| `%f` | float |
| `%s` | string |
| `%t` | bool |

## Run the example

```
go run cmd/01-variables/main.go
```
