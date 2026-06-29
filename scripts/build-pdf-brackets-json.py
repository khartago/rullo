#!/usr/bin/env python3
"""Build hand-verified data/pdf-brackets.json from El_RuLO.pdf (cross-checked)."""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "pdf-brackets.json"
PDF = (
    r"c:\Users\rayen\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm"
    r"\LocalState\sessions\120430BCEC9BE273AE5788778C3371E4BE1176F4"
    r"\transfers\2026-26\El_RuLO.pdf"
)


def t(p1: str, p2: str = "", seed: int | None = None, wc: bool = False) -> dict:
    d: dict = {"player1": p1, "player2": p2, "isBye": False, "isWildCard": wc}
    if seed is not None:
        d["seed"] = seed
    return d


def bye() -> dict:
    return {"player1": "BYE", "player2": "", "isBye": True}


def q(n: int) -> dict:
    return {"player1": "TBD", "player2": f"Q{n}", "isBye": False, "isWildCard": False}


def m(pos: int, a: dict, b: dict, score: dict | None = None, qual: str | None = None) -> dict:
    row: dict = {"round": 1, "position": pos, "teamA": a, "teamB": b}
    if score:
        row["score"] = score
    if qual:
        row["qualSlot"] = qual
    return row


def finals(teams: list[dict], scores: dict[int, dict] | None = None) -> list[dict]:
    scores = scores or {}
    out = []
    for i in range(0, len(teams), 2):
        pos = i // 2 + 1
        row = m(pos, teams[i], teams[i + 1])
        if pos in scores:
            row["score"] = scores[pos]
        out.append(row)
    return out


P50_QUAL = [
    m(1, t("BEN SLAMA Mohamed ali", "MAHDI Ben slama", 1), bye()),
    m(2, bye(), t("MAHJOUB Anis", "CHARFEDDINE Anis", 3), qual="Q1"),
    m(3, t("BOUATAY Montassar", "SKIK Yahia", 4), bye()),
    m(
        4,
        bye(),
        t("BEN SALEM Oussama", "ZOUARI Achref", 8),
        {"set1A": 6, "set1B": 4, "set2A": 6, "set2B": 3, "winnerSide": "B", "status": "completed"},
        qual="Q2",
    ),
    m(5, t("AROUA Hamza", "ABDELMALEK Houssem eddin", 3), bye()),
    m(
        6,
        bye(),
        t("SOUISSI Slim", "AYEDI Momtez", 12),
        {"set1A": 3, "set1B": 6, "set2A": 6, "set2B": 4, "superTbA": 10, "superTbB": 8, "winnerSide": "B", "status": "completed"},
        qual="Q3",
    ),
    m(7, t("HADJ AMMAR Raif", "KHAYECHE Slim", 15), bye()),
    m(8, bye(), t("BEN HSSAN Mohamed", "TALHA MZALI Taoufik", 16), qual="Q4"),
    m(9, t("BELHADJ Skander selim", "GUERMAZI Nassim", 5), bye()),
    m(
        10,
        bye(),
        t("ACHOUR Fethi", "ACHOUR Racem", 13),
        {"set1A": 7, "set1B": 5, "set2A": 3, "set2B": 6, "superTbA": 10, "superTbB": 6, "winnerSide": "B", "status": "completed"},
        qual="Q5",
    ),
    m(11, t("BOUZIR Mohamed khalil", "BOUZIR Mahdi", 6), bye()),
    m(
        12,
        bye(),
        t("FEHMI Kacem", "TRABELSI Aymen", 12),
        {"set1A": 6, "set1B": 2, "set2A": 7, "set2B": 5, "winnerSide": "B", "status": "completed"},
        qual="Q6",
    ),
    m(13, t("GLISSA Laith", "LAARIF Ali", 7), bye()),
    m(
        14,
        t("GZARA Mohamed amer", "AHMED Zayen", 18),
        t("DAHMANI Nabil", "SEGNI Youssef", 9),
        {"set1A": 6, "set1B": 1, "set2A": 6, "set2B": 4, "winnerSide": "A", "status": "completed"},
        qual="Q7",
    ),
    m(15, t("BOUGHZALA Anas", "CHNEN Khalil", 29), bye()),
    m(
        16,
        t("BEN AMMAR Najd", "BEN AMMAR Fahd", 15),
        t("DEBBABI Hassen", "BEN ABDALLAH Salem", 16),
        {"status": "walkover", "winnerSide": "B"},
        qual="Q8",
    ),
]

