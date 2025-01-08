import React, { useState, useEffect,useRef } from "react";
import { Container, Grid, TextField, Button, CircularProgress, LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import OpenAI from "openai";
import { MessageDto } from "../models/MessageDto"; // Adjust path as necessary
import Message from "./Message";
import insuranceData from "./extracted_data.json";
import data from './output.json';
 // Adjust path as necessary
import DOMPurify from 'dompurify';
import {checkSentenceSimilarity} from '../utils/similarty'

import {marked} from 'marked';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import '../App.css'; // Import your CSS file for additional styling if needed
import { DynamicContent } from "./DynamicContent";
import { traceable } from "langsmith/traceable";;


// const langsmith = new Langsmith({
//   projectId: "Asistente Somos Seguros", // Replace with your actual project ID
//   apiKey: "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", // Replace with your actual API key
// });

const assistantId = "asst_QV3vvECG3wwHVqmrhJ8U48u9"; // Pre-defined assistant ID


const Chat: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([]);
  const [input, setInput] = useState<string>("");
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);


  useEffect(() => {
    initChatBot();

  }, []);

  useEffect(() => {
    setMessages([
      {
        content: "¡Hola! soy tu asistente personal. ¿En qué puedo ayudarte?",
        isUser: false,
      },
    ]);
    // setMessages(JSON.parse(`[{"content":"¡Hola! soy tu asistente personal. ¿En qué puedo ayudarte?","isUser":false},{"isUser":true,"content":"Comparar las políticas de cobertura de ASSA con las de PALIG."},{"isUser":false,"content":"<p>Para comparar las políticas de cobertura de ASSA y PALIG, he extraído información relevante de los documentos proporcionados. A continuación, presento una tabla comparativa con los aspectos clave de las coberturas de ambas compañías:</p>\\n<pre><code class=\\"language-html\\">&lt;style&gt;\\n  .comparison-table {\\n    width: 100%;\\n    margin: 20px 0;\\n    border-collapse: collapse;\\n    border-spacing: 0;\\n    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);\\n    font-family: 'Roboto', sans-serif;\\n    border-radius: 4px;\\n    overflow: hidden;\\n  }\\n\\n  .comparison-table th {\\n    background-color: #f2f2f2;\\n    font-weight: bold;\\n    padding: 16px;\\n    text-align: left;\\n    border-bottom: 1px solid rgba(224, 224, 224, 1);\\n  }\\n\\n  .comparison-table td {\\n    padding: 16px;\\n    text-align: left;\\n    border-bottom: 1px solid rgba(224, 224, 224, 1);\\n  }\\n&lt;/style&gt;\\n\\n&lt;div style=\\"margin: 20px;\\"&gt;\\n  &lt;h3&gt;Comparación de Políticas de Cobertura: ASSA vs PALIG&lt;/h3&gt;\\n  &lt;table class=\\"comparison-table\\"&gt;\\n    &lt;thead&gt;\\n      &lt;tr&gt;\\n        &lt;th&gt;Aspecto&lt;/th&gt;\\n        &lt;th&gt;ASSA&lt;/th&gt;\\n        &lt;th&gt;PALIG&lt;/th&gt;\\n      &lt;/tr&gt;\\n    &lt;/thead&gt;\\n    &lt;tbody&gt;\\n      &lt;tr&gt;\\n        &lt;td&gt;Monto Máximo de Cobertura&lt;/td&gt;\\n        &lt;td&gt;Hasta B/. 50,000.00 por año y B/. 250,000.00 vitalicio para condiciones congénitas&lt;/td&gt;\\n        &lt;td&gt;Hasta B/. 1,000,000.00 por año y B/. 2,500,000.00 vitalicio&lt;/td&gt;\\n      &lt;/tr&gt;\\n      &lt;tr&gt;\\n        &lt;td&gt;Alcance Geográfico&lt;/td&gt;\\n        &lt;td&gt;Local e Internacional&lt;/td&gt;\\n        &lt;td&gt;Local e Internacional&lt;/td&gt;\\n      &lt;/tr&gt;\\n      &lt;tr&gt;\\n        &lt;td&gt;Deducibles&lt;/td&gt;\\n        &lt;td&gt;B/. 1,000.00 anual para ciertos tratamientos&lt;/td&gt;\\n        &lt;td&gt;B/. 500.00 anual para ciertos tratamientos&lt;/td&gt;\\n      &lt;/tr&gt;\\n      &lt;tr&gt;\\n        &lt;td&gt;Copagos&lt;/td&gt;\\n        &lt;td&gt;20% para ciertos servicios&lt;/td&gt;\\n        &lt;td&gt;15% para ciertos servicios&lt;/td&gt;\\n      &lt;/tr&gt;\\n      &lt;tr&gt;\\n        &lt;td&gt;Beneficios Adicionales&lt;/td&gt;\\n        &lt;td&gt;Repatriación de restos mortales, cobertura dental, VIH/SIDA, maternidad&lt;/td&gt;\\n        &lt;td&gt;Repatriación de restos mortales, cobertura dental, VIH/SIDA, maternidad&lt;/td&gt;\\n      &lt;/tr&gt;\\n    &lt;/tbody&gt;\\n  &lt;/table&gt;\\n&lt;/div&gt;\\n</code></pre>\\n<h3>Detalles de las Coberturas de ASSA</h3>\\n<ul>\\n<li><strong>Monto Máximo de Cobertura</strong>: Hasta B/. 50,000.00 por año y B/. 250,000.00 vitalicio para condiciones congénitas.</li>\\n<li><strong>Alcance Geográfico</strong>: Local e Internacional.</li>\\n<li><strong>Deducibles</strong>: B/. 1,000.00 anual para ciertos tratamientos.</li>\\n<li><strong>Copagos</strong>: 20% para ciertos servicios.</li>\\n<li><strong>Beneficios Adicionales</strong>: Repatriación de restos mortales, cobertura dental, VIH/SIDA, maternidad.</li>\\n</ul>\\n<h3>Detalles de las Coberturas de PALIG</h3>\\n<ul>\\n<li><strong>Monto Máximo de Cobertura</strong>: Hasta B/. 1,000,000.00 por año y B/. 2,500,000.00 vitalicio.</li>\\n<li><strong>Alcance Geográfico</strong>: Local e Internacional.</li>\\n<li><strong>Deducibles</strong>: B/. 500.00 anual para ciertos tratamientos.</li>\\n<li><strong>Copagos</strong>: 15% para ciertos servicios.</li>\\n<li><strong>Beneficios Adicionales</strong>: Repatriación de restos mortales, cobertura dental, VIH/SIDA, maternidad.</li>\\n</ul>\\n<p>Esta tabla proporciona una comparación clara y estructurada de las políticas de cobertura de ASSA y PALIG, destacando los aspectos más importantes para facilitar la toma de decisiones.</p>\\n"}]`))   
    // setMessages(JSON.parse(`[{"content":"¡Hola! soy tu asistente personal. ¿En qué puedo ayudarte?","isUser":false},{"isUser":true,"content":"Qué plan de salud ofrece dos opciones de seguro de gastos médicos?"},{"isUser":false,"content":"<p>El plan de salud \\"Health Trust\\" de Pan American Life Insurance de Panamá (PALIG) ofrece dos opciones de seguros de gastos médicos. Este plan incluye también la protección de un seguro de vida para el titular por $20,000 como parte de sus beneficios.</p>\\n"},{"isUser":true,"content":"Qué plan de salud ofrece dos opciones de seguro de gastos médicos?"},{"isUser":false,"content":"<p>El plan de salud \\"Health Trust\\" de Pan American Life Insurance de Panamá (PALIG) ofrece dos opciones de seguros de gastos médicos. Este plan incluye también la protección de un seguro de vida para el titular por $20,000 como parte de sus beneficios.</p>\\n"},{"isUser":true,"content":"Qué plan de salud ofrece dos opciones de seguro de gastos médicos?"},{"content":"¡Hola! soy tu asistente personal. ¿En qué puedo ayudarte?","isUser":false},{"isUser":true,"content":"Qué plan de salud ofrece dos opciones de seguro de gastos médicos?"},{"isUser":false,"content":"<p>El plan de salud \\"Health Trust\\" de Pan American Life Insurance de Panamá (PALIG) ofrece dos opciones de seguros de gastos médicos. Este plan incluye también la protección de un seguro de vida para el titular por $20,000 como parte de sus beneficios.</p>\\n"},{"isUser":true,"content":"Qué plan de salud ofrece dos opciones de seguro de gastos médicos?"},{"isUser":false,"content":"<p>El plan de salud \\"Health Trust\\" de Pan American Life Insurance de Panamá (PALIG) ofrece dos opciones de seguros de gastos médicos. Este plan incluye también la protección de un seguro de vida para el titular por $20,000 como parte de sus beneficios.</p>\\n"},{"isUser":true,"content":"Qué plan de salud ofrece dos opciones de seguro de gastos médicos?"}]`))
  }, []);

  const initChatBot = async () => {
    if (openai !== null) {
      return; // If OpenAI instance already exists, do nothing
    }

    const openaiInstance = new OpenAI({
      apiKey: process?.env.OPEN_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Create a thread
    const newThread = await openaiInstance.beta.threads.create();

    setOpenai(openaiInstance);
    setThread(newThread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    let formattedContent:any = isUser ? content : marked(content);
    // Sanitize the HTML content
    formattedContent = DOMPurify.sanitize(formattedContent);
    const newMessage = new MessageDto(isUser, formattedContent);
    return newMessage;
  };


  const fetchFASTAPI = async (query) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "query":query
    });
    
    const requestOptions:any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    let res = await fetch("http://172.97.66.105:8000/search_query", requestOptions);
    return res.json();
  }

  const fetchFASTAPI2 = async (query) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "question":query
    });
    
    const requestOptions:any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    let res = await fetch("http://172.97.66.105:8000/find_plans", requestOptions);
    return res.json();
  }


  const handleSendMessage = async () => {
    if (!openai || !thread) {
      console.error("OpenAI is not initialized or thread is missing.");

      // langsmith.trackEvent({
      //   action: "send_message",
      //   message: input,
      //   timestamp: new Date().toISOString(),
      // });

      return;
    }

    const updatedMessages = [...messages, createNewMessage(input, true)];
    setMessages(updatedMessages);
    // langsmith.trackEvent({
    //   action: "send_message",
    //   message: input,
    //   status: "sent",
    //   timestamp: new Date().toISOString(),
    // });
    setInput("");
    setIsWaiting(true);


    


    // Example: Querying JSON data
    let query = input.toLowerCase();
    if(query.includes("world wide  medical")) {
      query.replace("world wide medical","wwm");
    }
    const matchedPlans = insuranceData.filter(Department =>
      Department.Department.toLowerCase().includes(query) || Department.File_type.toLowerCase().includes(query)
    );

    if (matchedPlans.length > 0) {
      const response = matchedPlans.map(Department => (
        `Department: ${Department.Department}\File_type: ${Department.File_type}\Text: ${Department.Text}}`
      )).join("\n\n");

      setMessages([...updatedMessages, createNewMessage(response, false)]);
      // langsmith.trackEvent({
      //   action: "receive_message",
      //   message: response,
      //   status: "received",
      //   timestamp: new Date().toISOString(),
      // });
      setIsWaiting(false);
    } else {
      // If no match found in JSON, use OpenAI assistant
      try {
        // Send a message to the thread
        if(query.includes('aerea') && query.includes('ambulancia')) {
          let apiresponse:any  = await fetchFASTAPI2(input) 
          console.log("apiresponse",apiresponse)
          let plans: any = apiresponse.plans;

          let uniqueData = Array.from(
            new Map(plans.map(item => [`${item.plan}-${item.compania}`, item])).values()
          );


          let data:any = uniqueData.reduce((initial,x:any)=>{return  initial +`El plan es ${ x.plan} de la compañía  ${x.compania}  \n\n` },'')
          setMessages([...updatedMessages,createNewMessage(data,false)])
          setIsWaiting(false);
          return
        }
        const flag = processQuestion(query);
        console.log("flag",flag)
        if (flag == true) {

          let apiresponse:any  = await fetchFASTAPI(input) 
          console.log("apiresponse",apiresponse)
          setMessages([...updatedMessages,createNewMessage(apiresponse.plans.join("\n\n"),false)])
          setIsWaiting(false);
          return
        }
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: input,
        });


        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistantId,
        });

        // Create a response
        let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        // Wait for the response to be ready
        while (response?.status === "in_progress" || response?.status === "queued") {
          console.log("waiting...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        setIsWaiting(false);

        // Get the messages for the thread
        const messageList = await openai.beta.threads.messages.list(thread.id);

        // Find the last message for the current run
        const lastMessage = messageList?.data
          .filter((message: any) => message.run_id === run.id && message.role === "assistant")
          .pop();

        // Print the last message coming from the assistant
        if (lastMessage) {
          let annotationsList = [];
          let newmessage = lastMessage.content[0]?.text?.value || "No response from assistant"
          
          if (lastMessage.content[0]?.text?.annotations) {
            annotationsList = lastMessage.content[0]?.text?.annotations.map((x:any) => x.text)
          }
          annotationsList.forEach((trimstring) => {
            newmessage = newmessage.replace(trimstring,"")
          })
          setMessages([...updatedMessages, createNewMessage(newmessage, false)]);
        }
      } catch (error) {
        console.error("Error processing message with OpenAI:", error);
        setIsWaiting(false); // Ensure loading indicator is turned off on error
      }
    }


    
  };

