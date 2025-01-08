import React from 'react';
import './App.css'; // Import your CSS file for additional styling if needed
import Chat from './components/Chat';
import Logo from '../src/somos_seguros_logo_horizontal1.png';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <a href='https://brandfactors.com/' target="_blank" style={{textDecoration: 'none',color:'inherit'}}>
          <div className="header-content" style={{marginTop:20}}>    
              <img src={Logo} alt="Logo" className="logo" style={{width:'320px',height:'100px'}} />
            {/* <h3 className="app-title" style={{margin:0}}> por Pólizas de Salud</h3> */}
          </div>
        </a>
      </header>

      
       
      <Chat />
      
    </div>
  );
};

export default App;