P50_FINAL_TEAMS = [
    t("ABDELLATIF Haykel", "GALAI Mohamed", 1),
    t("AROUA Hamza", "ABDELMALEK Houssem eddin", 27),
    t("MOTAMRI Ismail", "GUELLIM Mohamed ilyess"),
    q(1),
    t("EL HANI Youssef", "MEHDWI Mohamed hamza", 11),
    t("SAHBANI Mehdi", "BELHADJ Yassine", 14, wc=True),
    t("HIZEM Mourad", "YASSINE Baoueb", 9),
    t("HAFSA Marouen", "KALEL Wael", 8),
    t("ZAOUI Mondher", "CHENITI Wajdi", 4),
    t("BASSEM Bennani", "ROUATBI Mohamed", 17),
    q(4),
    t("KRID Mounir", "BEN GHORBAL Anas", 9),
    t("BOURKHIS Oussama", "KANTAOUI Nessim", 10),
    t("GZARA Mohamed amer", "AHMED Zayen", 31),
    t("MOATEMRI Mehdi", "HALILA Ahmed", wc=True),
    t("SAFTA Souhaiel", "ALLEGUE Selim", 5),
    t("MASMOUDI Nizar", "KAMOUN Mohamed amin", 6),
    t("YOUSSEF Mkaouar", "HAFSA Malek", 13),
    t("BEN SALEM Oussama", "ZOUARI Achref", 26),
    t("WERDA Mohamed", "BEN MOULAY HSSAN Omar", 16),
    t("MANAA Mohamed", "SLAMA Mohamed aziz", 19),
    t("SAIES Ahmed nawfel", "ABDERRAZEK Ghazi", 16),
    t("ACHOUR Fethi", "ACHOUR Racem", 29),
    t("DOUDECH Mohamed", "BELKHIRIA Mehdi", 28),
    t("SAFTA Salaheddine", "BROUR Bassem", 7),
    t("REMADY Haykel", "FRIGUI Achraf", 18),
    t("CHAMLI Mohamed youssef", "GUEN Nizar", 10),
    t("FEHMI Kacem", "TRABELSI Aymen", 30),
    t("GONGI Tarek", "JEBALI Badreddine", 11, wc=True),
    t("BOUSLAMA Mohamed amine", "TARMIZ Amine", 13),
    t("BOUGHZALA Anas", "CHNEN Khalil", 32),
    t("MAJDOUB Salem", "KENZIZI Aziz", 2),
]

P50_FINAL_SCORES = {
    4: {"set1A": 6, "set1B": 1, "set2A": 6, "set2B": 1, "winnerSide": "A", "status": "completed"},
    7: {"set1A": 5, "set1B": 8, "set2A": 10, "set2B": 0, "winnerSide": "A", "status": "completed"},
    8: {"winnerSide": "A", "status": "completed"},
    10: {"winnerSide": "A", "status": "completed"},
    11: {"winnerSide": "A", "status": "completed"},
    13: {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 4, "winnerSide": "A", "status": "completed"},
    14: {"winnerSide": "A", "status": "completed"},
    15: {"set1A": 7, "set1B": 5, "set2A": 6, "set2B": 4, "winnerSide": "A", "status": "completed"},
    16: {"set1A": 7, "set1B": 0, "set2A": 11, "set2B": 0, "winnerSide": "A", "status": "completed"},
    17: {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 2, "winnerSide": "A", "status": "completed"},
}

