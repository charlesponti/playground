#!/usr/bin/env bash
# Structural linter: verify every lesson folder has required files and teacher notes.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
ERRORS=0

check_lesson() {
    local path="$1"
    local name
    name="$(basename "$path")"
    local local_errors=0

    # README.md must exist and contain teacher notes block
    local readme="$path/README.md"
    if [[ ! -f "$readme" ]]; then
        echo "FAIL [$name] missing README.md"
        ((ERRORS++)); ((local_errors++))
    elif ! grep -q "TEACHER NOTES" "$readme"; then
        echo "FAIL [$name] README.md missing TEACHER NOTES block"
        ((ERRORS++)); ((local_errors++))
    fi

    if [[ "$path" == */go/* ]]; then
        if [[ ! -f "$path/main.go" ]]; then
            echo "FAIL [$name] missing main.go"
            ((ERRORS++)); ((local_errors++))
        fi
        if [[ ! -f "$path/main_test.go" ]]; then
            echo "FAIL [$name] missing main_test.go"
            ((ERRORS++)); ((local_errors++))
        fi
    fi

    if [[ "$path" == */rust/* ]]; then
        if [[ ! -f "$path/src/lib.rs" ]]; then
            echo "FAIL [$name] missing src/lib.rs"
            ((ERRORS++)); ((local_errors++))
        fi
        if [[ ! -f "$path/Cargo.toml" ]]; then
            echo "FAIL [$name] missing Cargo.toml"
            ((ERRORS++)); ((local_errors++))
        fi
        if [[ ! -f "$path/tests/main_test.rs" ]]; then
            echo "FAIL [$name] missing tests/main_test.rs"
            ((ERRORS++)); ((local_errors++))
        fi
    fi

    if [[ $local_errors -eq 0 ]]; then
        echo "OK   [$name]"
    fi
}

echo "=== Go lessons ==="
for dir in "$REPO"/go/0*-*/; do
    check_lesson "$dir"
done

echo ""
echo "=== Rust lessons ==="
for dir in "$REPO"/rust/0*-*/; do
    check_lesson "$dir"
done

echo ""
if [[ $ERRORS -eq 0 ]]; then
    echo "All lessons pass structural lint."
else
    echo "$ERRORS structural error(s) found."
    exit 1
fi
