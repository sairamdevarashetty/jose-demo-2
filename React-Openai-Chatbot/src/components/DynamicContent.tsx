import React,{useEffect,useRef} from 'react'
import { Container, Grid, TextField, Button, CircularProgress, LinearProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import insuranceData from "./extracted_data.json"; // Adjust path as necessary
import DOMPurify from 'dompurify';
import {marked} from 'marked';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import '../App.css'; // Import your CSS file for additional styling if needed

const defaultdata = [{"content":"¡Hola! soy tu asistente personal. ¿En qué puedo ayudarte?","isUser":false},{"isUser":true,"content":"list of documents"},{"isUser":false,"content":"<p>He encontrado una serie de documentos relacionados con procesos y políticas en un entorno empresarial. Aquí tienes un resumen de los documentos que se encuentran en el archivo:</p>\\n<ol>\\n<li><p><strong>Políticas para Ventas y Trámites de Residencial</strong>: Este documento establece lineamientos para el proceso de venta residencial, incluyendo la vigencia de reservas y documentos requeridos para la confección de contratos.</p>\\n</li>\\n<li><p><strong>Proceso de Oportunidad Comercial</strong>: Incluye procedimientos para la negociación y formalización de contratos, así como la debida diligencia y análisis financiero.</p>\\n</li>\\n<li><p><strong>Proceso de Entrega de Unidades Residenciales y Comerciales</strong>: Define el paso a paso para la entrega de unidades asegurando la satisfacción del cliente.</p>\\n</li>\\n<li><p><strong>Proceso de Terminación de Contrato de Arrendamiento</strong>: Describe los pasos para la terminación de contratos con clientes comerciales.</p>\\n</li>\\n<li><p><strong>Proceso de Oportunidad Comercial con Mejoras</strong>: Detalla los pasos a seguir cuando un cliente solicita mejoras en su unidad, ya sea realizadas por el arrendador o el arrendatario.</p>\\n</li>\\n<li><p><strong>Documentación Requerida</strong>: Incluye listas de documentos necesarios para diferentes procesos, así como formularios específicos para la debida diligencia.</p>\\n</li>\\n</ol>\\n<p>Si necesitas información adicional sobre algún documento específico o aspecto del proceso, no dudes en preguntar.</p>\\n"}]
export function DynamicContent(props) {
    const {messages} = props || defaultdata
  const scrollableDivRef = useRef(null);
  useEffect(() => {
    if (scrollableDivRef.current) {
      setTimeout(() => {
        scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight 
        console.log("messages",messages)
        // scrollableDivRef.current.scrollBy({
        //     top: 100, // Scroll by 100px vertically
        //     behavior: 'smooth', // Optional for a smooth scrolling experience
        // });
      },2000)
    }
  },[messages])

    return (
        <main className="main-content" style={{height:'60vh',overflow:'scroll',marginLeft:'3%',maxWidth: '1024px', margin: 'auto'}}  ref={scrollableDivRef}>
        <Container style={{margin:0,padding:0}}>
          <Grid>
            <Grid container direction="column" spacing={2}>
              {messages.map((message, index) => (
                <Grid item key={index} alignSelf={message.isUser ? "flex-end" : "flex-start"} style={{width:'100%'}}>
                  <Message message={message} />
                  {
                    !message.isUser && 
                    <hr style={{borderTop:" 1px solid #b4e1a9"}}/>
                  }
                </Grid>
              ))}
            </Grid>
          </Grid>
          
        </Container>
        </main>
    )
}