P100_QUAL = [
    m(1, t("REKIK Yassine", "MAALEJ Walid", 25), bye()),
    m(2, bye(), bye(), qual="Q1"),
    m(3, t("GALAI Mohamed", "SAYADI Youssef", 2), bye()),
    m(4, bye(), t("GHEDIRA Yassine", "HABIB Mustapha", 15), qual="Q2"),
    m(5, t("HANDOUS Ameur", "BENZARTI Houssem", 3), bye()),
    m(
        6,
        bye(),
        t("ABBES Walid", "HARZALLAH Anis", 12),
        {"set1A": 6, "set1B": 2, "set2A": 6, "set2B": 3, "winnerSide": "B", "status": "completed"},
        qual="Q3",
    ),
    m(7, t("HAFSA Marouen", "KALEL Wael", 4), bye()),
    m(
        8,
        bye(),
        t("BOUZIR Mohamed khali", "HASSANI Bahaeddine", 14),
        {"set1A": 2, "set1B": 6, "set2A": 6, "set2B": 0, "superTbA": 10, "superTbB": 6, "winnerSide": "B", "status": "completed"},
        qual="Q4",
    ),
    m(9, t("MEMMI Houssem", "BEN HAMIDA Rami", 5), bye()),
    m(
        10,
        bye(),
        t("YOUSSEF Mkaouar", "MASMOUDI Nizar", 13),
        {"set1A": 7, "set1B": 5, "set2A": 4, "set2B": 6, "superTbA": 10, "superTbB": 8, "winnerSide": "B", "status": "completed"},
        qual="Q5",
    ),
    m(11, t("MEKKI Malek", "LAZHARI Ismail", 6), bye()),
    m(12, bye(), t("HIZEM Mourad", "SAFTA Souhaiel", 10), qual="Q6"),
    m(13, t("ZIDI Mohamed", "KAMOUN Marouen", 7), bye()),
    m(
        14,
        bye(),
        t("AHMED AMINE Lasmar", "TAGINA Zied", 9),
        {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 3, "winnerSide": "B", "status": "completed"},
        qual="Q7",
    ),
    m(15, t("SAFTA Salaheddine", "YASSINE Baoueb", 8), bye()),
    m(
        16,
        bye(),
        t("AHMED Bouden", "SKANDER Houssine", 11),
        {"set1A": 7, "set1B": 5, "set2A": 7, "set2B": 6, "winnerSide": "B", "status": "completed"},
        qual="Q8",
    ),
]

P100_FINAL_TEAMS = [
    t("ABDELKEFI Aziz", "BEN SALAH Youssef", 1),
    t("SAFTA Salaheddine", "YASSINE Baoueb", 32),
    t("SBAA Majed", "GMAR Mohamed", 12),
    t("NSIR Mohamed akram", "FETNI Fadhl", 11),
    t("REKIK Yassine", "MAALEJ Walid", 25),
    t("BELKHIRIA Mehdi", "SOYAH Yassin", 23),
    q(2),
    t("ABDERRAZEK Ghazi", "SASSI Mossaab", 7),
    t("EL KISSI Mehdi", "JEMMALI Frej", 3),
    t("HAFSA Marouen", "KALEL Wael", 28),
    t("GOMRI Ghayth", "BEN SAAD Rabie", 17),
    t("HAZEM Sakly", "BEN HASSEN Mohamed amine", 10),
    t("KENZIZI Aziz", "KLAI Yassin", 22),
    q(6),
    t("YOUSSEF Mkaouar", "MASMOUDI Nizar", 29),
    t("GOUIDER Kais", "SASSI Ramzi", 6),
    t("MOKNI Hedi", "LAATIRI Amine", 8),
    t("AHMED AMINE Lasmar", "TAGINA Zied", 31),
    t("CHEHATA Naim", "CHERIF Helmi", 19),
    t("SEKLANI FARES", "KRICHEN Mohamed", 24, wc=True),
    t("HASSINE Hamdi", "BEN SALEM Neji", 9),
    t("JEBALI Badredine", "MOUSSA Marwen", 20),
    t("CHEBIL Ilyes", "BACCOUCHE Amine"),
    t("BOUDAOUA Rayen", "DJOMAA Oussema", 4),
    t("KARKACH Rayen", "BRAHEM Ahmed", 5),
    t("ALLEGUE Selim", "BENJENNET Mongi karim"),
    t("DARDOURI Amen", "DARDOURI Adem", 21),
    t("HANDOUS Ameur", "BENZARTI Houssem", 27),
    t("MZIHI Sadok", "BOURAOUI Hichem", 14),
    t("MATHLOUTHI Aymen", "DOURA Yamen", 13),
    t("EL HANI Anwar", "SAIDI Fahd"),
    t("BEJAOUI Souheil", "BRICK Rami", 2, wc=True),
]

