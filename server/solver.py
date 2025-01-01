from ortools.sat.python import cp_model
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from .models import Class, TimeSlot, ScheduleResponse

class ScheduleSolver:
    def __init__(self, classes: List[Class], teacher_constraints: List[TimeSlot], periods_per_day: int):
        self.classes = classes
        self.teacher_constraints = teacher_constraints
        self.periods_per_day = periods_per_day
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.variables: Dict[str, cp_model.IntVar] = {}

    def create_variables(self):
        for cls in self.classes:
            for day in self.days:
                for period in range(1, self.periods_per_day + 1):
                    var_name = f"{cls.id}_{day}_{period}"
                    self.variables[var_name] = self.model.NewBoolVar(var_name)

    def add_constraints(self):
        # Class constraints
        for cls in self.classes:
            for constraint in cls.constraints:
                var_name = f"{cls.id}_{constraint.day}_{constraint.period}"
                self.model.Add(self.variables[var_name] == 0)

        # Teacher constraints
        for constraint in self.teacher_constraints:
            for cls in self.classes:
                var_name = f"{cls.id}_{constraint.day}_{constraint.period}"
                self.model.Add(self.variables[var_name] == 0)

        # One class per period
        for day in self.days:
            for period in range(1, self.periods_per_day + 1):
                period_vars = []
                for cls in self.classes:
                    var_name = f"{cls.id}_{day}_{period}"
                    period_vars.append(self.variables[var_name])
                self.model.Add(sum(period_vars) <= 1)

        # Each class must be scheduled exactly once per week
        for cls in self.classes:
            class_vars = []
            for day in self.days:
                for period in range(1, self.periods_per_day + 1):
                    var_name = f"{cls.id}_{day}_{period}"
                    class_vars.append(self.variables[var_name])
            self.model.Add(sum(class_vars) == 1)

    def solve(self) -> Tuple[bool, Dict[str, List[TimeSlot]]]:
        self.create_variables()
        self.add_constraints()

        status = self.solver.Solve(self.model)

        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            assignments = {}
            for cls in self.classes:
                assignments[cls.id] = []
                for day in self.days:
                    for period in range(1, self.periods_per_day + 1):
                        var_name = f"{cls.id}_{day}_{period}"
                        if self.solver.Value(self.variables[var_name]) == 1:
                            assignments[cls.id].append(TimeSlot(day=day, period=period))
            return True, assignments

        return False, {}