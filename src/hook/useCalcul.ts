import { useState } from "react";
import {
  OPERANDE,
  OPERATOR,
  SPECIAL_OPERATOR,
  PRIORITY,
} from "../utils/calculConst";

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

  for (const operators of PRIORITY) {
    copy = calculateWithOperators(copy, operators);
  }

  return copy.join("");
};

export const useCalcul = () => {
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
