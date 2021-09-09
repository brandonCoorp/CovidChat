const express = require('express')
const app = express()
const {WebhookClient} = require('dialogflow-fulfillment');
const {Suggestion} = require('dialogflow-fulfillment');

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.post('/webhook',express.json(), function (req, res) {
    const agent = new WebhookClient({ request : req, response : res });
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
   
    function welcome(agent) {
      agent.add(`Bienvenido a BotMedic Soy Beymax tu ChatBot Personal`);
      agent.add(`Tengo una lista de Ayudas que puedo Ofrecerte :`);
      agent.add(`1.-Direccion`);
      agent.add(`2.-Horarios de Atencion`);
      agent.add(`3.-Realizar Diagnóstico`);
    }
   
    function fallback(agent) {
      agent.add(`Podrias Escribirlo de nuevo por favor?`);
      agent.add(`Lo siento no puedo entender lo que dices, preguntame otra cosa?`);
    }
  
    function Prueba(agent){
        agent.add(`respondiendo desde nodejs`);
    }

   
    
    function DiagnosticoInicio(agent){
      console.log('Iniciando diagnostico v2');
    //  agent.add("en diagnostico Inicio");
      
      var PreguntaNro = 1;
      var RespuestasArray = [];
      agent.context.set({ name : "evaldata", lifespan : 10 , parameters:{ PreguntaN: PreguntaNro , Respuestas : RespuestasArray }});
      agent.add(Preguntas[0]);
      agent.add(Preguntas[PreguntaNro]);
      agent.add(`Responda con Si o No`);
    }
    function RespuestaSi(){
        console.log('respuesta Si');
        var ContextIn = agent.context.get('evaldata');
        var PreguntaNro = ContextIn.parameters.PreguntaN;
       if (PreguntaNro == 6) {
             agendarCita("Si");        
       }else{
        SiguientePregunta("Si");
       } 
    }
    function RespuestaNo(){
        var ContextIn = agent.context.get('evaldata');
        var PreguntaNro = ContextIn.parameters.PreguntaN;
        if (PreguntaNro == 6) {
            agendarCita("No");        
      }else{
       SiguientePregunta("No");
      } 
    }
    
    function SiguientePregunta(IntentAnswer){
        console.log('siguientePreg');
     var ContextIn = agent.context.get('evaldata');
     var PreguntaNro = ContextIn.parameters.PreguntaN;
     var RespuestasArray = ContextIn.parameters.Respuestas;
    RespuestasArray.push(IntentAnswer);

      if(PreguntaNro < NroPreguntas){
         PreguntaNro = PreguntaNro + 1;
         agent.context.set({ name : "evaldata", lifespan : 10 , parameters:{ PreguntaN: PreguntaNro , Respuestas : RespuestasArray }});
         agent.add(Preguntas[PreguntaNro]);
         agent.add(`Responda con Si o No`);
      }else{
      console.log("Procesando Respuesta");
        EvaluarRespuestas(RespuestasArray);
      }
    
    }
    
    function EvaluarRespuestas(Resp){
    console.log(Resp);
     var  cantSi = 0;   
    for (let i = 0; i < Resp.length; i++) {
           const element = Resp[i];
          if (element == 'Si') {
               cantSi++;              
          } 
       }
    if (cantSi>2) {
        var ContextIn = agent.context.get('evaldata');
        var PreguntaNro = ContextIn.parameters.PreguntaN;
        PreguntaNro = PreguntaNro + 1 ;
        var RespuestasArray = ContextIn.parameters.Respuestas;
        agent.context.set({ name : "evaldata", lifespan : 10 , parameters:{ PreguntaN: PreguntaNro , Respuestas : RespuestasArray }});

        agent.add(`Es Probable que usted Tenga Covid-19 le Recomendamos Que visite su Medico o agende una Cita con Nosotros para Realizarle la Prueba.`);
        agent.add(`Desea Agendar Una Cita?`);
        agent.add(`Responda con Si o No`);          
    }else{
       agent.add(`Es Probable que Usted no tenga Covid, si en los proximos horas o Dias presenta un nuevo sintoma
       entonces realize la prueba nuevamente, que tenga buen Dia`);
      } 
    
    }
    
  function agendarCita(Resp){
      if(Resp == 'Si'){
        agent.add(`Se agendó su cita Para Mañana A las 10:00 AM.`);
        agent.add(`Que tenga buen día`);
      }else{
        agent.add(`Ok Cuidese Mucho que tenga Buen Día.`);
 
      }
  }

    const NroPreguntas = 5;
    const Preguntas = [ 
      "Primera Pregunta :",
      "Tiene dolores de cabeza con escalofríos, fiebre?",
      "Al momento de pararse o realizar alguna accion siente Mareo o cansancio?",
      "Tiene ardor en la Garganta y no puede calmara su sed acompañada con una Tos Seca?",
      "A Perdido El Gusto o El olfato o Ambos?",
      "Presenta un malestar estomacal que le produce ganas de ir al baño continuamente?",
    ];
    
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Diagnostico', DiagnosticoInicio);
    intentMap.set('RespuestaSi', RespuestaSi);
    intentMap.set('RespuestaNo', RespuestaNo);
    intentMap.set('Prueba', Prueba);
    
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);

  })
   
app.listen(3000, ()=>{ console.log("servidor on");})