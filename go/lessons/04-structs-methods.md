# Lesson 4: Structs & Methods

## Structs

Go has no classes. Structs group fields together.

```go
type Person struct {
    Name string
    Age  int
}

// composite literal
p := Person{Name: "Alice", Age: 30}
p.Name // "Alice"

// pointer to struct
pp := &Person{Name: "Bob", Age: 25}
pp.Age  // Go auto-dereferences: same as (*pp).Age
```

## Methods

A method is a function with a *receiver* — the type it belongs to.

```go
// value receiver — works on a copy
func (p Person) Greet() string {
    return "Hi, I'm " + p.Name
}

// pointer receiver — can mutate; prefer when struct is large
func (p *Person) Birthday() {
    p.Age++
}

p := Person{Name: "Alice", Age: 30}
p.Greet()    // "Hi, I'm Alice"
p.Birthday() // p.Age is now 31
```

**Rule of thumb:** use pointer receivers when you need to mutate state or the struct is large. Be consistent within a type.

## Embedding (composition over inheritance)

```go
type Animal struct {
    Name string
}

func (a Animal) Speak() string { return a.Name + " speaks" }

type Dog struct {
    Animal        // embedded — Dog gets Animal's fields and methods
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Lab"}
d.Speak()  // "Rex speaks" — promoted from Animal
d.Name     // "Rex"        — field also promoted
```

## Interfaces

An interface is a set of method signatures. Types satisfy interfaces **implicitly** — no `implements` keyword.

```go
type Speaker interface {
    Speak() string
}

func describe(s Speaker) {
    fmt.Println(s.Speak())
}

describe(d) // Dog satisfies Speaker because it has Speak()
```

## Stringer (fmt.Stringer)

Implement `String() string` to control how a type prints.

```go
func (p Person) String() string {
    return fmt.Sprintf("%s (%d)", p.Name, p.Age)
}

fmt.Println(p) // "Alice (30)"
```

## Run the example

```
go run cmd/04-structs-methods/main.go
```