let knownCompanies:any = data.map((x) => (x.compania))

knownCompanies = knownCompanies.filter(function(item, pos) {
  return knownCompanies.indexOf(item) == pos;
})


  function processQuestion(query) {
      // Initialize flag
      let flag = false;

      // Check if the query mentions a company
      const companiesMentioned = extractCompanies(query);
      if (companiesMentioned.length > 0) {
        flag = true; // Set flag to True if company is detected
      }

      // Check if the query asks for all products (general query)
      const allProductsKeywords = [
        "todos los productos",
        "productos disponibles",
        "qué productos hay",
        "cuáles son los productos",
        "Cuales son los productos de salud en",
        "Cuales son los planes de salud",
      ];
      if (allProductsKeywords.some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
        flag = true; // Set flag to True if it's a general product query
      }

      // Return the flag
      return flag;
  }

  // Function to detect company names mentioned in the query (basic matching)
  function extractCompanies(query) {
    const companiesMentioned = [];
    for (const company of knownCompanies) {
      if (query.toLowerCase().includes(company.toLowerCase())) {
        companiesMentioned.push(company);
      }
    }
    return companiesMentioned;
  }




 

  function trimString(str, start, end) {
    if (start < 0 || end > str.length || start >= end) {
      throw new Error("Invalid start or end index");
    }
    return str.substring(start, end);
  }
  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>

      <DynamicContent messages={messages} />

      <Grid style={{position: 'fixed', bottom:70,width:'94%',backgroundColor: 'white',zIndex:100,maxWidth: '1024px', margin: 'auto',left:0,right:0}}>
          <Grid container direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item xs={12}>
              <TextField
                placeholder="Escribe tu mensaje"
                variant="outlined"
                fullWidth
                value={input}
                style={{border:10}}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius:20,
                      borderColor: '#a1da9f !important'
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize:'large'
                    }
                  },
                }}
                
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isWaiting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant='contained' style={{
                        borderRadius: '50%',
                        minWidth: '40px',
                        minHeight: '40px',
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        backgroundColor: '#a1da9f',
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"  
                          style={{strokeWidth: 1.5,
                            flexShrink: 0,
                            height: '2rem',
                            width: '2rem',
                          }}
                          onClick={handleSendMessage}
                        viewBox="0 0 32 32" ><path fill="currentColor" fill-rule="evenodd" d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z" clip-rule="evenodd"></path></svg>
                      </Button>                     
                    </InputAdornment>
                  ),
                }} 
              />
              {isWaiting && <LinearProgress color="primary" />}
            </Grid>
            
            
          </Grid>
          <footer 
            // className="App-header" 
            style={{
              width: '100%',
              fontSize: 'x-small',
              // position: 'fixed',
              // bottom: '20px',
              // height: '70px',
              marginTop:20,
              position:'absolute'
            }}>
            Derechos de autor © 2024 Somos seguros. Todos los derechos reservados. Para consultas e información 302-5580 (Central y WhatsApp).
            REGULADO Y SUPERVISADO POR LA SUPERINTENDENCIA DE SEGUROS Y REASEGUROS DE PANAMÁ
       </footer>            
      </Grid>  
    </>
  );
};

export default Chat;