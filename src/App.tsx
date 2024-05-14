import { useState } from "react";
import "./App.css";
import ollama from "ollama";
import { Circles } from "react-loader-spinner";

function App() {
  const [modelResponse, setModelResponse] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const chatConfig = {
    model: "mistral",
    role: "user",
    content:
      "Write a 6000 character long essay about the Danube, containing interesting facts and famous history events",
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
      setModelResponse([...modelResponse, response.message.content]);
      setPage(page + 1);
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
      <div>
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
          <p>{modelResponse[page]}</p>
        </>
      ) : (
        <p>Press the button to generate an essay about the Danube</p>
      )}
    </>
  );
}

export default App;