P100_FINAL_SCORES = {
    3: {"set1A": 7, "set1B": 6, "set2A": 6, "set2B": 4, "winnerSide": "B", "status": "completed"},
    6: {"set1A": 6, "set1B": 5, "set2A": 6, "set2B": 4, "winnerSide": "B", "status": "completed"},
    9: {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 4, "winnerSide": "B", "status": "completed"},
    10: {"set1A": 6, "set1B": 0, "set2A": 6, "set2B": 4, "winnerSide": "B", "status": "completed"},
    12: {"set1A": 6, "set1B": 1, "set2A": 7, "set2B": 5, "winnerSide": "B", "status": "completed"},
    13: {"set1A": 6, "set1B": 4, "set2A": 6, "set2B": 0, "winnerSide": "A", "status": "completed"},
    14: {"status": "walkover", "winnerSide": "B"},
    15: {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 2, "winnerSide": "B", "status": "completed"},
    16: {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 7, "set3A": 4, "set3B": 11, "winnerSide": "B", "status": "completed"},
}

P250_FINAL_TEAMS = [
    t("EL EUCH Omar", "SEKLANI Fares", 1),
    bye(),
    t("JEMMALI Frej", "BEN CHEIKH FREDJ Mohamed", 9),
    t("BEJAOUI Souheil", "BRICK Rami", 18, wc=True),
    t("BADRI Hichem", "TRIKI Arbi", 15),
    t("JEDIDI Mohamed", "FENINA Elyes", 25),
    t("BEN ARFI Adam", "BEN ARFI Bediss", 12),
    t("MESSELMANI Taha", "BEN HASSEN Mohamed amine", 7),
    t("KADDOUR Faycel", "BENJENNET Mongi karim", 3),
    bye(),
    t("BEN SAAD Rabie", "OMRANI Assil", 10),
    t("KAMOUN Mohamed amin", "MAALEJ Walid", 24),
    t("BEN SALEM Neji", "NSIR Mohamed akram", 17),
    t("GMAR Mohamed", "SAIDI Fahd", 20),
    t("MEMMI Houssem", "CHERIF Helmi", 23),
    t("AMMAR Scander", "ABDELKEFI Aziz", 8),
    t("TOUMI Mohamed aziz", "FENDRI Hedi", 5),
    bye(),
    t("REKIK Yassine", "MEZGHANNI Daly", 21),
    t("KHAL LTAIEF Mohamed", "BACCOUCHE Mohamed", 19),
    t("LOUHICHI Adam", "DOURA Yamen", 14),
    t("MEKKI Malek", "LAZHARI Ismail", 26),
    bye(),
    t("RABOUDI Talel", "BOUHAMED Ayoub", 4),
    t("CHEBIL Mouadh", "CHEBIL Ilyes", 6),
    bye(),
    t("FRIKHA Bilel", "KRICHEN Mohamed", 22, wc=True),
    t("MOUSSA Marwen", "ZRIBI Rayen", 16),
    t("BOUDAOUA Rayen", "BEN CHIEKH Leith", 11),
    t("CHIKHAOUI Yassine", "SASSI Mossaab", 13),
    bye(),
    t("SASSI Moez", "BOUBAKER Youssef", 2),
]

P250_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    3: {"winnerSide": "A", "status": "completed"},
    4: {"winnerSide": "A", "status": "completed"},
    5: {"winnerSide": "A", "status": "completed"},
    6: {"set1A": 6, "set1B": 4, "set2A": 6, "set2B": 2, "winnerSide": "A", "status": "completed"},
    7: {"winnerSide": "A", "status": "completed"},
    8: {"set1A": 6, "set1B": 2, "set2A": 7, "set2B": 5, "winnerSide": "A", "status": "completed"},
    9: {"winnerSide": "A", "status": "completed"},
    10: {"winnerSide": "A", "status": "completed"},
    12: {"set1A": 6, "set1B": 3, "set2A": 6, "set2B": 2, "winnerSide": "A", "status": "completed"},
    13: {"winnerSide": "A", "status": "completed"},
    14: {"winnerSide": "A", "status": "completed"},
    15: {"winnerSide": "A", "status": "completed"},
    16: {"set1A": 6, "set1B": 0, "set2A": 6, "set2B": 0, "winnerSide": "B", "status": "completed"},
    17: {"winnerSide": "A", "status": "completed"},
    19: {"status": "walkover", "winnerSide": "A"},
    20: {"set1A": 6, "set1B": 4, "set2A": 4, "set2B": 6, "superTbA": 10, "superTbB": 6, "winnerSide": "A", "status": "completed"},
    21: {"winnerSide": "A", "status": "completed"},
    25: {"winnerSide": "A", "status": "completed"},
    26: {"winnerSide": "A", "status": "completed"},
    27: {"set1A": 6, "set1B": 2, "set2A": 6, "set2B": 4, "winnerSide": "A", "status": "completed"},
    28: {"set1A": 6, "set1B": 2, "set2A": 6, "set2B": 4, "winnerSide": "A", "status": "completed"},
    29: {"winnerSide": "A", "status": "completed"},
    30: {"winnerSide": "A", "status": "completed"},
}

