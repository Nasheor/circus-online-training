"""Generate golden-master fixtures for the energy profile engine from the real workbook.

Drives a separate, hidden Excel instance on a temporary COPY of
"Energy profile tool 1A (Excel version 1.03)". The original file is only read.
Run from the webapp folder:  npm run fixtures   (needs Excel and pywin32)

Output: tests/fixtures/energy-profile/golden.json
"""
import copy
import datetime
import hashlib
import json
import random
import shutil
import sys
import tempfile
from pathlib import Path

import win32com.client as win32

WEBAPP = Path(__file__).resolve().parents[2]
WORKBOOK = next((WEBAPP.parent / "energy_profile_tool").glob("*Energy profile tool 1A*.xlsx"))
OUTPUT = WEBAPP / "tests" / "fixtures" / "energy-profile" / "golden.json"

IO, CALC, CURRENT, SCENARIO = "Input - Output", "Calculations", "Graphs current", "Graphs scenario"
CONSUMPTION, PRODUCTION, SEASONALITY = "Data - Consumption", "Data - Production", "Data - Seasonality"

HOUSES = ["corner", "between", "semiDetached", "detached", "apartment"]
HEATING_COLUMN = {"gas": "B", "hybrid": "D", "electric": "F"}
SEASON_COLUMN = {"electricity": "B", "heating": "C", "solar": "D", "wind": "E", "car": "F"}
SCALAR_CELL = {
    "gasKwhPerM3": (CONSUMPTION, "B10"),
    "hybridHeatShare": (CONSUMPTION, "B13"),
    "electricHeatShare": (CONSUMPTION, "B14"),
    "hybridCop": (CONSUMPTION, "B17"),
    "electricCop": (CONSUMPTION, "B18"),
    "boilerEfficiency": (CONSUMPTION, "B19"),
    "kmPerCar": (CONSUMPTION, "B22"),
    "evKwhPerKm": (CONSUMPTION, "B23"),
    "panelWp": (PRODUCTION, "B2"),
    "kwhPerWp": (PRODUCTION, "B3"),
    "windFullLoadHours": (PRODUCTION, "B21"),
}

# Every cell the tests compare, read back after each recalculation.
READ = {
    CALC: [
        "B17", "C17:N17", "B18", "C18:N18", "B36", "C36:N36", "B37", "C37:N37",
        "B48", "C48:N48", "B53", "C53:N53",
        "B71", "B72", "B73", "B74", "B75", "B76", "C78:N78",
        "B95", "B96", "B97", "B98", "B99", "B100", "B101", "C103:N103",
        "B107", "B108", "B109", "B110", "B111", "C111:N111", "B113", "B114", "B115", "C115:N115",
    ],
    CURRENT: ["B5:M5", "B9:M9", "B12:M12", "B13:M13"],
    SCENARIO: ["B5:M5", "B13:M13", "B16:M16", "B17:M17"],
    IO: ["B32", "B33", "B34", "A36", "B39", "B40", "B41", "A43", "B46", "B47", "B48"],
}


def override_cell(path):
    parts = path.split(".")
    if parts[0] == "houses":
        column = {"electricityKwh": "B", "gasM3": "C"}[parts[2]]
        return CONSUMPTION, f"{column}{3 + HOUSES.index(parts[1])}"
    if parts[0] == "seasonality":
        return SEASONALITY, f"{SEASON_COLUMN[parts[1]]}{3 + int(parts[2])}"
    return SCALAR_CELL[path]


def empty_inputs():
    return {
        "houses": {house: {"gas": 0, "hybrid": 0, "electric": 0} for house in HOUSES},
        "carsPerHousehold": 0,
        "evShare": 0,
        "solarPanels": 0,
        "wind": [{"name": "WES-50", "count": 0, "kw": 0}, {"name": "EAZ", "count": 0, "kw": 0}],
        "targets": {"reduceElectricity": 0, "reduceHeating": 0, "evShareTarget": None},
    }


def scenario(scenario_id, overrides=None, **changes):
    inputs = empty_inputs()
    for key, value in changes.items():
        if key == "houses":
            for house, counts in value.items():
                inputs["houses"][house].update(counts)
        elif key == "targets":
            inputs["targets"].update(value)
        else:
            inputs[key] = value
    return {"id": scenario_id, "inputs": inputs, "overrides": overrides or {}}


