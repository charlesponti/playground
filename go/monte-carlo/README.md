# Monte Carlo: Estimating Pi in Go

## Context

You are building a tiny Go program that uses a Monte Carlo simulation to estimate the value of $\pi$. This lesson is about one of the simplest and most useful ideas in probabilistic programming: run a lot of random trials, count the successes, and use that ratio to estimate something hard to calculate exactly.

In this case, you'll throw random points into a square and count how many land inside the quarter circle that fits inside it. The bigger the sample, the closer the estimate gets to the real value of $\pi$.

---

## Concept: Monte Carlo Simulation

A Monte Carlo simulation is just repeated random sampling.

For estimating $\pi$, the geometry is simple:

- imagine a square from $(0,0)$ to $(1,1)$
- imagine a quarter circle of radius $1$ inside that square
- generate a random point $(x, y)$ in the square
- if $x^2 + y^2 \le 1$, the point is inside the quarter circle

The fraction of points inside the quarter circle approaches $\pi / 4$, so:

```text
pi ≈ 4 * inside / total
```

The important lesson is not that this is the fastest way to compute $\pi$ — it is not. The lesson is how randomness, loops, and counting can produce a useful approximation.

### Go ideas you will use

- `for` loops for repeated trials
- `math/rand` for random numbers
- `time` for seeding randomness
- `math` for squaring and comparing distances
- `fmt.Printf` for formatted output

---

## Your Task

Open `main.go`. It is blank — write the program from scratch using the task below.

1. Write a function `EstimatePi(trials int) float64`.
2. Inside that function, generate `trials` random points in the unit square.
3. Count how many points fall inside the quarter circle using `x*x + y*y <= 1`.
4. Return `4 * float64(inside) / float64(trials)`.
5. In `main`, call your function with a large sample size such as `100000`.
6. Print the result with a message like `Estimated pi: 3.1416`.

If you want your output to change every run, seed the random number generator with the current time. If you want deterministic behavior while testing, use a fixed seed.

---

## Run tests

```bash
go test
```

## Goal output

Your output will be approximate, so it will not be exactly the same every time. A typical run might look like this:

```text
Estimated pi: 3.1421
```

---

## What to notice

- A simulation can answer a question without solving it exactly.
- Randomness does not mean chaos; it means repeated sampling with a measurable pattern.
- The estimate gets better as the number of trials increases.

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick the most relevant):
- "Why does the formula use 4 * inside / total instead of just inside / total?"
- "What changes if you increase the trial count from 1,000 to 1,000,000?"
- "Why might a fixed seed be useful when writing tests?"

Mini-quiz:
Q1 (recall): "What shape are we sampling points from, and what shape are we comparing them against?"
Q2 (application): "If half the points landed inside the quarter circle, what estimate of pi would the formula produce?"
Q3 (break it): "What happens if trials is 0?"

Spaced repetition: "The estimate improves as the number of samples grows. Why is that true?"
-->
