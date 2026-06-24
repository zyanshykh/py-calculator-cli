import datetime
import math

class Calculator:
    """
    A core Calculator class responsible for basic math operations
    and maintaining a secure logs history.
    """
    def __init__(self) -> None:
        """
        Initializes the Calculator with an empty list for operation history.
        """
        # Private attribute prefix _ to indicate internal state
        self._history: list[dict[str, any]] = []

    def add(self, a: float, b: float) -> float:
        """
        Adds two floats together and logs the entry.

        Parameters:
        a (float): The first number to add.
        b (float): The second number to add.

        Returns:
        float: The sum of the two numbers.
        """
        result: float = a + b
        self._log_operation("Add", a, b, result)
        return result

    def divide(self, a: float, b: float) -> float:
        """
        Divides the first float by the second float.

        Parameters:
        a (float): The numerator (dividend).
        b (float): The denominator (divisor).

        Raises:
        ValueError: If division by zero is attempted (with a user-friendly message).

        Returns:
        float: The quotient of dividing a by b.
        """
        if b == 0:
            raise ValueError("Cannot divide by zero. Please provide a non-zero divisor.")
        result: float = a / b
        self._log_operation("Divide", a, b, result)
        return result

    def power(self, a: float, b: float) -> float:
        """
        Raises the first float to the power of the second float.

        Parameters:
        a (float): The base number.
        b (float): The exponent (power).

        Returns:
        float: The result of a raised to the power of b.
        """
        result: float = a ** b
        self._log_operation("Power", a, b, result)
        return result

    def square_root(self, a: float) -> float:
        """
        Calculates the square root of a float.

        Parameters:
        a (float): The number to find the square root of.

        Raises:
        ValueError: If a is negative (with a user-friendly message).

        Returns:
        float: The square root of a.
        """
        if a < 0:
            raise ValueError("Cannot calculate square root of a negative number. Please provide a non-negative value.")
        result: float = math.sqrt(a)
        self._log_operation("Square Root", a, 0.0, result)
        return result

    def percentage(self, a: float, b: float) -> float:
        """
        Calculates what percentage a is of b.

        Parameters:
        a (float): The part.
        b (float): The whole.

        Raises:
        ValueError: If b is zero (with a user-friendly message).

        Returns:
        float: The percentage value (a / b * 100).
        """
        if b == 0:
            raise ValueError("Cannot calculate percentage when the base value (whole) is zero.")
        result: float = (a / b) * 100
        self._log_operation("Percentage", a, b, result)
        return result

    def get_history(self) -> list[dict[str, any]]:
        """
        Returns the logged operations history.

        Returns:
        list[dict[str, any]]: A list of dictionaries, each containing details
                              of past operations.
        """
        return self._history

    def _log_operation(self, op_name: str, op1: float, op2: float, result: float) -> None:
        """
        Internal helper to record operations with an ISO timestamp.

        Parameters:
        op_name (str): The name of the operation performed (e.g., 'Add', 'Divide').
        op1 (float): The first operand.
        op2 (float): The second operand.
        result (float): The calculated result of the operation.
        """
        timestamp: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._history.append({
            "timestamp": timestamp,
            "operation": op_name,
            "operand_1": op1,
            "operand_2": op2,
            "result": result
        })
