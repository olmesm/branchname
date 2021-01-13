import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import copy from "copy-to-clipboard";
import snakeCase from "lodash/snakeCase";

const TIMER_PERIOD = 3000;

export default function Home() {
  const [outputString, setOutputString] = useState("");
  const [copiedTimeout, setCopiedTimeout] = useState(false);
  const [output, setOutput] = useState({
    "branch-prefix": "feature",
    "is-github-issue": false,
    description: "I like clean code",
  });
  useEffect(() => {
    // if (output["is-github-issue"]) {
    //   setOutputString(
    //     `git checkout -b ${output["branch-prefix"]}/${snakeCase(
    //       output.description
    //     )}`
    //   );

    //   return;
    // }

    setOutputString(
      `git checkout -b ${output["branch-prefix"]}/${snakeCase(
        output.description
      )}`
    );
  }, [output]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopiedTimeout(false);
    }, TIMER_PERIOD);

    return () => {
      clearTimeout(timer);
    };
  }, [copiedTimeout]);

  const onSubmit = (e) => e.preventDefault();
  const updatePrefix = (e, override) => {
    const { value } = override || e.target;

    setOutput((currentState) => ({
      ...currentState,
      [e.target.name]: value,
    }));
  };

  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <div>
      <Head>
        <title>Branchna.me</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </Head>

      <main>
        <h1>Branch Name Constructor</h1>

        <form id="form" onSubmit={onSubmit} onChange={updatePrefix}>
          {/* <fieldset>
            <label htmlFor="is-github-issue">Github Issue?</label>
            <input
              name="is-github-issue"
              id="is-github-issue"
              type="checkbox"
              onChange={(e) => {
                e.stopPropagation();

                updatePrefix(e, { value: !output["is-github-issue"] });
              }}
            />
          </fieldset> */}

          <fieldset>
            <label htmlFor="branch-prefix">Branch Prefix</label>
            <select
              id="branch-prefix"
              name="branch-prefix"
              defaultValue={output["branch-prefix"]}
            >
              <option value="feature">feature</option>
              <option value="bug">bug</option>
              <option value="patch">patch</option>
            </select>
          </fieldset>

          <fieldset>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              ref={inputEl}
              type="input"
              name="description"
              placeholder={output.description}
            />
          </fieldset>
        </form>

        <hr />

        <button
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            background: copiedTimeout ? "#29b5e061" : "",
          }}
          onClick={() => {
            setCopiedTimeout(true);
            copy(outputString);
          }}
        >
          <span>{outputString}</span>
          <span
            style={{
              borderRadius: "0.5rem",
              border: "1px solid black",
              margin: "0.1rem",
              padding: "0.5rem 0.25rem",
            }}
          >
            {copiedTimeout ? "Copied!" : "Copy"}
          </span>
        </button>
      </main>
    </div>
  );
}
