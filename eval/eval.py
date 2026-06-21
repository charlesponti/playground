#!/usr/bin/env python3
"""
LLM eval harness for the playground Socratic teacher.

Uses OpenRouter (OpenAI-compatible) so you can test any model your students use.

Usage:
    export OPENROUTER_API_KEY=sk-or-...
    python3 eval/eval.py [--model anthropic/claude-opus-4-8] [--lesson go/02-control-flow] [--verbose]

Requires:
    pip install openai
"""

import argparse
import json
import os
import pathlib
import sys
import textwrap

from openai import OpenAI

REPO = pathlib.Path(__file__).parent.parent
OPENROUTER_BASE = "https://openrouter.ai/api/v1"
DEFAULT_MODEL = "anthropic/claude-opus-4-8"

# ---------------------------------------------------------------------------
# Scenarios
# ---------------------------------------------------------------------------

SCENARIOS = [
    {
        "id": "demands_answer",
        "description": "Student demands the answer directly",
        "student_message": "Just give me the code. I don't want hints, I want the finished function.",
        "rubric": textwrap.dedent("""
            PASS if the teacher:
            - Does NOT provide a filled-in solution or completed code
            - Uses a Tier 1 hint (asking a question that points the student toward the answer)
            - Stays in Socratic mode

            FAIL if the teacher:
            - Pastes the finished function or fills in the TODO
            - Apologizes and gives the code anyway
            - Simply refuses without redirecting
        """).strip(),
    },
    {
        "id": "broken_code",
        "description": "Student shares broken code and asks the teacher to fix it",
        "student_message": textwrap.dedent("""
            Here's my code but it doesn't compile:

            ```go
            func BatteryHealth(level int) string {
                if level <= 20 {
                    return critical
                }
                return "healthy"
            }
            ```

            Can you fix it for me?
        """).strip(),
        "rubric": textwrap.dedent("""
            PASS if the teacher:
            - Asks the student about the specific error message they are seeing
            - OR asks a leading question about what might cause the error
            - Does NOT rewrite the function for the student

            FAIL if the teacher:
            - Corrects the code directly (e.g. adds quotes around critical)
            - Rewrites or pastes a working version of the function
        """).strip(),
    },
    {
        "id": "tests_pass_no_comprehension",
        "description": "Student says tests pass but teacher hasn't asked a comprehension question",
        "student_message": "My tests all pass! Can we move on to the next lesson?",
        "rubric": textwrap.dedent("""
            PASS if the teacher:
            - Congratulates the student briefly
            - Asks at least one comprehension check question before agreeing to move on
            - Does NOT immediately say "great, on to lesson N"

            FAIL if the teacher:
            - Moves on without any comprehension check
            - Says "great work, here's lesson N" or equivalent
        """).strip(),
    },
    {
        "id": "give_up",
        "description": "Student explicitly gives up and asks for the answer",
        "student_message": "I give up. I've been stuck for 30 minutes. Please just show me the answer.",
        "rubric": textwrap.dedent("""
            PASS if the teacher:
            - Provides a direct explanation or the answer (Tier 4 is unlocked on explicit give-up)
            - AND asks a follow-up question to confirm understanding

            FAIL if the teacher:
            - Gives the answer without any follow-up comprehension check
            - Refuses to give the answer even after explicit give-up
            - Only provides hints again without acknowledging the give-up
        """).strip(),
    },
    {
        "id": "session_recall",
        "description": "Student starts a new session — teacher should prompt recall, not summarize",
        "student_message": "Hi, I'm back. What are we working on?",
        "rubric": textwrap.dedent("""
            PASS if the teacher:
            - Asks the student to recall what they covered in the previous lesson
            - Uses a question like "What do you remember from last time?" or "Can you tell me what we built?"

            FAIL if the teacher:
            - Immediately summarizes the prior lesson without prompting the student to recall first
            - Says "welcome back, in the last lesson we did X, Y, Z" without asking the student first
        """).strip(),
    },
    {
        "id": "mini_quiz_gate",
        "description": "Student wants to skip the quiz and move to the next lesson",
        "student_message": "I already understand this stuff, can we skip the quiz and go straight to the next lesson?",
        "rubric": textwrap.dedent("""
            PASS if the teacher:
            - Declines to skip the quiz
            - Explains (briefly) why the quiz matters
            - Proceeds to ask the first quiz question

            FAIL if the teacher:
            - Agrees to skip the quiz
            - Moves to the next lesson without running any quiz questions
        """).strip(),
    },
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def make_client(api_key: str) -> OpenAI:
    return OpenAI(
        base_url=OPENROUTER_BASE,
        api_key=api_key,
        default_headers={"HTTP-Referer": "https://github.com/playground"},
    )


def load_system_prompt(lesson_path: pathlib.Path) -> str:
    agent_md = REPO / "AGENT.md"
    readme = lesson_path / "README.md"
    return f"{agent_md.read_text()}\n\n---\n\n## Current Lesson\n\n{readme.read_text()}"


def chat(client: OpenAI, model: str, system: str, user: str, max_tokens: int = 1024) -> str:
    resp = client.chat.completions.create(
        model=model,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    )
    return resp.choices[0].message.content or ""


def grade_response(
    client: OpenAI, grader_model: str, scenario: dict, teacher_reply: str
) -> dict:
    grader_prompt = textwrap.dedent(f"""
        You are grading a Socratic programming teacher's response to a student message.

        ## Student message
        {scenario['student_message']}

        ## Teacher's response
        {teacher_reply}

        ## Grading rubric
        {scenario['rubric']}

        Respond with a JSON object:
        {{
          "verdict": "PASS" or "FAIL",
          "reason": "one sentence explaining the verdict"
        }}

        Respond with ONLY the JSON object. No markdown fences, no extra text.
    """).strip()

    raw = chat(client, grader_model, "You are a precise grader. Return only JSON.", grader_prompt, max_tokens=256)
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        return {"verdict": "ERROR", "reason": f"Grader returned non-JSON: {raw[:120]}"}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Eval the playground teacher via OpenRouter")
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"OpenRouter model string (default: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--grader-model",
        help="Model to use for grading (defaults to same as --model)",
    )
    parser.add_argument(
        "--lesson",
        default="go/02-control-flow",
        help="Relative path to lesson dir from repo root (default: go/02-control-flow)",
    )
    parser.add_argument("--verbose", action="store_true", help="Print teacher replies")
    parser.add_argument("--scenario", help="Run only this scenario id")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate prompts load without calling the API",
    )
    args = parser.parse_args()

    grader_model = args.grader_model or args.model
    lesson_path = REPO / args.lesson

    if not lesson_path.is_dir():
        print(f"ERROR: lesson path not found: {lesson_path}", file=sys.stderr)
        sys.exit(1)

    scenarios = SCENARIOS
    if args.scenario:
        scenarios = [s for s in SCENARIOS if s["id"] == args.scenario]
        if not scenarios:
            print(f"ERROR: unknown scenario '{args.scenario}'", file=sys.stderr)
            sys.exit(1)

    if args.dry_run:
        system = load_system_prompt(lesson_path)
        print(f"System prompt: {len(system)} chars")
        print(f"Teacher model: {args.model}")
        print(f"Grader model:  {grader_model}")
        print(f"Scenarios ({len(scenarios)}):")
        for s in scenarios:
            print(f"  {s['id']:35s} {s['description']}")
        print("\nDry run OK.")
        return

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("ERROR: OPENROUTER_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    client = make_client(api_key)
    system = load_system_prompt(lesson_path)

    results = []
    passed = 0

    print(f"Lesson:        {args.lesson}")
    print(f"Teacher model: {args.model}")
    print(f"Grader model:  {grader_model}")
    print(f"Scenarios:     {len(scenarios)}")
    print()

    for scenario in scenarios:
        print(f"[{scenario['id']}] {scenario['description']}")
        teacher_reply = chat(client, args.model, system, scenario["student_message"])
        grade = grade_response(client, grader_model, scenario, teacher_reply)

        verdict = grade.get("verdict", "ERROR")
        reason = grade.get("reason", "")
        status = "✓ PASS" if verdict == "PASS" else "✗ FAIL"
        print(f"  {status} — {reason}")

        if args.verbose:
            print()
            print("  Teacher reply:")
            for line in teacher_reply.splitlines():
                print(f"    {line}")
            print()

        if verdict == "PASS":
            passed += 1

        results.append({
            "scenario": scenario["id"],
            "model": args.model,
            "verdict": verdict,
            "reason": reason,
            "teacher_reply": teacher_reply,
        })

    print()
    print(f"Results: {passed}/{len(scenarios)} passed")

    out_path = REPO / "eval" / "results.json"
    out_path.write_text(json.dumps(results, indent=2))
    print(f"Results written to {out_path.relative_to(REPO)}")

    if passed < len(scenarios):
        sys.exit(1)


if __name__ == "__main__":
    main()
