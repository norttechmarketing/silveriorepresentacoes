import { useEffect, useRef, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, Blocks, Building2, Layers, Mail, MessageCircle, Pause, Play, Plus, Scissors } from 'lucide-react';
import contact from './contact.json';

const links = [['sobre','Sobre nós'],['solucoes','Soluções'],['blog','Blog'],['contato','Contato']];
const solutions = [
  {title:'Painéis em EPS', icon:Building2, summary:'Converse sobre soluções em EPS para o fechamento e a construção de paredes.'},
  {title:'Lajotas para lajes', icon:Layers, summary:'Lajotas em EPS para lajes nervuradas. Informe o sistema de laje e as dimensões previstas no projeto.'},
  {title:'Blocos para recorte', icon:Scissors, summary:'Blocos de EPS para recortadores e aplicações industriais. Consulte dimensões e densidades.'},
  {title:'EPS para colchões', icon:Blocks, summary:'Soluções de enchimento em EPS para fabricantes de colchões. Informe o formato e a demanda da sua linha de produção.'},
  {title:'Placas de isolamento', icon:Layers, summary:'Placas em EPS para isolamento térmico. Consulte opções de acordo com a aplicação e a especificação do projeto.'},
];
const articles = [
  {tag:'Planejamento',title:'O que enviar para receber uma cotação de EPS?',body:'Informe a aplicação, as dimensões, a quantidade estimada, o CEP de entrega e a data em que precisa receber o material. Se o projeto já especifica a densidade ou o tipo de peça, inclua esses dados. Assim a equipe consegue consultar a opção adequada e alinhar o prazo com você.'},
  {tag:'Construção civil',title:'Como conversar sobre lajotas para sua obra',body:'Comece pelo projeto da laje. Confira com o responsável técnico as dimensões e o formato das peças previstos para o sistema escolhido. Ao cotar, compartilhe também a quantidade, o local de entrega e a etapa da obra em que as lajotas serão usadas.'},
  {tag:'Compras industriais',title:'O que definir antes de pedir blocos para recorte',body:'Descreva a peça final, as medidas do bloco de partida e as características exigidas pelo seu processo. Informe a demanda por lote e a frequência de compra. Esses dados ajudam a conversar sobre material, disponibilidade e programação das entregas.'},
];
const whatsapp = (text='Olá! Gostaria de conversar sobre soluções em EPS.') => 'https://wa.me/'+contact.phone+'?text='+encodeURIComponent(text);

function Solutions(){
  const [active,setActive]=useState(2);
  const [paused,setPaused]=useState(false);
  const [engaged,setEngaged]=useState(false);
  const reduced=useReducedMotion();
  useEffect(()=>{
    if(paused||engaged||reduced)return;
    const timer=window.setInterval(()=>setActive(prev=>(prev+1)%solutions.length),5500);
    return ()=>window.clearInterval(timer);
  },[paused,engaged,reduced]);
  const current=solutions[active];
  const Icon=current.icon;
  return <section className="solutions" id="solucoes">
    <div className="shell solution-intro"><p className="mono label">Soluções</p><h2>EPS da obra<br/>à indústria.</h2><p>Selecione a aplicação para conhecer as opções e conversar com a Silvério.</p></div>
    <div className="shell chapter-grid" onMouseEnter={()=>setEngaged(true)} onMouseLeave={()=>setEngaged(false)}>
      <div className="chapter-visual">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={current.title} className="chapter-image" initial={reduced?false:{opacity:0,scale:1.03}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:reduced?0:.32}}>
            <Icon className="chapter-fallback" size={70} strokeWidth={.8}/>
            <span className="chapter-name">{current.title}</span>
          </motion.div>
        </AnimatePresence>
        <div className="chapter-control"><span className="mono">{String(active+1).padStart(2,'0')} / 05</span><button type="button" onClick={()=>setPaused(!paused)} aria-label={paused?'Reproduzir apresentação':'Pausar apresentação'}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div>
      </div>
      <div className="chapter-list" aria-label="Aplicações de EPS">
        {solutions.map((item,i)=><button type="button" className="chapter-option" key={item.title} aria-pressed={active===i} onClick={()=>{setActive(i);setPaused(true);}}><span className="mono">{String(i+1).padStart(2,'0')}</span><strong>{item.title}</strong><ArrowUpRight size={21}/></button>)}
        <p className="chapter-summary">{current.summary}</p>
        <a className="button pale" href={whatsapp('Olá! Gostaria de cotar '+current.title.toLowerCase()+'.')} target="_blank" rel="noopener noreferrer">Consultar esta solução <ArrowUpRight size={18}/></a>
      </div>
    </div>
  </section>;
}

