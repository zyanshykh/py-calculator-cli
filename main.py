import sys
from calculator import Calculator

def print_menu() -> None:
    """
    Prints the user-interactive menu interface for the Calculator CLI.
    """
    print("\n" + "=" * 40)
    print("      PROFESSIONAL CALCULATOR CLI      ")
    print("=" * 40)
    print("1. Add (+)")
    print("2. Divide (/)")
    print("3. Power (^)")
    print("4. Square Root (√)")
    print("5. Percentage (%)")
    print("6. View History")
    print("7. Exit")
    print("=" * 40)

def main() -> None:
    """
    Main controller loop that handles user inputs, menu navigation,
    exception management, and interacts with the Calculator engine.
    """
    # Instantiate the calculator
    calc: Calculator = Calculator()
    
    print("Welcome to the Professional Python Calculator CLI!")
    print("Designed with robust exception handling and state persistence.")
    
    while True:
        print_menu()
        choice: str = input("Select an option (1-7): ").strip()
        
        # 1. Exit option
        if choice == "7":
            print("\nThank you for using the Calculator CLI. Goodbye!")
            sys.exit(0)
            
        # 2. View History option
        elif choice == "6":
            history: list = calc.get_history()
            print("\n--- OPERATION HISTORY ---")
            if not history:
                print("No calculations recorded yet.")
            else:
                for idx, entry in enumerate(history, 1):
                    print(
                        f"[{idx}] {entry['timestamp']} | "
                        f"{entry['operation']}: {entry['operand_1']} "
                        f"and {entry['operand_2']} = {entry['result']}"
                    )
            continue
            
        # 3. Arithmetic Operations with two inputs
        elif choice in ("1", "2", "3", "5"):
            try:
                # ValueError handling for input conversion
                num1_str: str = input("Enter first number: ").strip()
                num1: float = float(num1_str)
                
                num2_str: str = input("Enter second number: ").strip()
                num2: float = float(num2_str)
                
                if choice == "1":
                    result: float = calc.add(num1, num2)
                    print(f"\n[SUCCESS] Result: {num1} + {num2} = {result}")
                elif choice == "2":
                    result: float = calc.divide(num1, num2)
                    print(f"\n[SUCCESS] Result: {num1} / {num2} = {result}")
                elif choice == "3":
                    result: float = calc.power(num1, num2)
                    print(f"\n[SUCCESS] Result: {num1} ^ {num2} = {result}")
                elif choice == "5":
                    result: float = calc.percentage(num1, num2)
                    print(f"\n[SUCCESS] Result: {num1} is {result}% of {num2}")
                    
            except ValueError as e:
                # Catch ValueError which handles both float parsing failure 
                # AND division by zero raises (clean ValueError with user-friendly message).
                err_msg: str = str(e)
                if "Cannot divide by zero" in err_msg or "Cannot calculate percentage" in err_msg:
                    print(f"\n[ERROR] Math Error: {err_msg}")
                else:
                    print("\n[ERROR] Invalid input! Please enter a valid numerical value.")
            except Exception as e:
                # General safety net
                print(f"\n[ERROR] An unexpected error occurred: {e}")
                
        # 4. Operations with one input (Square Root)
        elif choice == "4":
            try:
                num_str: str = input("Enter number: ").strip()
                num: float = float(num_str)
                result: float = calc.square_root(num)
                print(f"\n[SUCCESS] Result: √{num} = {result}")
            except ValueError as e:
                err_msg: str = str(e)
                if "Cannot calculate square root" in err_msg:
                    print(f"\n[ERROR] Math Error: {err_msg}")
                else:
                    print("\n[ERROR] Invalid input! Please enter a valid numerical value.")
            except Exception as e:
                print(f"\n[ERROR] An unexpected error occurred: {e}")

        # 5. Invalid input option handling
        else:
            print("\n[ERROR] Invalid choice. Please enter a number from 1 to 7.")

if __name__ == "__main__":
    main()
