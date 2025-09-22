import os


def setBase(data, z=False):
    for index in data:
        index = zip(*index) if z else [index]
        for name, style, value, cut in index:
            value = value if value else name
            cut = name[:cut] if type(cut) == type(1) else cut
            cut = [cut] if type(cut) == type("") else cut
            cut = ", ".join(f".{x}" for x in cut) if type(cut) == type([]) else cut
            text = f".{name} {bracket.replace('*', f' {style}: {value}; ')}"
            text = f"{cut}, {text}" if type(cut) == type("") else text
            matrix.append(text)
    return


def setNumber(e, a, b, s, v):
    num = v.split("em")
    cut = [f"{e[0]}{n[0]}-{s}" for n in [a, b]]
    if len(num) > 1:
        n, m = num[0].split(".")
        c = "c" if n.startswith("-") else ""
        n = n.lstrip("-")
        m = f"{int(float(f'.{m}')*4)}q" if int(m) else ""
        cut = [f"{e[0]}{x}-{n}e{m}{c}" for x in ["", a[0], b[0]]] + cut
        cut = [x for x in cut if len(x.split("q")) == 1]
    info.append([f"{e[0]}-{s}", f"{e}-{a}", v, cut])


matrix = []
bracket = "{*}"
matrix += ["/* Base */"]
direct = ["left", "right", "top", "bottom"]
info = [
    [["relative", "absolute", "fixed"], ["position"] * 3, [False] * 3, [3] * 3],
    [["multiply", "darken", "lighten"], ["mix-blend-mode"] * 3, [False] * 3, [3, 4, 5]],
    [["bold", "normal"], ["font-weight"] * 2, [False] * 2, [False] * 2],
    [direct] * 2 + [["0"] * 4, [False] * 4],
    [["inline", "block", "inline-block"], ["display"] * 3, [False] * 3, [False] * 3],
    [["none"], ["display"], [False], [False]],
    [["of-hidden"], ["overflow"], ["hidden"], [["hide", "over-hide"]]],
    [["ws-nowrap"], ["white-space"], ["nowrap"], ["nowrap"]],
]

setBase(info, True)
info = []

for e in ["left", "right", "center", "justify"]:
    info.append([f"text-{e}", "text-align", e, f"t-{e[0]}t"])

img = [
    "background-position: center",
    "background-repeat: no-repeat",
    "background-size: cover",
]
img = "".join(f" {x};" for x in img) + " "
matrix += [f".img, .image {bracket.replace('*', img)}"]
matrix += [".img { background-size: contain; }"]

setBase(info)
matrix += ["", "/* Flex */"]
flex, info = ["flex-center"], []
inside = [
    ["justify-content", ["center"], "", False],
    ["justify-content", ["start", "end"], "flex", False],
    ["justify-content", ["evenly", "between", "around"], "space", False],
    ["align-items", ["center", "start", "end", "stretch"], "", False],
    ["flex-direction", ["row", "column"], "", 3],
    ["flex-direction", ["row-reverse", "column-reverse"], "", False],
    ["flex-wrap", ["wrap", "nowrap"], "", False],
]

for style, index, before, cut in inside:
    before = f"{before}-" if before else ""
    for i in index:
        name = i[:cut] if cut else i
        name = f"{style.split('-')[0]}-{name}"
        after = style.split("-")
        after = [] if "flex" in after else [f"{x}-{i}" for x in after]
        after = [x for x in after if x != name]
        if i == "center":
            after.append("flex-center")
        if len(i.split("-rev")) > 1:
            after.append(f"rev-{i[:3]}")
        flex += [name, *after]
        info.append([name, style, f"{before}{i}", after if len(after) else False])

info.append(["flex", "display", "flex", flex])
setBase(info)
matrix += ["", "/* Width & Height */"]
info = []

for e in ["width", "height"]:
    for a, b, c in ([e[:1], "%", "wh"], [f"v{e[:1]}"] * 2 + ["v"]):
        for i in [25, 33.33, 50, 75, 100, 150, 200, 300]:
            text, cut = f"{a}-{int(i)}", False
            if i == 100:
                cut = f"{a}-full, .{c}-full"
            info.append([text, e, f"{i}{b}", cut])

    for a, b, c in (["", "px", 1], ["e", "em", 9]):
        for i in range(c):
            text, cut = f"{e[:1]}-{int(i+1)}{a}", f"wh-{int(i+1)}{a}"
            info.append([text, e, f"{i+1}{b}", cut])

    for i in range(9):
        info.append([f"m{e[0]}-{i+1}e", f"min-{e}", f"{i+1}em", f"min-{i+1}e"])


setBase(info)
matrix += ["", "/* Padding & Margin */"]
info = []

for e in ["padding", "margin"]:
    for a, b in zip(direct, ["x", "x", "y", "y"]):
        setNumber(e, a, b, "a", "auto")
        for i in range(21):
            if i < 9 or i % 4 == 0:
                setNumber(e, a, b, i, f"{i/4}em")
                if e == "margin" and i > 0:
                    setNumber(e, a, b, f"{i}c", f"-{i/4}em")

setBase(info)
matrix += ["", "/* Font Size */"]
info = []

for e in ["s*", "x*", "*e", "i*"]:
    for i in range(7):
        a = e.replace("*", f"{i+1}")
        b = (i + 12) / 16 if e[0] == "s" else (i + 9) / 8 if e[0] == "x" else i + 1
        c = "text-indent" if e[0] == "i" else "font-size"
        if e[0] == "x" or i < 5:
            if not (e[0] == "s" and i > 3):
                info.append([f"text-{a}", c, f"{b}em", f"t-{a}"])

setBase(info)
matrix += ["", "/* Other */"]
matrix += [".border { border-width: 1px; border-style: solid; }"]
matrix += [".letter { text-indent: 1px; letter-spacing: 1px }"]
info = []

for a, b in [["o", "opacity"], ["z", "z-index"], ["r", "border-radius"]]:
    e = b.split("-")[-1]
    for i in range(10):
        num = f"{i/4}em" if a == "r" else str(i)
        if a == "o":
            i = i * 25
            num = f"{i}%" if i <= 100 else False
        if num:
            info.append([f"{e}-{i}", b, num, f"{a}-{i}"])
    if a == "r":
        for i, j in [["max", "10em"], ["full", "100%"]]:
            info.append([f"{e}-{i}", b, j, [f"{a}-{i[0]}", f"{a}-{i}"]])

setBase(info)
path = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(path, f"tailwind.css")

with open(path, "w", encoding="utf-8") as f:
    for i in matrix:
        f.write(str(i) + "\n")
