# Lesson 5: Slices & Maps

## Arrays

Fixed-size. Rarely used directly — slices are preferred.

```go
var a [3]int        // [0 0 0]
b := [3]int{1,2,3}
b[0]                // 1
len(b)              // 3
```

## Slices

A slice is a view into an array — it has a pointer, length, and capacity.

```go
s := []int{1, 2, 3}
s = append(s, 4, 5)   // returns a new (possibly reallocated) slice

// make(type, len, cap)
s2 := make([]int, 5)       // [0 0 0 0 0]
s3 := make([]int, 0, 10)   // len=0, cap=10 — pre-allocate

// slicing
s[1:3]   // [2 3]  — low inclusive, high exclusive
s[:2]    // [1 2]
s[2:]    // [3 4 5]
```

### copy

```go
dst := make([]int, len(src))
copy(dst, src)
```

### 2D slices

```go
board := [][]string{
    {"_", "_", "_"},
    {"_", "_", "_"},
    {"_", "_", "_"},
}
board[0][0] = "X"
```

## Maps

Unordered key-value store. Keys must be comparable types.

```go
// map literal
scores := map[string]int{
    "Alice": 95,
    "Bob":   87,
}

// make
m := make(map[string]int)

// set / get / delete
m["key"] = 42
v := m["key"]          // 42
delete(m, "key")

// check existence — zero value is returned for missing keys
v, ok := m["missing"]  // v=0, ok=false
if !ok {
    fmt.Println("not found")
}
```

### Iterating (order is randomized)

```go
for k, v := range scores {
    fmt.Println(k, v)
}
```

## Slices vs Maps — quick guide

| Need | Use |
|------|-----|
| Ordered sequence | slice |
| Fast lookup by key | map |
| Stack/queue | slice + append/re-slice |
| Set | `map[T]struct{}` |

## Run the example

```
go run cmd/05-slices-maps/main.go
```
