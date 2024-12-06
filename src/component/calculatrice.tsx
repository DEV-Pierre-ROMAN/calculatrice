import { useState } from "react";

export const OPERATOR = ["+", "-", "*", "/"];
export const OPERANDE = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

const simpleCalculate = (a: number, b: number, operator: string) => {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      return 0;
  }
};

const useCalcul = () => {
  const [elems, setElems] = useState([""]);

  const pressTouch = (value: string) => {
    if (OPERATOR.includes(value)) {
      if (OPERATOR.includes(elems[elems.length - 1])) {
        setElems([...elems.slice(0, -1), value]);
      } else {
        setElems([...elems, value]);
      }
    } else if (OPERANDE.includes(value)) {
      if (OPERATOR.includes(elems[elems.length - 1])) {
        setElems([...elems, value]);
      } else {
        setElems([...elems.slice(0, -1), elems[elems.length - 1] + value]);
      }
    }
  };

  const clear = () => {
    setElems([""]);
  };

  const calculate = () => {
    let copy = [...elems];

    const priority = ["*/", "+-"];
    for (const operators of priority) {
      for (let i = 0; i < copy.length; i++) {
        if (OPERATOR.includes(copy[i])) {
          const a = parseFloat(copy[i - 1]);
          const b = parseFloat(copy[i + 1]);
          let result = 0;
          for (const operator of operators.split("")) {
            if (operator === copy[i]) {
              result = simpleCalculate(a, b, operator);
              copy = [
                ...copy.slice(0, i - 1),
                result.toString(),
                ...copy.slice(i + 2),
              ];
              i = 0;
            }
          }
        }
      }
    }

    return copy.join(" ");
  };

  return { elems, pressTouch, clear, calculate };
};

export const Calculatrice = () => {
  const { elems, pressTouch, clear, calculate } = useCalcul();

  return (
    <div>
      <div>{elems.join(" ")}</div>
      <div>{calculate()}</div>
      <button onClick={() => pressTouch("1")}>1</button>
      <button onClick={() => pressTouch("2")}>2</button>
      <button onClick={() => pressTouch("*")}>*</button>
      <button onClick={() => pressTouch("+")}>+</button>
      <button onClick={() => clear()} className="bg-danger">
        clear
      </button>
    </div>
  );
};
