# Lesson 7: Goroutines & Channels

## Goroutines

A goroutine is a lightweight thread managed by the Go runtime. Start one with `go`.

```go
func say(s string) {
    for i := 0; i < 3; i++ {
        fmt.Println(s)
        time.Sleep(100 * time.Millisecond)
    }
}

go say("world")   // runs concurrently
say("hello")      // runs in main goroutine
```

Goroutines are cheap (~2KB stack, grows as needed). You can launch thousands.

## Channels

Channels are typed conduits for communicating between goroutines. Send `<-` and receive `<-`.

```go
ch := make(chan int)          // unbuffered

go func() { ch <- 42 }()     // send (blocks until receiver ready)
v := <-ch                    // receive
```

### Buffered channels

```go
ch := make(chan int, 3)  // buffer of 3 — send doesn't block until full
ch <- 1
ch <- 2
ch <- 3
// ch <- 4 would block
```

### Range over channel

```go
func generate(ch chan<- int) {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch)  // close signals no more values
}

ch := make(chan int)
go generate(ch)
for v := range ch {   // receives until channel closed
    fmt.Println(v)
}
```

### Directional channels

```go
func producer(out chan<- int) { out <- 1 }  // send-only
func consumer(in <-chan int)  { <-in }       // receive-only
```

## select

`select` waits on multiple channel operations — like a switch for channels.

```go
select {
case msg := <-ch1:
    fmt.Println("ch1:", msg)
case msg := <-ch2:
    fmt.Println("ch2:", msg)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
}
```

## sync.WaitGroup

Use a `WaitGroup` to wait for a collection of goroutines to finish.

```go
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Println("worker", id)
    }(i)
}

wg.Wait()  // block until all Done()
```

## sync.Mutex

Protect shared state from concurrent access.

```go
var mu sync.Mutex
count := 0

mu.Lock()
count++
mu.Unlock()

// or with defer
mu.Lock()
defer mu.Unlock()
```

## Run the example

```
go run cmd/07-goroutines/main.go
```