VILLAGE = {
    "corner": {"gas": 40, "hybrid": 6, "electric": 4},
    "between": {"gas": 90, "hybrid": 12, "electric": 8},
    "semiDetached": {"gas": 55, "hybrid": 10, "electric": 15},
    "detached": {"gas": 30, "hybrid": 8, "electric": 22},
    "apartment": {"gas": 25, "hybrid": 0, "electric": 10},
}


def build_scenarios():
    scenarios = [scenario("zeros")]
    scenarios.append(scenario("village-baseline", houses=VILLAGE, carsPerHousehold=1.2, evShare=0.2,
                              targets={"evShareTarget": 0.2}))
    scenarios.append(scenario("village-target-unset", houses=VILLAGE, carsPerHousehold=1.2, evShare=0.2))
    scenarios.append(scenario("village-solar", houses=VILLAGE, carsPerHousehold=1.2, evShare=0.2, solarPanels=900,
                              targets={"evShareTarget": 0.5}))
    scenarios.append(scenario("village-wind", houses=VILLAGE, carsPerHousehold=1.2, evShare=0.2,
                              wind=[{"name": "WES-50", "count": 2, "kw": 50}, {"name": "EAZ", "count": 6, "kw": 15}],
                              targets={"evShareTarget": 0.5}))
    scenarios.append(scenario("village-all-targets", houses=VILLAGE, carsPerHousehold=1.4, evShare=0.1,
                              solarPanels=1500,
                              wind=[{"name": "WES-50", "count": 1, "kw": 50}, {"name": "EAZ", "count": 3, "kw": 15}],
                              targets={"reduceElectricity": 0.15, "reduceHeating": 0.25, "evShareTarget": 0.6}))
    scenarios.append(scenario("surplus-production", houses={"between": {"gas": 5, "electric": 5}}, solarPanels=4000,
                              wind=[{"name": "WES-50", "count": 4, "kw": 250}, {"name": "EAZ", "count": 0, "kw": 0}],
                              carsPerHousehold=1, evShare=0.5, targets={"evShareTarget": 0.5}))
    scenarios.append(scenario("worked-example", houses={"between": {"gas": 10, "hybrid": 5, "electric": 5}},
                              carsPerHousehold=1.2, evShare=0.2, targets={"evShareTarget": 0.2}))
    for house in HOUSES:
        for heating in HEATING_COLUMN:
            scenarios.append(scenario(f"one-hot-{house}-{heating}", houses={house: {heating: 10}}))
    for share in (0, 0.5, 1):
        scenarios.append(scenario(f"ev-share-{share}", houses=VILLAGE, carsPerHousehold=1.3, evShare=share,
                                  targets={"evShareTarget": 1 - share}))
    for reduction in (0.5, 1):
        scenarios.append(scenario(f"reduce-all-{reduction}", houses=VILLAGE, carsPerHousehold=1, evShare=0.3,
                                  targets={"reduceElectricity": reduction, "reduceHeating": reduction,
                                           "evShareTarget": 0.3}))
    scenarios.append(scenario("rounding-half", houses={"apartment": {"gas": 5}}, carsPerHousehold=1, evShare=0.5,
                              targets={"evShareTarget": 0.3}))
    # Assumption overrides, including seasonality that removes the January/December tie.
    scenarios.append(scenario("override-heat-pump", houses=VILLAGE, carsPerHousehold=1.2, evShare=0.2,
                              targets={"evShareTarget": 0.4},
                              overrides={"hybridCop": 3.5, "electricCop": 4, "hybridHeatShare": 0.6,
                                         "boilerEfficiency": 0.95, "gasKwhPerM3": 10.55}))
    scenarios.append(scenario("override-house-data", houses=VILLAGE, carsPerHousehold=0.9, evShare=0.1,
                              solarPanels=300, targets={"evShareTarget": 0.25},
                              overrides={"houses.corner.electricityKwh": 3500, "houses.detached.gasM3": 2100,
                                         "houses.apartment.gasM3": 500, "panelWp": 430, "kwhPerWp": 0.95,
                                         "kmPerCar": 15000, "evKwhPerKm": 0.19, "windFullLoadHours": 2200}))
    scenarios.append(scenario("override-no-tie", houses=VILLAGE, carsPerHousehold=1.2, evShare=0.2,
                              solarPanels=600, targets={"evShareTarget": 0.4},
                              overrides={"seasonality.electricity.0": 0.12, "seasonality.electricity.11": 0.10,
                                         "seasonality.heating.6": 0.01, "seasonality.heating.7": 0.03}))
    rng = random.Random(20261006)
    for index in range(20):
        houses = {house: {heating: rng.choice([0, 0, rng.randint(1, 250)]) for heating in HEATING_COLUMN}
                  for house in HOUSES}
        ev_share = round(rng.random(), 2)
        scenarios.append(scenario(
            f"random-{index:02d}", houses=houses,
            carsPerHousehold=round(rng.uniform(0, 2.5), 2), evShare=ev_share,
            solarPanels=rng.choice([0, rng.randint(1, 6000)]),
            wind=[{"name": "WES-50", "count": rng.randint(0, 4), "kw": rng.choice([0, 50, 100, 250])},
                  {"name": "EAZ", "count": rng.randint(0, 12), "kw": rng.choice([0, 10, 15])}],
            targets={"reduceElectricity": round(rng.uniform(0, 0.6), 2),
                     "reduceHeating": round(rng.uniform(0, 0.6), 2),
                     "evShareTarget": rng.choice([None, round(rng.random(), 2)])}))
    return scenarios


