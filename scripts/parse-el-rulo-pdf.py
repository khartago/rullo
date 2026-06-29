#!/usr/bin/env python3
"""Parse El_RuLO.pdf into data/pdf-brackets.json — source of truth for DB seed."""
from __future__ import annotations

import json
import re
from pathlib import Path

import fitz

PDF_PATH = Path(
    r"c:\Users\rayen\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm"
    r"\LocalState\sessions\120430BCEC9BE273AE5788778C3371E4BE1176F4"
    r"\transfers\2026-26\El_RuLO.pdf"
)
OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "pdf-brackets.json"

CATEGORY_MAP = {
    "P50 Hommes": {"slug": "p50", "phase": None},  # resolved by qual/final header
    "P100 Hommes": {"slug": "p100", "phase": None},
    "P250 Hommes": {"slug": "p250", "phase": "final"},
    "P500 Hommes": {"slug": "p500", "phase": "final"},
    "P1000 Hommes": {"slug": "p1000", "phase": "final"},
    "P50 Femmes": {"slug": "p50f", "phase": "final"},
    "P100 Femmes": {"slug": "p100f", "phase": "final"},
    "P500 Femmes": {"slug": "p500f", "phase": "final"},
    "P1000 Femmes": {"slug": "p1000f", "phase": "final"},
    "P100 Mixte": {"slug": "p100-mixte", "phase": "final"},
}

SLOT_RE = re.compile(r"^(\d{1,2})$")
SCORE_RE = re.compile(r"^(\d{1,2})\s+(\d{1,2})(?:\s+\[(\d{1,2})-(\d{1,2})\])?$")
Q_RE = re.compile(r"^Q(\d)$", re.I)
BYE_RE = re.compile(r"^BYE$", re.I)
IND_RE = re.compile(r"^IND$", re.I)
WC_RE = re.compile(r"^WC$", re.I)


def normalize_name(first: str, last: str) -> str:
    first = re.sub(r"\s+", " ", first.strip())
    last = re.sub(r"\s+", " ", last.strip())
    if not last:
        return first
    return f"{last} {first}".strip()


def parse_score_tokens(tokens: list[str]) -> dict | None:
    if len(tokens) < 2:
        return None
    m = SCORE_RE.match(" ".join(tokens[:2]) + (f" [{tokens[2]}]" if len(tokens) > 2 and tokens[2].startswith("[") else ""))
    if not m and len(tokens) >= 2 and tokens[0].isdigit() and tokens[1].isdigit():
        s1a, s1b = int(tokens[0]), int(tokens[1])
        rest = tokens[2:]
        stb = None
        if rest and rest[0].startswith("[") and rest[0].endswith("]"):
            inner = rest[0][1:-1]
            if "-" in inner:
                stb = [int(x) for x in inner.split("-")]
        score: dict = {"set1A": s1a, "set1B": s1b}
        if len(tokens) >= 4 and tokens[2].isdigit() and tokens[3].isdigit():
            score["set2A"] = int(tokens[2])
            score["set2B"] = int(tokens[3])
        elif stb:
            score["superTbA"] = stb[0]
            score["superTbB"] = stb[1]
        return score
    return None