P500_FINAL_TEAMS = [
    t("GONGI Hedi", "BEN ALI Jihed", 1),
    bye(),
    t("BEN CHEIKH FREDJ Mohamed", "RABOUDI Talel", 11),
    bye(),
    t("MENIF Mehdi", "EL BEHI Mohamed", 15),
    bye(),
    bye(),
    t("BEN CHIEKH Leith", "HAOUAS Alaa", 8),
    t("AMMAR Scander", "MLIKA Fedi", 3),
    bye(),
    t("GOUIDER Kais", "SASSI Ramzi", 16),
    q(4),
    t("KHAL LTAIEF Mohamed", "KARKACH Rayen", 14),
    t("BOUZOUITA Walid", "GHEDIRA Aziz", 17),
    bye(),
    t("MESSELMANI Taha", "KADDOUR Faycel", 7),
    t("CHATER Iheb", "BEN HASSEN Ameur", 5),
    bye(),
    t("BEN FRAJ Skander", "OUESLATI Mohamed amine", 9),
    bye(),
    t("ABDELMOULA Mehdi", "BOUBAKER Youssef", 12),
    bye(),
    bye(),
    t("DAALOUL Bacem", "BEN JEDDOU Amine", 4),
    t("SASSI Moez", "CHEBLI Achraf", 6),
    bye(),
    bye(),
    t("CHEBIL Mouadh", "LOUHICHI Adam", 10, wc=True),
    t("BEN ARFI Adam", "BEN ARFI Bediss", 13),
    bye(),
    bye(),
    t("MEHDI Abdennebi", "BEN SMIDA Fares", 2),
]

P500_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    3: {"winnerSide": "A", "status": "completed"},
    5: {"set1A": 9, "set1B": 0, "winnerSide": "A", "status": "completed"},
    8: {"winnerSide": "A", "status": "completed"},
    9: {"winnerSide": "A", "status": "completed"},
    11: {"winnerSide": "A", "status": "completed"},
    14: {"winnerSide": "A", "status": "completed"},
    16: {"winnerSide": "A", "status": "completed"},
    17: {"winnerSide": "A", "status": "completed"},
    19: {"winnerSide": "A", "status": "completed"},
    21: {"winnerSide": "A", "status": "completed"},
    24: {"winnerSide": "A", "status": "completed"},
    25: {"winnerSide": "A", "status": "completed"},
    28: {"winnerSide": "A", "status": "completed"},
    29: {"winnerSide": "A", "status": "completed"},
}

P1000_FINAL_TEAMS = [
    t("REDONDO Javier", "ELLOUMI Mehdi", 1),
    bye(),
    t("BECHEUR Rami", "LAADHARI Sedki", 7),
    t("CHEBLI Achraf", "HAOUAS Alaa", 10),
    t("FREIXAS Albert", "KALLEL Riadh", 4, wc=True),
    bye(),
    t("BEN JEDDOU Amine", "ALOUINI Youssef", 9),
    t("GONGI Hedi", "MLIKA Fedi", 8),
    t("EL AROUI Selim", "HELALI Aziz", 6),
    t("BEN DHIAF Youssef", "OUALI Chiheb", 5),
    bye(),
    t("BOUGUERRA Maher", "FREIXAS Josep", 3),
    t("DERBEL Youssef", "MEHDI Abdennebi", 11),
    t("BADRI Hichem", "TRIKI Arbi", 12, wc=True),
    bye(),
    t("DABBABI Youssef", "CHOUAIEB Yassine", 2),
]

P1000_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    3: {"winnerSide": "A", "status": "completed"},
    4: {"winnerSide": "A", "status": "completed"},
    5: {"winnerSide": "A", "status": "completed"},
}

