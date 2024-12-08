import { useState } from "react";
import { Touch } from "./Touch";

export const OPERATOR = ["+", "-", "*", "/", "(", ")"];
export const SPECIAL_OPERATOR = ["(", ")"];
export const OPERANDE = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const PRIORITY = ["*/", "+-"];

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

const calculateWithOperators = (elems: string[], operators: string) => {
  let copy = [...elems];

  for (let i = 0; i < copy.length; i++) {
    if (OPERATOR.includes(copy[i])) {
      for (const operator of operators.split("")) {
        if (operator === copy[i]) {
          const a = parseFloat(copy[i - 1]);
          const b = parseFloat(copy[i + 1]);
          let result = 0;

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

  return copy;
};

const calculateElems = (elems: string[]) => {
  let copy = [...elems];

  if (copy.includes("(") && copy.includes(")")) {
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] === ")") {
        const index = copy.slice(0, i).lastIndexOf("(");
        const result = calculateElems(copy.slice(index + 1, i));
        copy = [...copy.slice(0, index), result, ...copy.slice(i + 1)];
        i = 0;
      }
    }
  }

  console.log("calculateElems", copy);

  for (const operators of PRIORITY) {
    copy = calculateWithOperators(copy, operators);
  }

  return copy.join("");
};

const useCalcul = () => {
  const [elems, setElems] = useState([] as string[]);

  const pressTouch = (value: string) => {
    if (OPERATOR.includes(value) && (elems.length > 0 || value === "(")) {
      if (
        OPERATOR.includes(elems[elems.length - 1]) &&
        !SPECIAL_OPERATOR.includes(value) &&
        !SPECIAL_OPERATOR.includes(elems[elems.length - 1])
      ) {
        setElems((actualElem) => [...actualElem.slice(0, -1), value]);
      } else {
        setElems((actualElem) => [...actualElem, value]);
      }
    } else if (OPERANDE.includes(value)) {
      if (OPERATOR.includes(elems[elems.length - 1])) {
        setElems((actualElem) => [...actualElem, value]);
      } else {
        setElems((actualElem) => [
          ...actualElem.slice(0, -1),
          (actualElem[actualElem.length - 1]
            ? actualElem[actualElem.length - 1]
            : "") + value,
        ]);
      }
    }
  };

  const clear = () => {
    setElems([]);
  };

  const suppr = () => {
    setElems((actualElem) =>
      actualElem.length > 0
        ? actualElem[actualElem.length - 1].trim().length > 1
          ? [
              ...actualElem.slice(0, -1),

              actualElem[actualElem.length - 1].substring(
                0,
                actualElem[actualElem.length - 1].length - 1
              ),
            ]
          : [...actualElem.slice(0, -1)]
        : []
    );
  };

  const calculate = () => {
    let copy = [...elems];
    if (
      OPERATOR.includes(copy[copy.length - 1]) &&
      !SPECIAL_OPERATOR.includes(copy[copy.length - 1])
    ) {
      copy = copy.slice(0, -1);
    }

    return calculateElems(copy);
  };

  return { elems, pressTouch, clear, calculate, suppr };
};

export const Calculatrice = () => {
  const { elems, pressTouch, clear, calculate, suppr } = useCalcul();
  const actualClickedElem = [] as string[];

  const callback = (value: string) => {
    if (actualClickedElem.includes(value)) {
      return;
    }
    const index = actualClickedElem.push(value) - 1;

    pressTouch(value);
    actualClickedElem.splice(index, 1);
  };
  return (
    <div className="flex-1 flex bg-gray-800 text-white flex-col  p-2">
      <div className="flex-1 flex flex-col justify-between p-2 pb-4 mb-2 bg-gray-900 rounded max-w-full">
        <div className="result">{elems.join(" ")}</div>
        <h1 className="flex justify-end font-bold text-2xl">
          {elems.length > 0 && "="} {calculate()}
        </h1>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 grid grid-cols-3 gap-2">
          {OPERANDE.reverse().map((value) => (
            <Touch key={value} value={value} callback={callback} />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Touch
            value={"Backspace"}
            callback={() => {
              suppr();
            }}
          >
            suppr.
          </Touch>

          <button
            className="grid bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
            onClick={() => clear()}
          >
            clear
          </button>
          {OPERATOR.map((value) => (
            <Touch key={value} value={value} callback={callback} />
          ))}
        </div>
      </div>
    </div>
  );
};