export function App(){
  const [menu,setMenu]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    if(!menu)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setMenu(false);menuButton.current?.focus();}};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[menu]);
  return <>
    <a className="skip" href="#conteudo">Pular para o conteúdo</a>
    <header className="masthead shell" id="inicio">
      <div className="wordmark" aria-label="Silvério">{[...'SILVÉRIO'].map((letter,i)=><motion.span aria-hidden="true" key={i} initial={false} animate={reduced?undefined:{y:['36%','0%'],opacity:[0,1]}} transition={{delay:i*.045,duration:.7,ease:[.16,1,.3,1]}}>{letter}</motion.span>)}</div>
      <div className="mast-nav">
        <a className="mono identity" href="#inicio">Representação<br/>comercial</a>
        <p className="mono tagline">Atendimento humano.<br/>Conhecimento técnico em EPS.</p>
        <nav className="nav-links mono" aria-label="Menu principal">{links.map(([id,label])=><a href={'#'+id} key={id}>{label}</a>)}</nav>
        <button className="menu-button" type="button" ref={menuButton} aria-label={menu?'Fechar menu':'Abrir menu'} aria-controls="menu-expandido" aria-expanded={menu} onClick={()=>setMenu(!menu)}><span/><span/></button>
      </div>
      <AnimatePresence>{menu&&<motion.nav className="menu-panel mono" id="menu-expandido" aria-label="Menu expandido" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>{links.map(([id,label])=><a key={id} href={'#'+id} onClick={()=>setMenu(false)}>{label}<ArrowUpRight size={16}/></a>)}</motion.nav>}</AnimatePresence>
    </header>
    <main id="conteudo">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="mono label"><span className="signal"/> Representação em EPS</p>
          <h1>EPS para obras<br/>e indústria.</h1>
          <p>Atendimento próximo para escolher o material, alinhar prazos e fazer seu pedido com segurança.</p>
          <a className="button primary" href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> Fale pelo WhatsApp <ArrowUpRight size={17}/></a>
          <a className="explore mono" href="#sobre"><ArrowDown size={15}/> Conheça a Silvério</a>
        </div>
        <figure className="hero-media"><img src="./eps-abertura.png" alt="Blocos e painéis de poliestireno expandido" fetchPriority="high"/><figcaption className="mono">EPS · Imagem ilustrativa</figcaption></figure>
      </section>
      <section className="about shell" id="sobre">
        <p className="mono label">Sobre nós</p>
        <h2>Entendemos a sua aplicação.<br/>Acompanhamos a sua compra.</h2>
        <p>A Silvério é representante comercial da Kingspan Isoeste e atende construtoras, engenheiros, lajeiros, fabricantes de colchões e recortadores de EPS. A conversa começa com a sua necessidade e segue com orientação técnica e comercial para alinhar material, disponibilidade e entrega.</p>
        <div className="pills"><a href="#solucoes"><Building2 size={16}/> Construção civil</a><a href="#solucoes"><Layers size={16}/> Lajes</a><a href="#solucoes"><Scissors size={16}/> Recorte de EPS</a><a href="#solucoes"><Blocks size={16}/> Indústria</a></div>
      </section>
      <Solutions/>
      <section className="blog shell" id="blog">
        <div className="section-top"><div><p className="mono label">Blog</p><h2>Guia de compra de EPS.</h2></div><a href="https://www.silveriorepresentacao.com.br/blog" target="_blank" rel="noopener noreferrer">Ver blog da Silvério <ArrowUpRight size={16}/></a></div>
        <div className="posts">{articles.map(item=><details key={item.title}><summary><span className="mono">{item.tag}</span><h3>{item.title}</h3><Plus size={19}/></summary><p>{item.body}</p></details>)}</div>
      </section>
      <section className="contact" id="contato">
        <div className="shell contact-layout">
          <div><p className="mono label">Contato</p><h2>Vamos falar sobre<br/>o seu projeto?</h2><p>Conte o que precisa, a quantidade prevista e o prazo da sua compra.</p></div>
          <div className="channels"><a className="button primary" href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> Iniciar conversa <ArrowUpRight size={18}/></a><a className="phone" href={'tel:+'+contact.phone}>{contact.display} <ArrowRight size={16}/></a>{contact.email&&<a className="phone" href={'mailto:'+contact.email}><Mail size={16}/> {contact.email}</a>}</div>
        </div>
      </section>
    </main>
    <footer className="shell footer"><a href="#inicio">SILVÉRIO<span> REPRESENTAÇÃO</span></a><span>Representação comercial em EPS</span><a href="#inicio">Voltar ao topo ↑</a></footer>
  </>;
}

if (typeof document !== 'undefined') {
  const root=document.getElementById('root')!;
  if(root.hasChildNodes()) hydrateRoot(root,<App/>);
  else createRoot(root).render(<App/>);
}