def input_cells(inputs):
    cells = {}
    for row, house in enumerate(HOUSES, start=3):
        for heating, column in HEATING_COLUMN.items():
            cells[f"{column}{row}"] = inputs["houses"][house][heating]
    cells["B11"] = inputs["carsPerHousehold"]
    cells["B12"] = inputs["evShare"]
    cells["B16"] = inputs["solarPanels"]
    for row, turbine in zip((19, 20), inputs["wind"]):
        cells[f"B{row}"] = turbine["count"]
        cells[f"C{row}"] = turbine["kw"]
    cells["B24"] = inputs["targets"]["reduceElectricity"]
    cells["B25"] = inputs["targets"]["reduceHeating"]
    # The workbook has no "unset" state: an empty target cell is 0.
    cells["B28"] = inputs["targets"]["evShareTarget"] or 0
    return cells


def read_range(sheet, address):
    value = sheet.Range(address).Value2
    if isinstance(value, tuple):
        return [cell for row in value for cell in row]
    return value


def main():
    scenarios = build_scenarios()
    workdir = Path(tempfile.mkdtemp(prefix="circus-fixtures-"))
    working_copy = workdir / "workbook.xlsx"
    shutil.copyfile(WORKBOOK, working_copy)

    excel = win32.DispatchEx("Excel.Application")
    excel.Visible = False
    excel.DisplayAlerts = False
    book = None
    try:
        book = excel.Workbooks.Open(str(working_copy), UpdateLinks=0, ReadOnly=False)
        sheets = {sheet.Name: sheet for sheet in book.Worksheets}
        for sheet in sheets.values():
            sheet.Unprotect()
        excel_version = f"{excel.Version} build {excel.Build}"

        results = []
        for item in scenarios:
            restore = []
            for path, value in item["overrides"].items():
                sheet_name, address = override_cell(path)
                cell = sheets[sheet_name].Range(address)
                restore.append((cell, cell.Formula))
                cell.Value2 = value
            for address, value in input_cells(item["inputs"]).items():
                sheets[IO].Range(address).Value2 = value
            excel.CalculateFull()
            cells = {
                f"{sheet_name}!{address}": read_range(sheets[sheet_name], address)
                for sheet_name, addresses in READ.items()
                for address in addresses
            }
            results.append({**copy.deepcopy(item), "cells": cells})
            for cell, formula in restore:
                cell.Formula = formula
    finally:
        if book is not None:
            book.Close(SaveChanges=False)
        excel.Quit()
        shutil.rmtree(workdir, ignore_errors=True)

    manifest = {
        "workbook": WORKBOOK.name,
        "sha256": hashlib.sha256(WORKBOOK.read_bytes()).hexdigest(),
        "excel": excel_version,
        "generatedAt": datetime.date.today().isoformat(),
        "scenarioCount": len(results),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({"manifest": manifest, "scenarios": results}, indent=1), encoding="utf-8")
    print(f"Wrote {len(results)} scenarios to {OUTPUT}")


if __name__ == "__main__":
    sys.exit(main())
