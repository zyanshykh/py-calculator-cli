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
  ExternalLink,
  Sliders,
  Cpu,
  CornerDownLeft,
  ChevronRight
} from "lucide-react";

// Definitions for simulated history entry
interface CalcHistoryEntry {
  timestamp: string;
  operation: string;
  operand_1: number;
  operand_2: number;
  result: number;
}

// Terminal line interface
interface TerminalLine {
  id: string;
  type: "default" | "prompt" | "input" | "success" | "error" | "system" | "menu";
  text: string;
}

type TerminalState = 
  | "CHOICE"
  | "ADD_NUM1_INPUT"
  | "ADD_NUM2_INPUT"
  | "DIV_NUM1_INPUT"
  | "DIV_NUM2_INPUT"
  | "EXITED";

export default function App() {
  // Navigation / Tabs state
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
    }
  ]);
  
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [terminalState, setTerminalState] = useState<TerminalState>("CHOICE");
  const [tempNum1, setTempNum1] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // File templates to display
  const calculatorCode = `import datetime

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
`;

  const mainCode = `import sys
from calculator import Calculator

def print_menu():
    print("\\n" + "=" * 40)
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
            print("\\nThank you for using the Calculator CLI. Goodbye!")
            sys.exit(0)
            
        # 2. View History option
        elif choice == "3":
            history = calc.get_history()
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
                    print(f"\\n[SUCCESS] Result: {num1} + {num2} = {result}")
                elif choice == "2":
                    result = calc.divide(num1, num2)
                    print(f"\\n[SUCCESS] Result: {num1} / {num2} = {result}")
                    
            except ValueError:
                # Fired if string float parsing fails
                print("\\n[ERROR] Invalid input! Please enter a valid numerical value.")
            except ZeroDivisionError as e:
                # Fired if dividing by zero
                print(f"\\n[ERROR] Math Error: {e}")
            except Exception as e:
                # General safety net
                print(f"\\n[ERROR] An unexpected error occurred: {e}")
                
        # 4. Invalid input option handling
        else:
            print("\\n[ERROR] Invalid choice. Please enter a number from 1 to 4.")

if __name__ == "__main__":
    main()
`;

  // Helper to append lines to simulated terminal
  const appendLines = (lines: { text: string; type?: TerminalLine["type"] }[]) => {
    setTerminalLines(prev => [
      ...prev,
      ...lines.map(line => ({
        id: Math.random().toString(36).substring(7),
        type: line.type || "default",
        text: line.text
      }))
    ]);
  };

  // Get current timestamp formatted
  const getFormattedTime = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  };

  // Generate Menu Lines
  const getMenuLines = () => [
    { text: "\n========================================", type: "menu" as const },
    { text: "      PROFESSIONAL CALCULATOR CLI      ", type: "menu" as const },
    { text: "========================================", type: "menu" as const },
    { text: "1. Add (+)", type: "menu" as const },
    { text: "2. Divide (/)", type: "menu" as const },
    { text: "3. View History", type: "menu" as const },
    { text: "4. Exit", type: "menu" as const },
    { text: "========================================", type: "menu" as const }
  ];

  // Initialize Terminal on load
  useEffect(() => {
    resetTerminal();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const resetTerminal = () => {
    setTerminalState("CHOICE");
    setTempNum1(null);
    setInputValue("");
    setTerminalLines([
      { id: "boot-1", type: "system", text: "python main.py" },
      { id: "boot-2", type: "default", text: "Welcome to the Professional Python Calculator CLI!" },
      { id: "boot-3", type: "default", text: "Designed with robust exception handling and state persistence." },
      ...getMenuLines().map((l, i) => ({ id: `menu-${i}`, type: l.type, text: l.text }))
    ]);
  };

  // Main terminal loop processor
  const processInput = (text: string) => {
    const trimmed = text.trim();
    appendLines([{ text: trimmed, type: "input" }]);

    if (terminalState === "CHOICE") {
      if (trimmed === "4") {
        appendLines([
          { text: "\nThank you for using the Calculator CLI. Goodbye!", type: "default" },
          { text: "[Process completed with exit code 0]", type: "system" }
        ]);
        setTerminalState("EXITED");
      } else if (trimmed === "3") {
        // View history
        appendLines([{ text: "\n--- OPERATION HISTORY ---", type: "default" }]);
        if (calcHistory.length === 0) {
          appendLines([{ text: "No calculations recorded yet.", type: "default" }]);
        } else {
          calcHistory.forEach((entry, idx) => {
            appendLines([{ 
              text: `[${idx + 1}] ${entry.timestamp} | ${entry.operation}: ${entry.operand_1} and ${entry.operand_2} = ${entry.result}`,
              type: "default" 
            }]);
          });
        }
        // Reprint menu
        appendLines([...getMenuLines()]);
      } else if (trimmed === "1") {
        setTerminalState("ADD_NUM1_INPUT");
      } else if (trimmed === "2") {
        setTerminalState("DIV_NUM1_INPUT");
      } else {
        appendLines([
          { text: "\n[ERROR] Invalid choice. Please enter a number from 1 to 4.", type: "error" },
          ...getMenuLines()
        ]);
      }
    } else if (terminalState === "ADD_NUM1_INPUT" || terminalState === "DIV_NUM1_INPUT") {
      const isAdd = terminalState === "ADD_NUM1_INPUT";
      const val = parseFloat(trimmed);
      if (isNaN(val) || trimmed === "") {
        appendLines([
          { text: "\n[ERROR] Invalid input! Please enter a valid numerical value. (Simulated ValueError)", type: "error" },
          ...getMenuLines()
        ]);
        setTerminalState("CHOICE");
      } else {
        setTempNum1(val);
        setTerminalState(isAdd ? "ADD_NUM2_INPUT" : "DIV_NUM2_INPUT");
      }
    } else if (terminalState === "ADD_NUM2_INPUT" || terminalState === "DIV_NUM2_INPUT") {
      const isAdd = terminalState === "ADD_NUM2_INPUT";
      const val = parseFloat(trimmed);
      
      if (isNaN(val) || trimmed === "") {
        appendLines([
          { text: "\n[ERROR] Invalid input! Please enter a valid numerical value. (Simulated ValueError)", type: "error" },
          ...getMenuLines()
        ]);
        setTempNum1(null);
        setTerminalState("CHOICE");
      } else {
        const num1 = tempNum1 ?? 0;
        const num2 = val;

        if (isAdd) {
          const result = num1 + num2;
          const newEntry: CalcHistoryEntry = {
            timestamp: getFormattedTime(),
            operation: "Add",
            operand_1: num1,
            operand_2: num2,
            result: result
          };
          setCalcHistory(prev => [...prev, newEntry]);
          appendLines([
            { text: `\n[SUCCESS] Result: ${num1} + ${num2} = ${result}`, type: "success" },
            ...getMenuLines()
          ]);
        } else {
          if (num2 === 0) {
            appendLines([
              { text: "\n[ERROR] Math Error: Cannot divide by zero. (Simulated ZeroDivisionError)", type: "error" },
              ...getMenuLines()
            ]);
          } else {
            const result = num1 / num2;
            const newEntry: CalcHistoryEntry = {
              timestamp: getFormattedTime(),
              operation: "Divide",
              operand_1: num1,
              operand_2: num2,
              result: result
            };
            setCalcHistory(prev => [...prev, newEntry]);
            appendLines([
              { text: `\n[SUCCESS] Result: ${num1} / ${num2} = ${result}`, type: "success" },
              ...getMenuLines()
            ]);
          }
        }
        setTempNum1(null);
        setTerminalState("CHOICE");
      }
    }
    setInputValue("");
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSimulating) return;
    processInput(inputValue);
  };

  // Run a full automation macro sequence to show beautiful step-by-step exception handling
  const runSequence = async (inputs: string[]) => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    // First, let's reset to CHOICE state to ensure predictable flow
    setTerminalState("CHOICE");
    setTempNum1(null);
    appendLines([{ text: "\n--- Starting Automated Python Run ---\n", type: "system" }]);

    for (let i = 0; i < inputs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const val = inputs[i];
      // Type it in
      processInput(val);
    }
    setIsSimulating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get current active prompt text
  const getPromptText = () => {
    if (isSimulating) return "Running simulation...";
    if (terminalState === "CHOICE") return "Select an option (1-4): ";
    if (terminalState === "ADD_NUM1_INPUT" || terminalState === "DIV_NUM1_INPUT") return "Enter first number: ";
    if (terminalState === "ADD_NUM2_INPUT" || terminalState === "DIV_NUM2_INPUT") return "Enter second number: ";
    return "Process terminated. Click reset to restart.";
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
      title: "ZeroDivisionError",
      subtitle: "Encapsulating class logic validation",
      desc: "Rather than doing inline checks in main.py, the core Calculator class raises a Python 'ZeroDivisionError' if the denominator is zero. The main.py file catches this exact exception class and handles it.",
      codeSnippet: `# inside calculator.py
if b == 0:
    raise ZeroDivisionError("Cannot divide by zero.")

# inside main.py
except ZeroDivisionError as e:
    print(f"[ERROR] Math Error: {e}")`
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
        background: "radial-gradient(at 0% 0%, #312e81 0px, transparent 50%), radial-gradient(at 100% 100%, #581c87 0px, transparent 50%), #0f172a"
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
              <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.93 2c-2.4 0-4.5 1.7-4.5 4.3v1.8H12V9H5.7C3.1 9 1 10.9 1 13.5s2 4.4 4.7 4.4h1.7v-2.3c0-2 1.6-3.7 3.5-3.7h4.4c2.5 0 4.6-2.1 4.6-4.6V4.3C20 1.7 17.9 2 15.4 2h-3.47zm.14 20c2.4 0 4.5-1.7 4.5-4.3v-1.8H12V15h6.3c2.6 0 4.7-1.9 4.7-4.5s-2-4.4-4.7-4.4h-1.7v2.3c0 2-1.6 3.7-3.5 3.7H8.7c-2.5 0-4.6 2.1-4.6 4.6v3.1c0 2.6 2.1 2.2 4.6 2.2h3.37z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 id="app-title" className="font-mono text-lg font-bold tracking-tight text-white">
                  Python Calc Engine Simulator
                </h1>
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center gap-1.5 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Running
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-mono">
                  Py 3.11
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Learn robust exceptions and loops with a full-fidelity interactive sandbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#interactive-terminal" 
              className="text-xs bg-white/5 hover:bg-white/10 text-slate-200 px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 border border-white/10 backdrop-blur-md"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Open Live Simulator
            </a>
            <button 
              onClick={() => copyToClipboard(activeTab === "main" ? mainCode : calculatorCode)}
              className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/25"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Code!" : "Copy Active Code"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Side: Code view and explanation panel (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
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
                <span className="text-slate-400 font-mono text-xs select-none">Python Project Files</span>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/5">
                <button
                  id="tab-btn-main"
                  onClick={() => setActiveTab("main")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === "main"
                      ? "bg-indigo-500/20 text-indigo-300 border border-white/10"
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
                      ? "bg-indigo-500/20 text-indigo-300 border border-white/10"
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
              <pre className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto max-h-[480px] bg-black/30 text-slate-300">
                <code>
                  {activeTab === "main" ? (
                    <div>
                      <span className="text-emerald-500">import</span> sys{"\n"}
                      <span className="text-emerald-500">from</span> calculator <span className="text-emerald-500">import</span> Calculator{"\n\n"}
                      <span className="text-purple-400">def</span> <span className="text-blue-400">print_menu</span>():{"\n"}
                      {"    "}print(<span className="text-amber-300">"\\n" + "=" * 40</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"      PROFESSIONAL CALCULATOR CLI      "</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"=" * 40</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"1. Add (+)"</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"2. Divide (/)"</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"3. View History"</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"4. Exit"</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"=" * 40</span>){"\n\n"}
                      <span className="text-purple-400">def</span> <span className="text-blue-400">main</span>():{"\n"}
                      {"    "}<span className="text-slate-500"># Instantiate the calculator</span>{"\n"}
                      {"    "}calc = Calculator(){"\n\n"}
                      {"    "}print(<span className="text-amber-300">"Welcome to the Professional Python Calculator CLI!"</span>){"\n"}
                      {"    "}print(<span className="text-amber-300">"Designed with robust exception handling and state persistence."</span>){"\n\n"}
                      {"    "}<span className="text-teal-400">while</span> <span className="text-yellow-400">True</span>:{"\n"}
                      {"        "}print_menu(){"\n"}
                      {"        "}choice = input(<span className="text-amber-300">"Select an option (1-4): "</span>).strip(){"\n\n"}
                      {"        "}<span className="text-slate-500"># 1. Exit option</span>{"\n"}
                      {"        "}<span className="text-teal-400">if</span> choice == <span className="text-amber-300">"4"</span>:{"\n"}
                      {"            "}print(<span className="text-amber-300">"\\nThank you for using the Calculator CLI. Goodbye!"</span>){"\n"}
                      {"            "}sys.exit(<span className="text-amber-300">0</span>){"\n\n"}
                      {"        "}<span className="text-slate-500"># 2. View History option</span>{"\n"}
                      {"        "}<span className="text-teal-400">elif</span> choice == <span className="text-amber-300">"3"</span>:{"\n"}
                      {"            "}history = calc.get_history(){"\n"}
                      {"            "}print(<span className="text-amber-300">"\\n--- OPERATION HISTORY ---"</span>){"\n"}
                      {"            "}<span className="text-teal-400">if</span> <span className="text-purple-400">not</span> history:{"\n"}
                      {"                "}print(<span className="text-amber-300">"No calculations recorded yet."</span>){"\n"}
                      {"            "}<span className="text-teal-400">else</span>:{"\n"}
                      {"                "}<span className="text-teal-400">for</span> idx, entry <span className="text-purple-400">in</span> <span className="text-purple-400">enumerate</span>(history, <span className="text-amber-300">1</span>):{"\n"}
                      {"                    "}print({" \n"}
                      {"                        "}<span className="text-amber-300">f"[{'{'}idx{'}'}] {'{'}entry['timestamp']{'}'} | "</span>{"\n"}
                      {"                        "}<span className="text-amber-300">f"{'{'}entry['operation']{'}'}: {'{'}entry['operand_1']{'}'} "</span>{"\n"}
                      {"                        "}<span className="text-amber-300">f"and {'{'}entry['operand_2']{'}'} = {'{'}entry['result']{'}'}"</span>{"\n"}
                      {"                    "}){"\n"}
                      {"            "}<span className="text-teal-400">continue</span>{"\n\n"}
                      {"        "}<span className="text-slate-500"># 3. Arithmetic Operations (Add & Divide)</span>{"\n"}
                      {"        "}<span className="text-teal-400">elif</span> choice <span className="text-purple-400">in</span> (<span className="text-amber-300">"1"</span>, <span className="text-amber-300">"2"</span>):{"\n"}
                      {"            "}<span className="text-yellow-400 font-bold bg-teal-950/40 border-l-2 border-teal-500 px-1">try:</span>{"\n"}
                      {"                "}<span className="text-slate-500"># ValueError handling for input conversion</span>{"\n"}
                      {"                "}num1_str = input(<span className="text-amber-300">"Enter first number: "</span>).strip(){"\n"}
                      {"                "}num1 = <span className="text-purple-400">float</span>(num1_str){"\n\n"}
                      {"                "}num2_str = input(<span className="text-amber-300">"Enter second number: "</span>).strip(){"\n"}
                      {"                "}num2 = <span className="text-purple-400">float</span>(num2_str){"\n\n"}
                      {"                "}<span className="text-teal-400">if</span> choice == <span className="text-amber-300">"1"</span>:{"\n"}
                      {"                    "}result = calc.add(num1, num2){"\n"}
                      {"                    "}print(<span className="text-amber-300">f"\\n[SUCCESS] Result: {'{'}num1{'}'} + {'{'}num2{'}'} = {'{'}result{'}'}"</span>){"\n"}
                      {"                "}<span className="text-teal-400">elif</span> choice == <span className="text-amber-300">"2"</span>:{"\n"}
                      {"                    "}result = calc.divide(num1, num2){"\n"}
                      {"                    "}print(<span className="text-amber-300">f"\\n[SUCCESS] Result: {'{'}num1{'}'} / {'{'}num2{'}'} = {'{'}result{'}'}"</span>){"\n\n"}
                      {"            "}<span className="text-yellow-400 font-bold bg-rose-950/40 border-l-2 border-rose-500 px-1">except ValueError:</span>{"\n"}
                      {"                "}<span className="text-slate-500"># Fired if string float parsing fails</span>{"\n"}
                      {"                "}print(<span className="text-amber-300">"\\n[ERROR] Invalid input! Please enter a valid numerical value."</span>){"\n"}
                      {"            "}<span className="text-yellow-400 font-bold bg-rose-950/40 border-l-2 border-rose-500 px-1">except ZeroDivisionError as e:</span>{"\n"}
                      {"                "}<span className="text-slate-500"># Fired if dividing by zero</span>{"\n"}
                      {"                "}print(<span className="text-amber-300">f"\\n[ERROR] Math Error: {'{'}e{'}'}"</span>){"\n"}
                      {"            "}<span className="text-yellow-400 font-bold bg-rose-950/40 border-l-2 border-rose-500 px-1">except Exception as e:</span>{"\n"}
                      {"                "}<span className="text-slate-500"># General safety net</span>{"\n"}
                      {"                "}print(<span className="text-amber-300">f"\\n[ERROR] An unexpected error occurred: {'{'}e{'}'}"</span>){"\n\n"}
                      {"        "}<span className="text-slate-500"># 4. Invalid input option handling</span>{"\n"}
                      {"        "}<span className="text-teal-400">else</span>:{"\n"}
                      {"            "}print(<span className="text-amber-300">"\\n[ERROR] Invalid choice. Please enter a number from 1 to 4."</span>){"\n\n"}
                      <span className="text-purple-400">if</span> __name__ == <span className="text-amber-300">"__main__"</span>:{"\n"}
                      {"    "}main()
                    </div>
                  ) : (
                    <div>
                      <span className="text-emerald-500">import</span> datetime{"\n\n"}
                      <span className="text-purple-400">class</span> <span className="text-blue-400">Calculator</span>:{"\n"}
                      {"    "}<span className="text-slate-400">"""</span>{"\n"}
                      {"    "}<span className="text-slate-400">A core Calculator class responsible for basic math operations</span>{"\n"}
                      {"    "}<span className="text-slate-400">and maintaining a secure logs history.</span>{"\n"}
                      {"    "}<span className="text-slate-400">"""</span>{"\n"}
                      {"    "}<span className="text-purple-400">def</span> <span className="text-blue-400">__init__</span>(self):{"\n"}
                      {"        "}<span className="text-slate-500"># Private attribute prefix _ to indicate internal state</span>{"\n"}
                      {"        "}self._history = []{"\n\n"}
                      {"    "}<span className="text-purple-400">def</span> <span className="text-blue-400">add</span>(self, a: <span className="text-teal-400">float</span>, b: <span className="text-teal-400">float</span>) -&gt; <span className="text-teal-400">float</span>:{"\n"}
                      {"        "}<span className="text-slate-400">"""Adds two floats together and logs the entry."""</span>{"\n"}
                      {"        "}result = a + b{"\n"}
                      {"        "}self._log_operation(<span className="text-amber-300">"Add"</span>, a, b, result){"\n"}
                      {"        "}<span className="text-purple-400">return</span> result{"\n\n"}
                      {"    "}<span className="text-purple-400">def</span> <span className="text-blue-400">divide</span>(self, a: <span className="text-teal-400">float</span>, b: <span className="text-teal-400">float</span>) -&gt; <span className="text-teal-400">float</span>:{"\n"}
                      {"        "}<span className="text-slate-400">"""</span>{"\n"}
                      {"        "}<span className="text-slate-400">Divides the first float by the second float.</span>{"\n"}
                      {"        "}<span className="text-slate-400">Safely raises ZeroDivisionError if division by zero is attempted.</span>{"\n"}
                      {"        "}<span className="text-slate-400">"""</span>{"\n"}
                      {"        "}<span className="text-teal-400">if</span> b == <span className="text-amber-300">0</span>:{"\n"}
                      {"            "}<span className="text-teal-400">raise</span> <span className="text-purple-400">ZeroDivisionError</span>(<span className="text-amber-300">"Cannot divide by zero."</span>){"\n"}
                      {"        "}result = a / b{"\n"}
                      {"        "}self._log_operation(<span className="text-amber-300">"Divide"</span>, a, b, result){"\n"}
                      {"        "}<span className="text-purple-400">return</span> result{"\n\n"}
                      {"    "}<span className="text-purple-400">def</span> <span className="text-blue-400">get_history</span>(self) -&gt; <span className="text-teal-400">list</span>:{"\n"}
                      {"        "}<span className="text-slate-400">"""Returns the logged operations history."""</span>{"\n"}
                      {"        "}<span className="text-purple-400">return</span> self._history{"\n\n"}
                      {"    "}<span className="text-purple-400">def</span> <span className="text-blue-400">_log_operation</span>(self, op_name: <span className="text-teal-400">str</span>, op1: <span className="text-teal-400">float</span>, op2: <span className="text-teal-400">float</span>, result: <span className="text-teal-400">float</span>):{"\n"}
                      {"        "}<span className="text-slate-400">"""Internal helper to record operations with an ISO timestamp."""</span>{"\n"}
                      {"        "}timestamp = datetime.datetime.now().strftime(<span className="text-amber-300">"%Y-%m-%d %H:%M:%S"</span>){"\n"}
                      {"        "}self._history.append({"{"}{"\n"}
                      {"            "}<span className="text-amber-300">"timestamp"</span>: timestamp,{"\n"}
                      {"            "}<span className="text-amber-300">"operation"</span>: op_name,{"\n"}
                      {"            "}<span className="text-amber-300">"operand_1"</span>: op1,{"\n"}
                      {"            "}<span className="text-amber-300">"operand_2"</span>: op2,{"\n"}
                      {"            "}<span className="text-amber-300">"result"</span>: result{"\n"}
                      {"        "}{"})"}{"\n"}
                    </div>
                  )}
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
              <span className="text-indigo-400">Syntax Highlight: Python 3</span>
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
              <div key={sect.id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                <div>
                  <h3 className="text-xs font-mono text-indigo-400 tracking-wider uppercase font-bold">{sect.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{sect.subtitle}</p>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{sect.desc}</p>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Code snippet</span>
                  <pre className="font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                    <code>{sect.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Simulated Live Console/Terminal (5 cols) */}
        <section id="interactive-terminal" className="lg:col-span-5 flex flex-col gap-6 scroll-mt-24">
          
          {/* Simulated Terminal Window */}
          <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden min-h-[500px]">
            
            {/* Terminal Window Header */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
                </div>
                <span className="text-slate-500 text-xs font-mono ml-2 select-none">|</span>
                <span className="text-slate-300 font-mono text-xs flex items-center gap-1.5 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  python-calculator-sandbox (CLI)
                </span>
              </div>
              
              <button 
                onClick={resetTerminal}
                className="text-slate-400 hover:text-white transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Restart script execution"
              >
                <RotateCcw className="w-3 h-3 text-yellow-500" />
                Reset CLI
              </button>
            </div>

            {/* Terminal Output Stream */}
            <div 
              onClick={() => textInputRef.current?.focus()}
              className="p-4 flex-1 overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed space-y-1.5 max-h-[400px] h-[400px] cursor-text custom-scrollbar select-text selection:bg-indigo-500 selection:text-white"
            >
              {terminalLines.map((line) => {
                if (line.type === "input") {
                  return (
                    <div key={line.id} className="text-slate-200">
                      <span className="text-slate-500 select-none mr-2">calc_cli &gt;</span>
                      <span className="text-indigo-300 font-bold">{line.text}</span>
                    </div>
                  );
                } else if (line.type === "error") {
                  return (
                    <div key={line.id} className="text-rose-300 bg-rose-950/25 p-2 rounded border border-rose-900/20 my-1 font-semibold leading-relaxed">
                      {line.text}
                    </div>
                  );
                } else if (line.type === "success") {
                  return (
                    <div key={line.id} className="text-emerald-300 bg-emerald-950/25 p-2 rounded border border-emerald-900/20 my-1 font-semibold">
                      {line.text}
                    </div>
                  );
                } else if (line.type === "system") {
                  return (
                    <div key={line.id} className="text-slate-500 italic select-none">
                      {line.text}
                    </div>
                  );
                } else if (line.type === "menu") {
                  return (
                    <div key={line.id} className="text-amber-300/90 whitespace-pre">
                      {line.text}
                    </div>
                  );
                }
                return (
                  <div key={line.id} className="text-slate-300">
                    {line.text}
                  </div>
                );
              })}
              
              {/* Auto scroll anchor */}
              <div ref={terminalEndRef} />
            </div>

            {/* Interactive Prompt & Input area */}
            <form 
              onSubmit={handleFormSubmit}
              className="bg-black/30 p-4 border-t border-white/5 flex flex-col gap-2"
            >
              <div className="text-slate-400 font-mono text-xs select-none">
                {getPromptText()}
              </div>
              
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-400 select-none animate-pulse" />
                <input
                  ref={textInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={terminalState === "EXITED" || isSimulating}
                  placeholder={terminalState === "EXITED" ? "Process terminated. Click reset above." : "Type input here..."}
                  className="bg-transparent text-slate-100 flex-1 outline-none border-none font-mono text-xs sm:text-[13px] caret-indigo-400 animate-none"
                  autoFocus
                />
                
                <button
                  type="submit"
                  disabled={terminalState === "EXITED" || isSimulating || !inputValue.trim()}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer disabled:bg-white/5 disabled:text-slate-500"
                >
                  Enter
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>

          {/* Recent History Panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                Recent History
              </span>
              {calcHistory.length > 0 && (
                <button 
                  onClick={() => setCalcHistory([])}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto max-h-36 space-y-2 custom-scrollbar pr-1">
              {calcHistory.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4 font-mono">No operations recorded yet.</div>
              ) : (
                calcHistory.slice().reverse().map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 text-xs font-mono">
                    <span className="text-indigo-300 underline underline-offset-4 decoration-indigo-500/50">
                      {entry.operation} Operation
                    </span>
                    <span className="text-slate-200">
                      {entry.operand_1} {entry.operation === "Add" ? "+" : "/"} {entry.operand_2} = {entry.result}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Automation Macros */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Quick Test Scenarios (Python Script Simulator)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click any button below to instantly feed inputs into the simulated console loop and see the error catching logic execute:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => runSequence(["1", "24.5", "17.5"])}
                disabled={isSimulating || terminalState === "EXITED"}
                className="bg-white/5 hover:bg-white/10 text-slate-200 p-3 rounded-xl border border-white/5 transition-all text-xs text-left flex flex-col gap-1 cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-emerald-400 flex items-center justify-between">
                  <span>1. Normal Operation (Add)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-slate-400 text-[11px]">Inputs option '1' then float values '24.5' and '17.5'. Logs success and adds to history.</span>
              </button>

              <button
                onClick={() => runSequence(["2", "8.2", "0"])}
                disabled={isSimulating || terminalState === "EXITED"}
                className="bg-white/5 hover:bg-white/10 text-slate-200 p-3 rounded-xl border border-white/5 transition-all text-xs text-left flex flex-col gap-1 cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-rose-400 flex items-center justify-between">
                  <span>2. Math Exception (Divide by 0)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-slate-400 text-[11px]">Inputs option '2' then '8.2' and '0'. Catches division error safely without crash.</span>
              </button>

              <button
                onClick={() => runSequence(["1", "abc", "4"])}
                disabled={isSimulating || terminalState === "EXITED"}
                className="bg-white/5 hover:bg-white/10 text-slate-200 p-3 rounded-xl border border-white/5 transition-all text-xs text-left flex flex-col gap-1 cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-rose-400 flex items-center justify-between">
                  <span>3. Input Exception (ValueError)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-slate-400 text-[11px]">Inputs option '1' then alphabetical input 'abc'. Catches ValueError parsing error.</span>
              </button>

              <button
                onClick={() => runSequence(["3"])}
                disabled={isSimulating || terminalState === "EXITED"}
                className="bg-white/5 hover:bg-white/10 text-slate-200 p-3 rounded-xl border border-white/5 transition-all text-xs text-left flex flex-col gap-1 cursor-pointer group disabled:opacity-50"
              >
                <div className="font-semibold text-indigo-400 flex items-center justify-between">
                  <span>4. View History option</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-slate-400 text-[11px]">Inputs option '3' to read and display current entries from the Calculator's private history logs.</span>
              </button>
            </div>
          </div>

          {/* Core Exception Cheat-sheet */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Robust python core exceptions
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                In standard script structures, any exception that is unhandled will travel up the stack trace and force python to terminate with a traceback code. 
              </p>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between"><span className="text-rose-400 font-semibold">ValueError</span> <span>→ thrown by float("string") if parsing fails</span></div>
                <div className="flex justify-between"><span className="text-rose-400 font-semibold">ZeroDivisionError</span> <span>→ thrown by self-defined checks on zero denominator</span></div>
                <div className="flex justify-between"><span className="text-rose-400 font-semibold">Exception</span> <span>→ base parent class caught as a general safety net</span></div>
              </div>
            </div>
          </div>
          
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-slate-500 text-xs bg-slate-950/40 mt-12 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>System Healthy: High Availability Node 01</span>
          </div>
          <div className="flex gap-6">
            <span>Calculations this session: {calcHistory.length}</span>
            <span>CPU: 12%</span>
            <span>MEM: 64MB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
