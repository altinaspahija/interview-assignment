from pathlib import Path
import csv

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Mock API")

# Derivation rules:
# users = number of non-empty rows in CSV
# active_today = round(users * 0.20)
# conversion_rate = constant 0.035

ACTIVE_RATIO = 0.20
CONVERSION_RATE = 0.035

REQUIRED_COLUMNS = {"id", "first_name", "last_name", "email", "gender", "ip_address"}


class StatsResponse(BaseModel):
    users: int = Field(..., ge=0, description="Row count in CSV (non-empty rows).")
    active_today: int = Field(..., ge=0, description="Simulated active users today.")
    conversion_rate: float = Field(
        ..., ge=0, le=1, description="Simulated conversion rate (0..1)."
    )


def count_users(csv_path: Path) -> int:
    if not csv_path.exists():
        raise FileNotFoundError(str(csv_path))

    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        if not reader.fieldnames:
            raise ValueError("CSV is empty or missing header row")

        header_set = {h.strip() for h in reader.fieldnames if h}
        missing = REQUIRED_COLUMNS - header_set
        if missing:
            raise ValueError(f"Missing required columns: {sorted(missing)}")

        users = 0
        for row in reader:
        
            if any((v or "").strip() for v in row.values()):
                users += 1

        return users


@app.get("/stats", response_model=StatsResponse)
def get_stats() -> StatsResponse:

    csv_path = Path(__file__).resolve().parent / "data" / "mock_data.csv"

    try:
        users = count_users(csv_path)
    except FileNotFoundError:
  
        raise HTTPException(
            status_code=503,
            detail=f"Dataset not available at {csv_path.as_posix()}",
        )
    except ValueError as e:
    
        raise HTTPException(status_code=500, detail=f"Dataset malformed: {e}")
    except Exception:
        raise HTTPException(status_code=500, detail="Unexpected error reading dataset")

    active_today = int(round(users * ACTIVE_RATIO))
    return StatsResponse(
        users=users,
        active_today=active_today,
        conversion_rate=CONVERSION_RATE,
    )