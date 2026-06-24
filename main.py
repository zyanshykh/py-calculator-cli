import sys
from calculator import Calculator

def print_menu():
    print("\n" + "=" * 40)
    print("      PROFESSIONAL CALCULATOR CLI      ")
    print("=" * 40)
    print("1. Add (+)")
    print("2. Divide (/)")
    print("3. View History")
    print("4. Exit")
    print("=" * 40)

def main():
    # Instantiate the calculator
    calc = Calculator()
    
    print("Welcome to the Professional Python Calculator CLI!")
    print("Designed with robust exception handling and state persistence.")
    
    while True:
        print_menu()
        choice = input("Select an option (1-4): ").strip()
        
        # 1. Exit option
        if choice == "4":
            print("\nThank you for using the Calculator CLI. Goodbye!")
            sys.exit(0)
            
        # 2. View History option
        elif choice == "3":
            history = calc.get_history()
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
            
        # 3. Arithmetic Operations (Add & Divide)
        elif choice in ("1", "2"):
            try:
                # ValueError handling for input conversion
                num1_str = input("Enter first number: ").strip()
                num1 = float(num1_str)
                
                num2_str = input("Enter second number: ").strip()
                num2 = float(num2_str)
                
                if choice == "1":
                    result = calc.add(num1, num2)
                    print(f"\n[SUCCESS] Result: {num1} + {num2} = {result}")
                elif choice == "2":
                    result = calc.divide(num1, num2)
                    print(f"\n[SUCCESS] Result: {num1} / {num2} = {result}")
                    
            except ValueError:
                # Fired if string float parsing fails
                print("\n[ERROR] Invalid input! Please enter a valid numerical value.")
            except ZeroDivisionError as e:
                # Fired if dividing by zero
                print(f"\n[ERROR] Math Error: {e}")
            except Exception as e:
                # General safety net
                print(f"\n[ERROR] An unexpected error occurred: {e}")
                
        # 4. Invalid input option handling
        else:
            print("\n[ERROR] Invalid choice. Please enter a number from 1 to 4.")

if __name__ == "__main__":
    main()
