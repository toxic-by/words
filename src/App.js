import { useState, useMemo, useEffect } from "react";
import "./App.css";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
const useWords = (words, text) => {
    const preparedWords = useMemo(() => {
        return words.map((item) => {
            const forms =
                item &&
                item["Словоформы"] &&
                item["Словоформы"].replace(/\s+/, "").split(",");

            const word = item && item["Слово"];
            const t = text.toLowerCase();

            const active = forms.some((form) => {
                const f = form.toLowerCase();
                const regex = new RegExp(
                    `(?<![\u0400-\u04ff])${f}(?![\u0400-\u04ff])`,
                    "g"
                );
                return regex.test(t);
            });
            console.log(active);
            return {
                word,
                active,
            };
        });
    }, [words, text]);

    return [preparedWords];
};

function App() {
    const [data, setData] = useState([]);
    const [uriInupt, setUriInupt] = useState("");
    const [text, setText] = useState("");
    const debouncedText = useDebounce(text, 500);
    const [words] = useWords(data, debouncedText);

    const fetchData = () => {
        fetch(`https://opensheet.elk.sh/${uriInupt}/Словарь/`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setData([]);
                    return;
                }
                setData(data);
            })
            .catch(() => {
                setData([]);
            });
    };
    console.log(words);

    return (
        <div className="App">
            <div className="container-md pt-5 ">
                <div className="words h-25 mb-2 text-center">
                    {words.map(({ word, active }, index) => {
                        const isFound = active ? "bg-warning" : "bg-secondary";
                        return (
                            <span className={`badge ${isFound}`} key={index}>
                                {word}
                            </span>
                        );
                    })}
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        value={uriInupt}
                        className="form-control"
                        placeholder="Enter dictionary spreadsheetId /1etEN5YIIItgtVP-vrUjzt8w9lxzuHvl2dOrLn7my57I/"
                        onInput={(e) => setUriInupt(e.target.value)}
                    ></input>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        id="button-addon2"
                        onClick={fetchData}
                    >
                        Ok
                    </button>
                </div>
                <div className="textContainer">
                    <div className="form-floating">
                        <textarea
                            style={{ height: "300px" }}
                            className="form-control cl"
                            spellCheck="false"
                            defaultValue={text}
                            onInput={(e) => setText(e.target.value)}
                        ></textarea>
                        <label htmlFor="floatingTextarea">Enter text</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