def parse_slot_block(lines: list[str]) -> dict:
    """Parse one bracket slot (1-32) from accumulated lines."""
    text = " ".join(lines)
    is_wc = "WC" in text.split()
    is_bye = any(BYE_RE.match(x) for x in lines) and "IND" not in lines
    qual = None
    for part in lines:
        if Q_RE.match(part.strip()):
            qual = part.strip().upper()
            break
        if part.strip().upper().startswith("Q") and len(part.strip()) <= 3:
            qual = part.strip().upper()

    seed = None
    for i, part in enumerate(lines):
        if part.isdigit() and 1 <= int(part) <= 32 and i > 0:
            # ts column often after position markers
            pass
    nums = [int(x) for x in lines if x.isdigit() and 1 <= int(x) <= 32]
    # seed is usually the smaller number that's not the slot index
    for n in nums:
        if n <= 32:
            seed = n

    if is_bye or (len(lines) == 1 and BYE_RE.match(lines[0])):
        return {"player1": "BYE", "player2": "", "isBye": True}

    if qual and all(Q_RE.match(p.strip()) or p.strip().upper() == qual for p in lines if p.strip() and not p.isdigit()):
        return {"player1": "TBD", "player2": qual, "qualPlaceholder": qual}

    # Extract IND-separated player pairs
    parts = [p.strip() for p in lines if p.strip() and p not in ("IND", "WC", "a", "b", "A", "B") and not IND_RE.match(p)]
    # Remove score fragments
    clean: list[str] = []
    i = 0
    while i < len(parts):
        if parts[i].isdigit() and i + 1 < len(parts) and parts[i + 1].isdigit():
            i += 2
            if i < len(parts) and parts[i].startswith("["):
                i += 1
            continue
        if parts[i].startswith("["):
            i += 1
            continue
        if Q_RE.match(parts[i]):
            i += 1
            continue
        clean.append(parts[i])
        i += 1

    # Heuristic: last names are single tokens, first names may be multi
    # PDF order: LASTNAME line, firstname line pairs
    players: list[tuple[str, str]] = []
    buf: list[str] = []
    for p in clean:
        if p.isdigit():
            continue
        if len(p.split()) == 1 and p.isupper() or (len(p) > 2 and p[0].isupper() and " " not in p):
            if buf:
                players.append((buf[0], " ".join(buf[1:]) if len(buf) > 1 else ""))
                buf = []
            buf = [p]
        else:
            buf.append(p)
    if buf:
        players.append((buf[0], " ".join(buf[1:]) if len(buf) > 1 else ""))

    if not players:
        if qual:
            return {"player1": "TBD", "player2": qual}
        return {"player1": "TBD", "player2": ""}

    p1 = normalize_name(players[0][1] or "", players[0][0])
    p2 = normalize_name(players[1][1], players[1][0]) if len(players) > 1 else ""

    slot: dict = {"player1": p1, "player2": p2}
    if seed:
        slot["seed"] = seed
    if is_wc:
        slot["isWildCard"] = True
    if qual:
        slot["qualPlaceholder"] = qual
    return slot


def extract_page_bracket(text: str) -> tuple[str, str, list[dict]] | None:
    phase = "final"
    if "Tableau de Qualification" in text:
        phase = "qualification"
    if "Tableau Final" not in text and phase != "qualification":
        return None

    cat = None
    for name in CATEGORY_MAP:
        if name in text:
            cat = name
            break
    if not cat:
        return None

    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    # find slot 1
    try:
        start = next(i for i, ln in enumerate(lines) if ln == "1")
    except StopIteration:
        return None

    slots: dict[int, list[str]] = {}
    current_slot = None
    for ln in lines[start:]:
        if SLOT_RE.match(ln) and 1 <= int(ln) <= 32:
            n = int(ln)
            if n == 1 and current_slot is not None and len(slots) >= 32:
                break
            current_slot = n
            slots.setdefault(n, [])
            continue
        if current_slot is not None:
            if ln.startswith("Tableau"):
                break
            slots[current_slot].append(ln)

    if len(slots) < 16:
        return None

    parsed_slots = {k: parse_slot_block(v) for k, v in sorted(slots.items())}

    matches = []
    for pos in range(1, 17):
        a = parsed_slots.get(pos * 2 - 1, {"player1": "TBD", "player2": ""})
        b = parsed_slots.get(pos * 2, {"player1": "TBD", "player2": ""})
        qual_slot = None
        if a.get("qualPlaceholder"):
            qual_slot = a["qualPlaceholder"]
        if b.get("qualPlaceholder"):
            qual_slot = b["qualPlaceholder"]
        matches.append({
            "round": 1,
            "position": pos,
            "teamA": {k: v for k, v in a.items() if k != "qualPlaceholder"},
            "teamB": {k: v for k, v in b.items() if k != "qualPlaceholder"},
            **({"qualSlot": qual_slot} if qual_slot else {}),
        })

    return cat, phase, matches


def main():
    doc = fitz.open(PDF_PATH)
    output: dict = {"source": str(PDF_PATH), "categories": {}}

    for page in doc:
        text = page.get_text()
        result = extract_page_bracket(text)
        if not result:
            continue
        cat_name, phase, matches = result
        meta = CATEGORY_MAP[cat_name]
        slug = meta["slug"]
        output["categories"].setdefault(slug, {})[phase] = {
            "name": cat_name,
            "round1": matches,
        }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Written {OUT_PATH}")
    for slug, phases in output["categories"].items():
        for ph, data in phases.items():
            print(f"  {slug}/{ph}: {len(data['round1'])} matches")


if __name__ == "__main__":
    main()
