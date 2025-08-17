import { useState } from 'react'
import './App.css'

function App() {
 const [toEmail, setToEmail] = useState("");
  const [fileContent, setFileContent] = useState("");
  const[doc ,setDoc] =useState("");
  const [summary, setSummary] = useState(""); 

  const FileUpload = async (e)=>{
     const file= e.target.files[0];
     if (file && file.type === "text/plain") {
       
            setDoc(file.name);
      const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target.result;
      setFileContent(content);
      const summaryText = await generateSummaryResponseAPI(content);
      setSummary(summaryText);
    };
      reader.readAsText(file);
    }
    else{
       alert("Invalid File");
    }
  }

 

async function generateSummaryResponseAPI(fileContent) {
  const payload = {
    model: "gpt-oss-20b",
    input: `Summarize the following in about 250 words:\n\n${fileContent}`,
    max_output_tokens: 400
  };
  const apiKey = process.env.GROQ_API_KEY;

  const res = await fetch("https://api.groq.com/openai/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || data.output;
}
 const handleSend = async () => {
  try {
    const res = await fetch("http://localhost:5000/send-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toEmail, summary }),
    });

    if (res.ok) {
      alert("Email sent successfully!");
    } else {
      alert(" Failed to send email");
    }
  } catch (error) {
    console.error(error);
    alert("Error connecting to server");
  }
};


    
  return (
    <>
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Upload Text File</h2>

      {/* File Input */}
      <input
        type="file"
        accept=".txt"
        onChange={FileUpload}
        className="mb-4"
      />

      {/* Show File Name */}
      {doc && <p className="font-medium">📄 File: {doc}</p>}

      {/* Show File Content
      {fileContent && (
        <div className="mt-3 p-3 border rounded bg-gray-50 whitespace-pre-wrap">
          <h3 className="font-semibold">File Content:</h3>
          <pre>{fileContent}</pre>
        </div>
      )} */}

       {summary && (
  <div className="mt-3">
    <h3 className="font-semibold">Summary:</h3>
    <textarea
      value={summary}
      onChange={e => setSummary(e.target.value)}
      rows={10}
      className="w-full border rounded p-2"
    />
  </div>
)}

   <input
        type="email"
        placeholder="Recipient Email"
        value={toEmail}
        onChange={(e) => setToEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />

        <button
         onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send Email
      </button>

    </div>
    </>
  )
}

export default App
