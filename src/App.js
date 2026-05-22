
import './App.css';
import { createTheme , ThemeProvider } from '@mui/material/styles';
import { useEffect ,useState } from 'react';

// MATERIAL UI COMPONENT
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';

// LAIBRARY
import axios from "axios";
import moment from 'moment/moment';
import "moment/min/locales";
import { useTranslation } from 'react-i18next';

moment.locale("ar");



const theme = createTheme({
  typography:{
    fontFamily:["IBM"]
  }
});
 let cancelAxios = null


function App() {

  const { t, i18n } = useTranslation();
  
 
  const[timeAndDate,setTimeAndDate]=useState("")
  const [temp,setTemp]=useState({
    number:null,
    description:"",
    min:null,
    max:null,
    icon:null,
  })
  const [local,setLocal]=useState("ar")
  const direction = local==="ar" ? "rtl" : "ltr"

  // =====HANDLE EVENTS======
  function handleLanguageClick(){
   if (local==="en"){
    setLocal("ar")
    i18n.changeLanguage("ar")
    moment.locale("ar");
   }else{
    setLocal("en")
    i18n.changeLanguage("en")
    moment.locale("en");
   }
   setTimeAndDate(moment().format('MMMM Do YYYY, h:mm:ss a'))
  }

  useEffect(()=>{
     i18n.changeLanguage(local)
  },[local,i18n])

  useEffect(()=>{
   
    setTimeAndDate(moment().format('MMMM Do YYYY, h:mm:ss a'))
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=24.6877&lon=46.7219&appid=46051dcf6cb58e4a2067b34c20124e7f',
      {
        cancelToken:new axios.CancelToken((c)=>{
          cancelAxios=c;
        })
      }
    )
  .then(function (response) {
    // handle success
    const responsetemp = Math.round(response.data.main.temp - 272.15);
    const min=Math.round(response.data.main.temp_min - 272.15);
    const max=Math.round(response.data.main.temp_max - 272.15);
    const description=response.data.weather[0].description;
    const respicon=response.data.weather[0].icon;

    setTemp({number:responsetemp,
      min:min,
      max:max,
      description:description,
      icon:`https://openweathermap.org/payload/api/media/file/${respicon}.png`,
    })

    console.log(respicon)
    // setTemp(responsetemp);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  return ()=>{
    cancelAxios();
  }
 
  },[])
  return (
    <div className="App" >
        <ThemeProvider theme={theme}>
             <Container maxWidth="sm" >
              <div style={{
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column"
                }}>
                {/* CARD DIV */}
                <div
                dir={direction}
                 style={{
                  width:"100%",
                  background:"#0e3f88",
                  color:"white",
                  padding:"10px", 
                  borderRadius:"15px",
                  boxShadow:"0px 11px 1px rgba(0,0,0,0.05)"}}>
                   {/* content */}
                     <div>
                         {/* city and tim */}
                         <div style={{
                          display:"flex",
                           alignItems:"end",
                          justifyContent:"start",
                         }} 
                          >
                          <Typography variant="h2"  style={{marginRight:"20px"}}>
                                {t("Riyadh")}
                          </Typography>
                          <Typography variant="h6" style={{marginRight:"20px"}} >
                               {timeAndDate}
                          </Typography>

                         </div>
                         {/* end city */}
                         <hr/>
                         {/* degree and descreption */}
                         <div style={{display:"flex",justifyContent:"space-between", padding:"20px"}}>
                          {/* TEMP */}
                           <div>
                              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                  <Typography variant="h1" style={{textAlign:"right"}} >
                                   {temp.number}
                                  </Typography>
                                  {/* TODO:TEMP IMAGE */}
                            
                                   <img alt='not found' src={temp.icon}  />

                              </div>
                           
                            <Typography variant="h8" style={{textAlign:"right"}} >
                                   {t(temp.description)}
                            </Typography>
                            {/* MIN AND MAX */}
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <h5> {t("min")} : {temp.min}</h5>
                              <h5 style={{margin:"0px 5px 0px 5px"}}>|</h5>
                              <h5>  {t("max")} : {temp.max}</h5>
                            </div>
                           </div>
                           {/* TEMP */}
                           {/* ICON */}
                           <div>
                            
                           </div>
                           {/* ICON */}
                           <CloudIcon style={{fontSize:'200px'}}/>
                         </div>
                         {/* degree and descreption */}

                     </div>
                   {/* content */}
                </div>
                {/* END CARD */}
                {/* TRANSLATION CONTENER */}
                <div 
                dir={local==="ar" ? "ltr" : "rtl"}
                style={{
                  width:"100%",
                  display:"flex",
                  justifyContent:"start",
                  marginTop:"20px"}}>
                  <Button style={{color:"white"}} variant="text" onClick={handleLanguageClick} >
                    {local ==="en" ? "arabic" : "انجليزي"}
                  </Button>
                </div>
                
                {/* TRANSLATION CONTENER */}
              </div>
             </Container>  
        </ThemeProvider>
        
      
        
      
     </div>
     

  );
}

export default App;
