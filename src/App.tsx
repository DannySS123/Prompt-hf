import { useState } from "react";
import "./App.css";
import ollama from "ollama";
import { Circles } from "react-loader-spinner";

function App() {
  const [modelResponse, setModelResponse] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(-1);
  const [keywords, setKeywords] = useState("");
  const [numberOfWords, setNumberOfWords] = useState(600);

  const chatConfig = {
    model: "mistral",
    role: "user",
    content: `Write a ${numberOfWords} words long essay about the Danube and talk about the following keywords: ${keywords}`,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function invokeLLM(props: any) {
    console.log(`-----`);
    console.log(`[${props.model}]: ${props.content}`);
    console.log(`-----`);
    try {
      console.log(`Running prompt...`);
      const response = await ollama.chat({
        model: props.model,
        messages: [{ role: props.role, content: props.content }],
      });
      console.log(`${response.message.content}\n`);
      const lastPoz = modelResponse.length;
      setModelResponse([...modelResponse, response.message.content]);
      setPage(lastPoz);
    } catch (error) {
      console.log(`Query failed!`);
      console.log(error);
      alert(error);
    }
  }

  const onGenerateClick = async () => {
    setLoading(true);
    await invokeLLM(chatConfig);
    setLoading(false);
    console.log(keywords);
    /*const a = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      mode: "cors",
      body: {
        model: "mistral",
        prompt: "Why is the sky blue?",
      },
    });
    console.log(a);*/
  };

  const nextResponse = () => {
    if (page < modelResponse.length - 1) {
      setPage(page + 1);
    }
  };

  const prevResponse = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <h1>Duna essay writer</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <h3 style={{ margin: "0px" }}>Keywords:</h3>
            <input
              style={{ borderRadius: "10px", fontSize: "20px", height: "40px" }}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <h3 style={{ margin: "0px" }}>Number of words:</h3>
            <input
              type="number"
              style={{
                borderRadius: "10px",
                fontSize: "20px",
                height: "40px",
                width: "100px",
              }}
              value={numberOfWords}
              onChange={(e) => setNumberOfWords(Number(e.target.value))}
            />
          </div>
        </div>
        <button disabled={loading} onClick={onGenerateClick}>
          Generate essay
        </button>
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "40px",
          }}
        >
          <Circles height="80" width="80" color="green" ariaLabel="loading" />
          <h2>Loading...</h2>
        </div>
      )}
      {modelResponse.length > 1 && (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <button disabled={page === 0} onClick={prevResponse}>
            Prev
          </button>
          <button
            disabled={page === modelResponse.length - 1}
            onClick={nextResponse}
          >
            Next
          </button>
        </div>
      )}
      {modelResponse.length > 0 ? (
        <>
          <h3>Response</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              textAlign: "left",
              fontFamily: "cursive",
              fontSize: "20px",
            }}
          >
            {modelResponse[page]}
          </pre>
        </>
      ) : (
        !loading && (
          <p>Press the button to generate an essay about the Danube</p>
        )
      )}
    </>
  );
}

export default App;
