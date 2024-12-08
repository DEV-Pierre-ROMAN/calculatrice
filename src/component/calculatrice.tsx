import { useCalcul } from "../hook/useCalcul";
import { OPERANDE, OPERATOR } from "../utils/calculConst";
import { Touch } from "./Touch";

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