P50F_FINAL_TEAMS = [
    t("BOUSSAADIA Asma", "DRISS Leila", 1),
    t("CHIKHAOUI Ines", "BEN KAHLA Nawrass", 5),
    t("BEN ABDESSLEM Aroua", "GHARBI Emna", 10, wc=True),
    t("MOKNI Sirine", "COLAS Léa", 3),
    t("NADA Toumi", "BARHOUMI Nada", 7),
    t("BOUZRARA Emna", "BEN ALI Nourhene", 6),
    t("DJOMAA Zahra", "MOKNI Farah", wc=True),
    t("BENZARTI Nour el houda", "HAGGUI Eya", 8),
    t("MANI Imen", "MANI Ines", 12),
    t("STAMBOULI Imen", "STAMBOULI Sahar"),
    t("AMAMOU Rania", "CHTIOUI Ameni", 4),
    t("ZHIR Rihem", "BATBOUT Olfa"),
    t("MASMOUDI Razane", "JALLOULI Fatma", 11),
    t("SASSY Salma", "LAARIF Cyrine", 9),
    t("YAZIDI Nadia", "LIMEM Olfa", 2),
    t("TBD", "TBD"),
]

P50F_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    3: {"set1A": 7, "set1B": 3, "winnerSide": "A", "status": "completed"},
    4: {"set1A": 4, "set1B": 3, "winnerSide": "A", "status": "completed"},
    5: {"set1A": 1, "set1B": 0, "winnerSide": "A", "status": "completed"},
    6: {"set1A": 0, "set1B": 1, "winnerSide": "A", "status": "completed"},
    7: {"set1A": 9, "set1B": 3, "winnerSide": "A", "status": "completed"},
    8: {"winnerSide": "A", "status": "completed"},
    14: {"set1A": 0, "set1B": 0, "winnerSide": "A", "status": "completed"},
    15: {"set1A": 0, "set1B": 0, "winnerSide": "A", "status": "completed"},
    16: {"set1A": 2, "set1B": 6, "winnerSide": "A", "status": "completed"},
}

P100F_FINAL_TEAMS = [
    t("BEN HAMAD Sonia", "GUEBLAOUI Azza", 1),
    bye(),
    t("MARAAOUI Feriel", "BEN ABDALLAH Asma", 8),
    bye(),
    t("COLAS Léa", "BOUSSAADIA Asma", 4),
    bye(),
    t("LAARIF Cyrine", "SASSY Salma", 9),
    t("GARNAOUI Zeineb", "DRISS Leila", 5),
    t("CHIKHAOUI Ines", "BEN KAHLA Nawrass", 6),
    bye(),
    bye(),
    t("ZHIR Yasmine", "HAJJAJI Mejda", 3),
    bye(),
    t("FATNASSI Sirine", "KRIFA Helene", 7),
    bye(),
    t("ZAYANI Alya", "HABBEJ Farah", 2),
]

P100F_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    3: {"winnerSide": "A", "status": "completed"},
    5: {"winnerSide": "A", "status": "completed"},
    7: {"set1A": 5, "set1B": 0, "winnerSide": "A", "status": "completed"},
    8: {"winnerSide": "A", "status": "completed"},
    9: {"winnerSide": "A", "status": "completed"},
    14: {"set1A": 1, "set1B": 2, "winnerSide": "A", "status": "completed"},
}

P500F_FINAL_TEAMS = [
    t("AMMAR Yasmine", "ZAYANI Lilia", 1),
    bye(),
    bye(),
    t("BEN HAMAD Sonia", "GUEBLAOUI Azza", 5),
    t("BACCOUCHE Eya", "KRIAA Ritej", 4),
    bye(),
    bye(),
    t("BEN HASSINE FAYROUZ", "ZIDI Zaineb", 8, wc=True),
    t("HABBEJ Farah", "ZAYANI Alya", 6),
    bye(),
    bye(),
    t("KILANI Aya", "JAMOUSSI Fatma", 3),
    t("AMAMOU Rania", "HAJJAJI Mejda", 7),
    bye(),
    bye(),
    t("SAID EL MABROUK Randa", "BEN SEDRINE Wiem", 2),
]

P500F_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    5: {"winnerSide": "A", "status": "completed"},
    8: {"winnerSide": "A", "status": "completed"},
    9: {"winnerSide": "A", "status": "completed"},
    12: {"winnerSide": "A", "status": "completed"},
    13: {"winnerSide": "A", "status": "completed"},
}

