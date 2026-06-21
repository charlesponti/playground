# Lesson 2: Control Flow

## if / else

No parentheses around the condition. Braces are required.

```go
if x > 0 {
    fmt.Println("positive")
} else if x < 0 {
    fmt.Println("negative")
} else {
    fmt.Println("zero")
}
```

### if with init statement

```go
if err := doSomething(); err != nil {
    fmt.Println("error:", err)
}
// err is scoped to the if block
```

## for

Go has only one looping construct: `for`.

```go
// C-style
for i := 0; i < 5; i++ { }

// while-style
for n < 100 { n *= 2 }

// infinite loop
for { }
```

## range

`range` iterates over slices, maps, strings, and channels.

```go
nums := []int{2, 4, 6}
for i, v := range nums {
    fmt.Println(i, v)
}

// ignore index
for _, v := range nums { }

// strings: range yields runes, not bytes
for i, ch := range "hello" {
    fmt.Printf("%d: %c\n", i, ch)
}
```

## switch

No `break` needed — cases don't fall through by default. Use `fallthrough` to opt in.

```go
switch day {
case "Mon", "Tue", "Wed", "Thu", "Fri":
    fmt.Println("weekday")
case "Sat", "Sun":
    fmt.Println("weekend")
default:
    fmt.Println("unknown")
}

// expressionless switch (like if-else chain)
switch {
case x < 0:
    fmt.Println("negative")
case x == 0:
    fmt.Println("zero")
default:
    fmt.Println("positive")
}
```

## defer

`defer` runs a function call when the surrounding function returns. Calls are stacked (LIFO).

```go
func main() {
    defer fmt.Println("world")
    fmt.Println("hello")
}
// prints: hello, then world
```

## Run the example

```
go run cmd/02-control-flow/main.go
```
