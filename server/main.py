from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from .models import ScheduleRequest, ScheduleResponse
from .solver import ScheduleSolver

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/schedule", response_model=ScheduleResponse)
async def generate_schedule(request: ScheduleRequest):
    try:
        solver = ScheduleSolver(
            request.classes,
            request.teacherConstraints,
            request.periodsPerDay
        )
        
        success, assignments = solver.solve()
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail="No feasible schedule found"
            )
            
        start_date = datetime.now()
        return ScheduleResponse(
            id=f"schedule_{start_date.strftime('%Y%m%d')}",
            startDate=start_date,
            endDate=start_date + timedelta(days=14),  # 2-week schedule
            classes=request.classes,
            assignments=assignments
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))