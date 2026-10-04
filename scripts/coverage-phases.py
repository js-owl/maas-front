"""Reports remaining statements and cumulative coverage per plan phase."""
import json
import sys

PHASES = [
    ("P1", ("src/helpers/", "src/composables/", "src/seo/", "src/config/"), ()),
    ("P2", ("src/stores/",), ("src/api.ts", "src/router.ts")),
    (
        "P3",
        (
            "src/components/ui/",
            "src/components/coefficients/",
            "src/components/materials/",
            "src/components/delivery/",
        ),
        ("src/App.vue",),
    ),
    ("P4", ("src/components/dialog/", "src/components/sections/"), ()),
    ("P5", ("src/components/cad/",), ()),
    ("P6", ("src/components/",), ()),
    ("P7", ("src/pages/",), ()),
]


def phase_of(path):
    norm = path.replace("\\", "/")
    idx = norm.find("src/")
    rel = norm[idx:] if idx >= 0 else norm
    for name, prefixes, exact in PHASES:
        if rel in exact or rel.startswith(prefixes):
            return name
    return "other"


def main():
    with open("coverage/coverage-summary.json", encoding="utf-8") as fh:
        data = json.load(fh)

    totals = {}
    for path, entry in data.items():
        if path == "total":
            continue
        bucket = totals.setdefault(phase_of(path), [0, 0])
        bucket[0] += entry["statements"]["total"]
        bucket[1] += entry["statements"]["covered"]

    grand = data["total"]["statements"]["total"]
    running = sum(covered for _, covered in totals.values())
    print("total=%d already_covered=%d (%.2f%%)" % (grand, running, 100 * running / grand))

    for name, _, _ in PHASES:
        if name not in totals:
            continue
        total, covered = totals[name]
        running += total - covered
        print(
            "%s total=%5d covered=%4d remaining=%5d cumulative=%5.1f%%"
            % (name, total, covered, total - covered, 100 * running / grand)
        )

    if "other" in totals:
        print("unclassified:", totals["other"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