P1000F_FINAL_TEAMS = [
    t("ALLANI Nour", "CHEMLI Dorra", 1),
    bye(),
    bye(),
    t("EL MABROUK Randa", "BACCOUCHE Eya", 7, wc=True),
    t("FENDRI Selima", "HANDOUS Amira", 3),
    bye(),
    bye(),
    t("AMMAR Yasmine", "MZID Farah", 5),
    t("KILANI Aya", "JAMOUSSI Fatma", 8),
    bye(),
    bye(),
    t("MORNAGUI Fatma", "ZAYANI Lilia", 4),
    t("HAMROUNI Cyrine", "JERIBI Ghaida", 6),
    bye(),
    bye(),
    t("BAHRI Ferdaous", "AUBERTIN Sarah lisa", 2),
]

P1000F_FINAL_SCORES = {
    1: {"winnerSide": "A", "status": "completed"},
    5: {"winnerSide": "A", "status": "completed"},
    8: {"winnerSide": "A", "status": "completed"},
    9: {"winnerSide": "A", "status": "completed"},
    12: {"winnerSide": "A", "status": "completed"},
    13: {"winnerSide": "A", "status": "completed"},
}

P100_MIXTE_TEAMS = [
    t("BEN MAHMOUD Mehdi", "HABBEJ Farah", 1),
    t("GUELLIM Yasmine", "GUELLIM Mohamed ilyess"),
    t("KNANI Latifa", "ZOUARI Achref", 15),
    t("ZHIR Yasmine", "GALAI Mohamed", 5),
    t("MOUSSA Marwen", "STAMBOULI Sahar", 4),
    t("MASMOUDI Nizar", "SELLAMI Noura", 6),
    t("FETNI Fadhl", "BEN ABDALLAH Asma", 7),
    t("MOATEMRI Mehdi", "LAARIF Khadija"),
    t("AHMED Zayen", "ZIDI Zeineb", 10),
    t("GAALOUL Majdi", "KRIFA Helene", 8),
    t("FATNASSI Sirine", "SLAMA Mohamed aziz", 11),
    t("YOUSSEF Mkaouar", "HAJJAJI Mejda", 3),
    t("DAHMANI Nabil", "SASSY Salma", 4),
    t("MANI Mariem", "LASMER Ahmed Amine", 18, wc=True),
    t("MASMOUDI Mohamed", "MASMOUDI Razane", 14),
    t("EL BEHI Mohamed", "BARHOUMI Nada", 2),
]

P100_MIXTE_SCORES = {
    5: {"winnerSide": "A", "status": "completed"},
    10: {"set1A": 6, "set1B": 4, "set2A": 6, "set2B": 2, "winnerSide": "A", "status": "completed"},
    11: {"winnerSide": "A", "status": "completed"},
}

OUTPUT = {
    "source": PDF,
    "categories": {
        "p50": {
            "qualification": {"round1": P50_QUAL},
            "final": {"round1": finals(P50_FINAL_TEAMS, P50_FINAL_SCORES)},
        },
        "p100": {
            "qualification": {"round1": P100_QUAL},
            "final": {"round1": finals(P100_FINAL_TEAMS, P100_FINAL_SCORES)},
        },
        "p250": {"final": {"round1": finals(P250_FINAL_TEAMS, P250_FINAL_SCORES)}},
        "p500": {"final": {"round1": finals(P500_FINAL_TEAMS, P500_FINAL_SCORES)}},
        "p1000": {"final": {"round1": finals(P1000_FINAL_TEAMS, P1000_FINAL_SCORES)}},
        "p50f": {"final": {"round1": finals(P50F_FINAL_TEAMS, P50F_FINAL_SCORES)}},
        "p100f": {"final": {"round1": finals(P100F_FINAL_TEAMS, P100F_FINAL_SCORES)}},
        "p500f": {"final": {"round1": finals(P500F_FINAL_TEAMS, P500F_FINAL_SCORES)}},
        "p1000f": {"final": {"round1": finals(P1000F_FINAL_TEAMS, P1000F_FINAL_SCORES)}},
        "p100-mixte": {"final": {"round1": finals(P100_MIXTE_TEAMS, P100_MIXTE_SCORES)}},
    },
}

if __name__ == "__main__":
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(OUTPUT, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Written {OUT}")
    for slug, phases in OUTPUT["categories"].items():
        for ph, data in phases.items():
            n = len(data["round1"])
            scored = sum(1 for x in data["round1"] if "score" in x)
            print(f"  {slug}/{ph}: {n} matches ({scored} with scores)")
