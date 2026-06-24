import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  FileCode, 
  ShieldCheck, 
  History, 
  AlertCircle, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
  Cpu,
  ChevronRight,
  Play,
  Plus,
  Divide,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText
} from "lucide-react";

// Definitions for simulated history entry
interface CalcHistoryEntry {
  timestamp: string;
  operation: string;
  operand_1: number;
  operand_2: number;
  result: number;
}

export default function App() {
  // Navigation / Tabs state for Code IDE
  const [activeTab, setActiveTab] = useState<"main" | "calculator">("main");
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedExplain, setSelectedExplain] = useState<string>("try-except");

  // Core Calculator Simulation States
  const [calcHistory, setCalcHistory] = useState<CalcHistoryEntry[]>([
    {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operation: "Add",
      operand_1: 15,
      operand_2: 27,
      result: 42
    },
    {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operation: "Divide",
      operand_1: 100,
      operand_2: 4,
      result: 25
    }
  ]);

  // Dashboard Operator Console States
  const [activeOperation, setActiveOperation] = useState<"add" | "divide" | "power" | "square_root" | "percentage">("add");
  const [operandA, setOperandA] = useState<string>("24.5");
  const [operandB, setOperandB] = useState<string>("17.5");
  const [currentStatus, setCurrentStatus] = useState<"READY" | "SUCCESS" | "ERROR" | "COMPUTING">("READY");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  // Exception Counters
  const [valueErrorCount, setValueErrorCount] = useState<number>(0);
  const [zeroDivisionCount, setZeroDivisionCount] = useState<number>(0);

  // Execution logs for the Live Stdout console
  const [simulationLog, setSimulationLog] = useState<string[]>([
    "[12:00:00] Initializing Python 3.11 Runtime Environment...",
    "[12:00:01] Importing sys and custom calculator modules...",
    "[12:00:01] Instantiated core Calculator object at heap address 0x7f9a8c12",
    "[12:00:01] Calculator CLI engine successfully running on standby."
  ]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the Stdout logs console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simulationLog]);

  // File templates to display in Code IDE
  const calculatorCode = `import datetime
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
`;

  const mainCode = `import sys
from calculator import Calculator

def print_menu() -> None:
    """
    Prints the user-interactive menu interface for the Calculator CLI.
    """
    print("\\n" + "=" * 40)
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
            print("\\nThank you for using the Calculator CLI. Goodbye!")
            sys.exit(0)
            
        # 2. View History option
        elif choice == "6":
            history: list = calc.get_history()
            print("\\n--- OPERATION HISTORY ---")
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
                    print(f"\\n[SUCCESS] Result: {num1} + {num2} = {result}")
                elif choice == "2":
                    result: float = calc.divide(num1, num2)
                    print(f"\\n[SUCCESS] Result: {num1} / {num2} = {result}")
                elif choice == "3":
                    result: float = calc.power(num1, num2)
                    print(f"\\n[SUCCESS] Result: {num1} ^ {num2} = {result}")
                elif choice == "5":
                    result: float = calc.percentage(num1, num2)
                    print(f"\\n[SUCCESS] Result: {num1} is {result}% of {num2}")
                    
            except ValueError as e:
                # Catch ValueError which handles both float parsing failure 
                # AND division by zero raises (clean ValueError with user-friendly message).
                err_msg: str = str(e)
                if "Cannot divide by zero" in err_msg or "Cannot calculate percentage" in err_msg:
                    print(f"\\n[ERROR] Math Error: {err_msg}")
                else:
                    print("\\n[ERROR] Invalid input! Please enter a valid numerical value.")
            except Exception as e:
                # General safety net
                print(f"\\n[ERROR] An unexpected error occurred: {e}")
                
        # 4. Operations with one input (Square Root)
        elif choice == "4":
            try:
                num_str: str = input("Enter number: ").strip()
                num: float = float(num_str)
                result: float = calc.square_root(num)
                print(f"\\n[SUCCESS] Result: √{num} = {result}")
            except ValueError as e:
                err_msg: str = str(e)
                if "Cannot calculate square root" in err_msg:
                    print(f"\\n[ERROR] Math Error: {err_msg}")
                else:
                    print("\\n[ERROR] Invalid input! Please enter a valid numerical value.")
            except Exception as e:
                print(f"\\n[ERROR] An unexpected error occurred: {e}")
                
        # 5. Invalid input option handling
        else:
            print("\\n[ERROR] Invalid choice. Please enter a number from 1 to 7.")

if __name__ == "__main__":
    main()
`;

  // Get current timestamp formatted
  const getFormattedTime = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  };

  // Helper to append action to logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSimulationLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Reset Sandbox Engine State
  const resetEngine = () => {
    setCalcHistory([]);
    setValueErrorCount(0);
    setZeroDivisionCount(0);
    setOperandA("24.5");
    setOperandB("17.5");
    setCurrentStatus("READY");
    setSimulationLog([
      `[${new Date().toLocaleTimeString()}] Restarting Python CLI Environment...`,
      `[${new Date().toLocaleTimeString()}] Instantiated clean core Calculator object. Private history cleared.`,
      `[${new Date().toLocaleTimeString()}] Standby. Ready for operations.`
    ]);
  };

  // Live validator logic to display dynamic alert warnings
  const getValidationWarning = () => {
    const trimmedA = operandA.trim();
    const trimmedB = operandB.trim();
    
    const isANan = isNaN(Number(trimmedA)) || trimmedA === "";
    const isBNan = isNaN(Number(trimmedB)) || trimmedB === "";

    if (activeOperation === "square_root") {
      if (isANan) {
        return {
          type: "ValueError" as const,
          message: "Dynamic Warning: Invalid characters detected. Executing this will trigger an expected 'ValueError' in float() conversion, safely caught in main.py without crashing.",
          severity: "warning" as const
        };
      }
      if (Number(trimmedA) < 0) {
        return {
          type: "ValueError" as const,
          message: "Dynamic Exception Guard: Negative input detected! Core calculator.py square_root method will raise a ValueError with a user-friendly message, handled by main.py.",
          severity: "danger" as const
        };
      }
      return null;
    }

    if (isANan || isBNan) {
      return {
        type: "ValueError" as const,
        message: "Dynamic Warning: Invalid characters detected. Executing this will trigger an expected 'ValueError' in float() conversion, safely caught in main.py without crashing.",
        severity: "warning" as const
      };
    }

    if (activeOperation === "divide" && Number(trimmedB) === 0) {
      return {
        type: "ZeroDivision" as const,
        message: "Dynamic Exception Guard: b = 0 denominator detected! Core calculator.py divide method will raise a ValueError with a user-friendly message, handled by main.py.",
        severity: "danger" as const
      };
    }

    if (activeOperation === "percentage" && Number(trimmedB) === 0) {
      return {
        type: "ValueError" as const,
        message: "Dynamic Exception Guard: b = 0 base value detected! Core calculator.py percentage method will raise a ValueError with a user-friendly message, handled by main.py.",
        severity: "danger" as const
      };
    }

    return null;
  };

  const validationWarning = getValidationWarning();

  // Execute actual sandbox logic representing main.py and calculator.py
  const executeCalculation = (opOverride?: "add" | "divide" | "power" | "square_root" | "percentage", customValA?: string, customValB?: string) => {
    const op = opOverride || activeOperation;
    const valA = customValA !== undefined ? customValA : operandA;
    const valB = customValB !== undefined ? customValB : operandB;

    const trimmedA = valA.trim();
    const trimmedB = valB.trim();

    setCurrentStatus("COMPUTING");
    let opNum = "1 (Add)";
    if (op === "divide") opNum = "2 (Divide)";
    else if (op === "power") opNum = "3 (Power)";
    else if (op === "square_root") opNum = "4 (Square Root)";
    else if (op === "percentage") opNum = "5 (Percentage)";

    addLog(`Menu choice selected: ${opNum}`);
    addLog(`input("Enter first number:") >> "${trimmedA}"`);
    if (op !== "square_root") {
      addLog(`input("Enter second number:") >> "${trimmedB}"`);
    }

    // 1. Simulate main.py float parsing (which raises ValueError if letters/empty)
    const parsedA = parseFloat(trimmedA);
    const parsedB = parseFloat(trimmedB);

    const isANan = isNaN(parsedA) || trimmedA === "";
    const isBNan = isNaN(parsedB) || trimmedB === "";

    if (isANan || (op !== "square_root" && isBNan)) {
      // Caught ValueError!
      setTimeout(() => {
        setValueErrorCount(prev => prev + 1);
        setCurrentStatus("ERROR");
        addLog(`[Traceback] ValueError: could not convert string to float`);
        addLog(`[Try-Except Guard] Fired ValueError block in main.py!`);
        addLog(`stdout >> [ERROR] Invalid input! Please enter a valid numerical value.`);
      }, 400);
      return;
    }

    // 2. Clear values
    if (op === "add") {
      setTimeout(() => {
        const result = parsedA + parsedB;
        const newEntry: CalcHistoryEntry = {
          timestamp: getFormattedTime(),
          operation: "Add",
          operand_1: parsedA,
          operand_2: parsedB,
          result: result
        };
        setCalcHistory(prev => [...prev, newEntry]);
        setCurrentStatus("SUCCESS");
        addLog(`Calling Calculator.add(${parsedA}, ${parsedB})...`);
        addLog(`Calculator operation logged internally: self._history.append(...)`);
        addLog(`stdout >> [SUCCESS] Result: ${parsedA} + ${parsedB} = ${result}`);
      }, 400);
    } else if (op === "divide") {
      // Division
      setTimeout(() => {
        if (parsedB === 0) {
          // Division by zero triggers ValueError
          setZeroDivisionCount(prev => prev + 1);
          setCurrentStatus("ERROR");
          addLog(`Calling Calculator.divide(${parsedA}, 0.0)...`);
          addLog(`[Exception Raised] raise ValueError("Cannot divide by zero. Please provide a non-zero divisor.")`);
          addLog(`[Try-Except Guard] Fired ValueError block in main.py (matched error string)!`);
          addLog(`stdout >> [ERROR] Math Error: Cannot divide by zero. Please provide a non-zero divisor.`);
        } else {
          const result = parsedA / parsedB;
          const newEntry: CalcHistoryEntry = {
            timestamp: getFormattedTime(),
            operation: "Divide",
            operand_1: parsedA,
            operand_2: parsedB,
            result: result
          };
          setCalcHistory(prev => [...prev, newEntry]);
          setCurrentStatus("SUCCESS");
          addLog(`Calling Calculator.divide(${parsedA}, ${parsedB})...`);
          addLog(`Calculator operation logged internally: self._history.append(...)`);
          addLog(`stdout >> [SUCCESS] Result: ${parsedA} / ${parsedB} = ${result}`);
        }
      }, 400);
    } else if (op === "power") {
      // Exponentiation
      setTimeout(() => {
        const result = Math.pow(parsedA, parsedB);
        const newEntry: CalcHistoryEntry = {
          timestamp: getFormattedTime(),
          operation: "Power",
          operand_1: parsedA,
          operand_2: parsedB,
          result: result
        };
        setCalcHistory(prev => [...prev, newEntry]);
        setCurrentStatus("SUCCESS");
        addLog(`Calling Calculator.power(${parsedA}, ${parsedB})...`);
        addLog(`Calculator operation logged internally: self._history.append(...)`);
        addLog(`stdout >> [SUCCESS] Result: ${parsedA} ^ ${parsedB} = ${result}`);
      }, 400);
    } else if (op === "square_root") {
      // Square Root
      setTimeout(() => {
        if (parsedA < 0) {
          setValueErrorCount(prev => prev + 1);
          setCurrentStatus("ERROR");
          addLog(`Calling Calculator.square_root(${parsedA})...`);
          addLog(`[Exception Raised] raise ValueError("Cannot calculate square root of a negative number. Please provide a non-negative value.")`);
          addLog(`[Try-Except Guard] Fired ValueError block in main.py (matched error string)!`);
          addLog(`stdout >> [ERROR] Math Error: Cannot calculate square root of a negative number. Please provide a non-negative value.`);
        } else {
          const result = Math.sqrt(parsedA);
          const newEntry: CalcHistoryEntry = {
            timestamp: getFormattedTime(),
            operation: "Square Root",
            operand_1: parsedA,
            operand_2: 0,
            result: result
          };
          setCalcHistory(prev => [...prev, newEntry]);
          setCurrentStatus("SUCCESS");
          addLog(`Calling Calculator.square_root(${parsedA})...`);
          addLog(`Calculator operation logged internally: self._history.append(...)`);
          addLog(`stdout >> [SUCCESS] Result: √${parsedA} = ${result}`);
        }
      }, 400);
    } else if (op === "percentage") {
      // Percentage
      setTimeout(() => {
        if (parsedB === 0) {
          setValueErrorCount(prev => prev + 1);
          setCurrentStatus("ERROR");
          addLog(`Calling Calculator.percentage(${parsedA}, 0.0)...`);
          addLog(`[Exception Raised] raise ValueError("Cannot calculate percentage when the base value (whole) is zero.")`);
          addLog(`[Try-Except Guard] Fired ValueError block in main.py (matched error string)!`);
          addLog(`stdout >> [ERROR] Math Error: Cannot calculate percentage when the base value (whole) is zero.`);
        } else {
          const result = (parsedA / parsedB) * 100;
          const newEntry: CalcHistoryEntry = {
            timestamp: getFormattedTime(),
            operation: "Percentage",
            operand_1: parsedA,
            operand_2: parsedB,
            result: result
          };
          setCalcHistory(prev => [...prev, newEntry]);
          setCurrentStatus("SUCCESS");
          addLog(`Calling Calculator.percentage(${parsedA}, ${parsedB})...`);
          addLog(`Calculator operation logged internally: self._history.append(...)`);
          addLog(`stdout >> [SUCCESS] Result: ${parsedA} is ${result}% of ${parsedB}`);
        }
      }, 400);
    }
  };

  // Run Preset Sequence with animation typing effects
  const runPresetScenario = async (op: "add" | "divide" | "power" | "square_root" | "percentage", valA: string, valB: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveOperation(op);
    setOperandA("");
    setOperandB("");
    setCurrentStatus("COMPUTING");
    addLog(`Auto-running pre-set Python test scenario...`);

    // Staggered input simulation
    await new Promise(r => setTimeout(r, 200));
    setOperandA(valA);
    addLog(`Simulated keyboard input to variable num1_str: "${valA}"`);
    
    if (op !== "square_root") {
      await new Promise(r => setTimeout(r, 200));
      setOperandB(valB);
      addLog(`Simulated keyboard input to variable num2_str: "${valB}"`);
    }
    
    await new Promise(r => setTimeout(r, 300));
    executeCalculation(op, valA, valB);
    setIsSimulating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explainSections = [
    {
      id: "try-except",
      title: "ValueError catching",
      subtitle: "Preventing crashes on dirty input",
      desc: "Users will often type letters ('abc') instead of decimal values. By wrapping float(input()) in a try-except block, we catch the ValueError gracefully and display an elegant warning instead of letting Python crash.",
      codeSnippet: `try:
    num1 = float(input("Enter first number: "))
except ValueError:
    print("[ERROR] Invalid input! Please enter a number.")`
    },
    {
      id: "while-true",
      title: "The while True loop",
      subtitle: "Designing persistent service CLI loops",
      desc: "The 'while True' keeps the console applet running indefinitely. This lets the user perform multiple actions in one session. It is safely halted and closed only when input choice '4' triggers sys.exit(0).",
      codeSnippet: `while True:
    print_menu()
    choice = input("Select an option: ")
    if choice == "4":
        sys.exit(0)`
    },
    {
      id: "zerodivision",
      title: "ValueError on division by zero",
      subtitle: "Encapsulating custom arithmetic validation",
      desc: "Rather than letting standard DivisionByZero crash or bubble up directly, the core Calculator class raises a clear ValueError with a custom, user-friendly error message. The main.py handles this gracefully inside the ValueError block.",
      codeSnippet: `# inside calculator.py
if b == 0:
    raise ValueError("Cannot divide by zero. Please provide a non-zero divisor.")

# inside main.py
except ValueError as e:
    err_msg = str(e)
    if "Cannot divide by zero" in err_msg:
        print(f"[ERROR] Math Error: {err_msg}")`
    },
    {
      id: "state-history",
      title: "History State Store",
      subtitle: "Encapsulating internal logging state",
      desc: "Operations are logged to a private property '_history' within the Calculator class instance. Since '_history' starts with an underscore, it warns developers that it is an internal implementation detail, accessed cleanly via 'get_history()'.",
      codeSnippet: `def __init__(self):
    self._history = [] # Private logging state

def get_history(self) -> list:
    return self._history`
    }
  ];

  return (
    <div 
      className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-hidden"
      style={{
        background: "radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 100% 100%, #3b0764 0px, transparent 50%), #0f172a"
      }}
    >
      {/* Ambient background light circles */}
      <div className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] top-20 left-40 select-none pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] bottom-10 right-20 select-none pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
              {/* Python Brand Colors represented in interactive logic icon */}
              <svg className="w-6 h-6 text-indigo-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.93 2c-2.4 0-4.5 1.7-4.5 4.3v1.8H12V9H5.7C3.1 9 1 10.9 1 13.5s2 4.4 4.7 4.4h1.7v-2.3c0-2 1.6-3.7 3.5-3.7h4.4c2.5 0 4.6-2.1 4.6-4.6V4.3C20 1.7 17.9 2 15.4 2h-3.47zm.14 20c2.4 0 4.5-1.7 4.5-4.3v-1.8H12V15h6.3c2.6 0 4.7-1.9 4.7-4.5s-2-4.4-4.7-4.4h-1.7v2.3c0 2-1.6 3.7-3.5 3.7H8.7c-2.5 0-4.6 2.1-4.6 4.6v3.1c0 2.6 2.1 2.2 4.6 2.2h3.37z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 id="app-title" className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Py - Calculator
                </h1>
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center gap-1.5 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active Sandbox
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-mono">
                  Python 3.11
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand robust exceptions, loops, and data structures through a high-fidelity control dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => copyToClipboard(activeTab === "main" ? mainCode : calculatorCode)}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/25"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Script!" : "Copy Active Script"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Side: Code view and explanation panel (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Code IDE Panel */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            
            {/* Tab header */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
                </div>
                <span className="text-slate-500 font-mono text-xs ml-2 select-none">|</span>
                <span className="text-slate-400 font-mono text-xs select-none">Execution Logic Codebases</span>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/5">
                <button
                  id="tab-btn-main"
                  onClick={() => setActiveTab("main")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === "main"
                      ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileCode className="w-3 h-3 text-indigo-400" />
                  main.py
                </button>
                <button
                  id="tab-btn-calc"
                  onClick={() => setActiveTab("calculator")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === "calculator"
                      ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  calculator.py
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="relative">
              <pre className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto max-h-[480px] bg-black/30 text-slate-300 custom-scrollbar whitespace-pre">
                <code>
                  {activeTab === "main" ? mainCode : calculatorCode}
                </code>
              </pre>

              {/* Floating Copy indicator */}
              <div className="absolute top-4 right-4 bg-white/10 border border-white/20 p-2 rounded-lg flex items-center justify-center cursor-pointer shadow-md text-slate-300 hover:text-white backdrop-blur-md transition-colors"
                   onClick={() => copyToClipboard(activeTab === "main" ? mainCode : calculatorCode)}
                   title="Copy Code to Clipboard">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
            </div>
            
            {/* Project File Info Bar */}
            <div className="bg-white/5 px-4 py-2 border-t border-white/5 text-slate-400 font-mono text-[11px] flex justify-between items-center">
              <span>Encoding: UTF-8</span>
              <span>Indent: 4 Spaces</span>
              <span className="text-indigo-400 font-semibold">Language: Python 3 (Strict Hints)</span>
            </div>
          </div>

          {/* Explanation Selector Panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Robust Code Annotations & Architecture
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {explainSections.map((sect) => (
                <button
                  key={sect.id}
                  onClick={() => setSelectedExplain(sect.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-all cursor-pointer ${
                    selectedExplain === sect.id
                      ? "bg-indigo-500/20 text-indigo-300 border border-white/10 font-semibold"
                      : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-300"
                  }`}
                >
                  {sect.title}
                </button>
              ))}
            </div>

            {/* Selected Explanation Detail block */}
            {explainSections.filter(x => x.id === selectedExplain).map((sect) => (
              <div key={sect.id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col gap-3 animate-fade-in">
                <div>
                  <h3 className="text-xs font-mono text-indigo-400 tracking-wider uppercase font-bold">{sect.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{sect.subtitle}</p>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{sect.desc}</p>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Code snippet</span>
                  <pre className="font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar">
                    <code>{sect.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Professional Modern Dashboard UI (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Bento Panel 1: Interactive Execution Sandbox Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                Operations
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white">{calcHistory.length}</span>
                <span className="text-[10px] text-slate-400">stored</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                ValueErrors
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-amber-400">{valueErrorCount}</span>
                <span className="text-[10px] text-green-400">prevented</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" />
                ZeroDivs
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-rose-400">{zeroDivisionCount}</span>
                <span className="text-[10px] text-green-400">prevented</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-indigo-400" />
                 Status
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-mono font-semibold text-green-400 tracking-wider">ONLINE</span>
              </div>
            </div>

          </div>

          {/* Bento Panel 2: Interactive Input & Calculation Console */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Sleek Operations Console</h3>
                  <p className="text-[11px] text-slate-400">Execute math formulas directly inside the Python object sandbox</p>
                </div>
              </div>
              
              <button 
                onClick={resetEngine}
                className="text-slate-400 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5"
                title="Restart script execution"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                Reset Sandbox
              </button>
            </div>

            {/* Segmented Control for Operations selection */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setActiveOperation("add");
                  addLog("Dashboard operation toggle: ADD (+)");
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeOperation === "add"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Add (+)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOperation("divide");
                  addLog("Dashboard operation toggle: DIVIDE (/)");
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeOperation === "divide"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Divide className="w-3.5 h-3.5 shrink-0" />
                <span>Divide (/)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOperation("power");
                  addLog("Dashboard operation toggle: POWER (^)");
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeOperation === "power"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-mono font-bold text-xs shrink-0 bg-white/10 w-4 h-4 rounded flex items-center justify-center">^</span>
                <span>Power (^)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOperation("square_root");
                  addLog("Dashboard operation toggle: SQUARE ROOT (√)");
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeOperation === "square_root"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-mono font-bold text-xs shrink-0 bg-white/10 w-4 h-4 rounded flex items-center justify-center">√</span>
                <span>Sqrt (√)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveOperation("percentage");
                  addLog("Dashboard operation toggle: PERCENTAGE (%)");
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeOperation === "percentage"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-white/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-mono font-bold text-xs shrink-0 bg-white/10 w-4 h-4 rounded flex items-center justify-center">%</span>
                <span>Percent (%)</span>
              </button>
            </div>

            {/* Interactive Float Fields representing input() */}
            <form onSubmit={(e) => { e.preventDefault(); executeCalculation(); }} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Input a */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>{activeOperation === "square_root" ? "Value (a)" : "First Operand (a)"}</span>
                    <span className="text-[10px] text-slate-500 font-normal">num1_str</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={operandA}
                      onChange={(e) => {
                        setOperandA(e.target.value);
                        setCurrentStatus("READY");
                      }}
                      placeholder={activeOperation === "square_root" ? "e.g. 16.0" : "e.g. 24.5"}
                      className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Input b */}
                {activeOperation !== "square_root" ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                      <span>{activeOperation === "percentage" ? "Whole / Base (b)" : "Second Operand (b)"}</span>
                      <span className="text-[10px] text-slate-500 font-normal">num2_str</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={operandB}
                        onChange={(e) => {
                          setOperandB(e.target.value);
                          setCurrentStatus("READY");
                        }}
                        placeholder={activeOperation === "power" ? "exponent (e.g. 3)" : "e.g. 17.5"}
                        className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 opacity-60 bg-white/5 border border-dashed border-white/10 rounded-xl p-3 flex-1 justify-center">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">Unary Operation Option (4)</span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Square Root only requires a single operand (a). Input b is ignored.
                    </p>
                  </div>
                )}

              </div>

              {/* Dynamic Warning Alert banners inside validation engine */}
              {validationWarning && (
                <div className={`p-3.5 rounded-xl border flex items-start gap-3 animate-pulse ${
                  validationWarning.severity === "danger"
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                }`}>
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block font-mono">{validationWarning.type} Detected</span>
                    <p className="mt-0.5 leading-relaxed">{validationWarning.message}</p>
                  </div>
                </div>
              )}

              {/* Submit Execution Button */}
              <button
                type="submit"
                disabled={isSimulating}
                className={`py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none ${
                  currentStatus === "COMPUTING"
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : currentStatus === "ERROR"
                    ? "bg-rose-600/90 hover:bg-rose-600 text-white shadow-rose-600/10"
                    : currentStatus === "SUCCESS"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                {currentStatus === "COMPUTING" 
                  ? "Running Python Code Execution..." 
                  : "Run Python Engine Execution"
                }
              </button>

            </form>
          </div>

          {/* Bento Panel 3: Live Output Terminal & Stdout/Stderr logs */}
          <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
            
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Live Stdout Console & Exception Logs
              </span>
              <button 
                onClick={() => setSimulationLog([])}
                className="text-[10px] text-slate-400 hover:text-white transition-colors"
              >
                Clear output
              </button>
            </div>

            <div className="p-4 bg-black/30 font-mono text-xs sm:text-[13px] leading-relaxed space-y-1.5 max-h-[220px] h-[220px] overflow-y-auto custom-scrollbar select-text selection:bg-indigo-500 selection:text-white">
              {simulationLog.map((log, idx) => {
                let textClass = "text-slate-300";
                if (log.includes("[SUCCESS]")) textClass = "text-emerald-400 font-medium";
                else if (log.includes("[ERROR]") || log.includes("[Exception") || log.includes("ValueError:")) textClass = "text-rose-400 font-semibold";
                else if (log.includes("[Try-Except")) textClass = "text-amber-300 font-medium";
                else if (log.includes("Executing:")) textClass = "text-indigo-300 font-semibold";

                return (
                  <div key={idx} className={textClass}>
                    {log}
                  </div>
                );
              })}
              <div ref={consoleEndRef} />
            </div>
          </div>

          {/* Bento Panel 4: Recent Calculations History & Storage */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                Dynamically Updated Operation History
              </span>
              {calcHistory.length > 0 && (
                <button 
                  onClick={() => setCalcHistory([])}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Clear history state
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto max-h-36 space-y-2 custom-scrollbar pr-1">
              {calcHistory.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4 font-mono">No calculations logged in current instance session.</div>
              ) : (
                calcHistory.slice().reverse().map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        entry.operation === "Add" 
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                          : entry.operation === "Divide"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                          : entry.operation === "Power"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                          : entry.operation === "Square Root"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/20"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/20"
                      }`}>
                        {entry.operation}
                      </span>
                      <span className="text-slate-400 text-[10px]">{entry.timestamp}</span>
                    </div>
                    <span className="text-slate-200">
                      {entry.operation === "Square Root" ? (
                        <>√{entry.operand_1} = <span className="text-indigo-300 font-bold">{entry.result}</span></>
                      ) : entry.operation === "Percentage" ? (
                        <>{entry.operand_1} is <span className="text-indigo-300 font-bold">{entry.result}%</span> of {entry.operand_2}</>
                      ) : (
                        <>{entry.operand_1} {entry.operation === "Add" ? "+" : entry.operation === "Divide" ? "/" : entry.operation === "Power" ? "^" : ""} {entry.operand_2} = <span className="text-indigo-300 font-bold">{entry.result}</span></>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Automation Presets */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 flex flex-col gap-3 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Quick Script Test Scenarios
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              
              <button
                onClick={() => runPresetScenario("add", "45.2", "12.8")}
                disabled={isSimulating}
                className="bg-white/5 hover:bg-white/10 border border-white/5 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-emerald-400 flex items-center justify-between">
                  <span>1. Normal addition</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Loads 45.2 + 12.8. Outputs success.</p>
              </button>

              <button
                onClick={() => runPresetScenario("divide", "15.0", "0")}
                disabled={isSimulating}
                className="bg-white/5 hover:bg-white/10 border border-white/5 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-rose-400 flex items-center justify-between">
                  <span>2. Divide by Zero</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Loads b = 0. Handles ZeroDivision ValueError.</p>
              </button>

              <button
                onClick={() => runPresetScenario("square_root", "-9.0", "0")}
                disabled={isSimulating}
                className="bg-white/5 hover:bg-white/10 border border-white/5 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-rose-400 flex items-center justify-between">
                  <span>3. Sqrt of Negative</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Loads a = -9. Handles square_root ValueError.</p>
              </button>

              <button
                onClick={() => runPresetScenario("add", "invalid_text", "5.5")}
                disabled={isSimulating}
                className="bg-white/5 hover:bg-white/10 border border-white/5 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-amber-400 flex items-center justify-between">
                  <span>4. Value Conversion</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Loads invalid floats. Handles try-except.</p>
              </button>

            </div>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-slate-500 text-xs bg-slate-950/40 mt-12 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span> Created By : DEV HUB</span>
          </div>
          <div className="flex gap-6">
            <span>Session Calculations: {calcHistory.length}</span>
            <span>CPU Load: 4%</span>
            <span>Heap: 12MB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
