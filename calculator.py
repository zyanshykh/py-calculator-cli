import datetime

class Calculator:
    """
    A core Calculator class responsible for basic math operations
    and maintaining a secure logs history.
    """
    def __init__(self):
        # Private attribute prefix _ to indicate internal state
        self._history = []

    def add(self, a: float, b: float) -> float:
        """Adds two floats together and logs the entry."""
        result = a + b
        self._log_operation("Add", a, b, result)
        return result

    def divide(self, a: float, b: float) -> float:
        """
        Divides the first float by the second float.
        Safely raises ZeroDivisionError if division by zero is attempted.
        """
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero.")
        result = a / b
        self._log_operation("Divide", a, b, result)
        return result

    def get_history(self) -> list:
        """Returns the logged operations history."""
        return self._history

    def _log_operation(self, op_name: str, op1: float, op2: float, result: float):
        """Internal helper to record operations with an ISO timestamp."""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._history.append({
            "timestamp": timestamp,
            "operation": op_name,
            "operand_1": op1,
            "operand_2": op2,
            "result": result
        })
