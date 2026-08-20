gsap.registerPlugin(ScrollTrigger);
document.body.classList.add("loading");

const lenis = new Lenis({duration:1.15, smoothWheel:true, smoothTouch:false});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t*1000));
gsap.ticker.lagSmoothing(0);

const loader = document.querySelector("#loader");
const counter = document.querySelector(".loader-count");
let p=0;
const timer=setInterval(()=>{
  p=Math.min(100,p+Math.floor(Math.random()*14)+7);
  counter.textContent=String(p).padStart(3,"0");
  if(p>=100){
    clearInterval(timer);
    gsap.to(loader,{opacity:0,duration:.8,delay:.25,onComplete:()=>{
      loader.classList.add("done");
      document.body.classList.remove("loading");
      heroIn();
    }});
  }
},70);

function heroIn(){
  gsap.from(".hero-top,.hero-bottom",{y:20,opacity:0,duration:.8,stagger:.08,ease:"power3.out"});
  gsap.from(".hero-kicker",{y:35,opacity:0,duration:.8,ease:"power3.out"});
  gsap.from(".hero-title span",{yPercent:120,opacity:0,duration:1.25,stagger:.1,ease:"power4.out"});
  gsap.from(".hero-copy",{y:35,opacity:0,duration:.9,delay:.35,ease:"power3.out"});
  gsap.from(".hero-sticker",{scale:0,rotate:-30,opacity:0,duration:1.2,delay:.35,ease:"back.out(1.7)"});
}

const cursor=document.querySelector(".cursor");
const cursorLabel=document.querySelector(".cursor-label");
let cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy;
addEventListener("mousemove",e=>{cx=e.clientX;cy=e.clientY});
gsap.ticker.add(()=>{
  rx+=(cx-rx)*.18; ry+=(cy-ry)*.18;
  gsap.set(cursor,{x:rx,y:ry});
  gsap.set(cursorLabel,{x:rx,y:ry});
});
document.querySelectorAll("[data-cursor]").forEach(el=>{
  el.addEventListener("mouseenter",()=>{
    cursorLabel.textContent=el.dataset.cursor;
    gsap.to(cursor,{scale:3.2,duration:.25});
    gsap.to(cursorLabel,{opacity:1,duration:.2});
  });
  el.addEventListener("mouseleave",()=>{
    gsap.to(cursor,{scale:1,duration:.25});
    gsap.to(cursorLabel,{opacity:0,duration:.2});
  });
});

if(matchMedia("(pointer:fine)").matches){
  document.querySelectorAll(".magnetic").forEach(el=>{
    el.addEventListener("mousemove",e=>{
      const r=el.getBoundingClientRect();
      gsap.to(el,{x:(e.clientX-(r.left+r.width/2))*.16,y:(e.clientY-(r.top+r.height/2))*.16,duration:.35,ease:"power3.out"});
    });
    el.addEventListener("mouseleave",()=>gsap.to(el,{x:0,y:0,duration:.6,ease:"elastic.out(1,.45)"}));
  });
}

document.querySelectorAll(".reveal,.reveal-text").forEach(el=>{
  gsap.to(el,{
    opacity:1,y:0,duration:1.05,ease:"power3.out",
    scrollTrigger:{trigger:el,start:"top 82%",toggleActions:"play none none reverse"}
  });
});

gsap.to(".hero-title",{yPercent:-15,scale:.92,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
gsap.to(".hero-sticker",{y:-130,rotate:-25,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
gsap.to(".hero-copy",{y:-60,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});

document.querySelectorAll(".flow-word").forEach(el=>{
  const speed=parseFloat(el.dataset.speed||0);
  gsap.to(el,{xPercent:speed*55,ease:"none",scrollTrigger:{trigger:".flow-break",start:"top bottom",end:"bottom top",scrub:1}});
});

document.querySelectorAll(".project").forEach((card,i)=>{
  gsap.from(card,{y:90,opacity:0,rotate:i%2?-1.5:1.5,duration:1,ease:"power3.out",scrollTrigger:{trigger:card,start:"top 88%",toggleActions:"play none none reverse"}});
  gsap.to(card.querySelector("img"),{yPercent:-4,ease:"none",scrollTrigger:{trigger:card,start:"top bottom",end:"bottom top",scrub:1}});
});

document.querySelectorAll(".services span").forEach((el,i)=>{
  gsap.from(el,{x:i%2?-30:30,opacity:0,duration:.6,delay:i*.03,scrollTrigger:{trigger:".services",start:"top 78%"}});
});

gsap.from(".mega-btn",{y:30,opacity:0,duration:.8,scrollTrigger:{trigger:".hire-section",start:"top 65%"}});
gsap.to(".logo-orbit",{rotateZ:7,ease:"none",scrollTrigger:{trigger:".hire-section",start:"top bottom",end:"bottom top",scrub:1}});
gsap.to(".hire-glow",{x:-100,y:100,ease:"none",scrollTrigger:{trigger:".hire-section",start:"top bottom",end:"bottom top",scrub:1}});

const filters=[...document.querySelectorAll(".filter")];
const cards=[...document.querySelectorAll(".project")];
filters.forEach(btn=>{
  btn.addEventListener("click",()=>{
    filters.forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    const f=btn.dataset.filter;
    cards.forEach(card=>{
      const show=f==="all"||card.dataset.category===f;
      if(show){
        card.classList.remove("hidden");
        gsap.fromTo(card,{opacity:0,y:40,scale:.97},{opacity:1,y:0,scale:1,duration:.55,ease:"power3.out"});
      }else{
        gsap.to(card,{opacity:0,y:25,scale:.97,duration:.25,onComplete:()=>card.classList.add("hidden")});
      }
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();lenis.scrollTo(target,{duration:1.2});}
  });
});

// Lightweight fluid-flow canvas: drifting particles with spring-like mouse attraction.
const canvas=document.querySelector("#flow");
const ctx=canvas.getContext("2d");
let W,H,DPR,particles=[],mouse={x:-9999,y:-9999};
function resize(){
  DPR=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
  canvas.width=W*DPR; canvas.height=H*DPR; canvas.style.width=W+"px"; canvas.style.height=H+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const count=Math.min(150,Math.max(55,Math.floor(W/11)));
  particles=Array.from({length:count},(_,i)=>({
    x:Math.random()*W,y:Math.random()*H,
    px:0,py:0,
    vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,
    size:.4+Math.random()*1.3,
    seed:Math.random()*1000,
    alpha:.12+Math.random()*.25
  }));
}
resize(); addEventListener("resize",resize);
addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});
function flow(t){
  ctx.clearRect(0,0,W,H);
  for(const p of particles){
    p.px=p.x;p.py=p.y;
    const ang=Math.sin(p.y*.008+t*.00045+p.seed)*1.4+Math.cos(p.x*.005-t*.0003+p.seed)*.8;
    p.vx+=Math.cos(ang)*.006;p.vy+=Math.sin(ang)*.006;
    const dx=mouse.x-p.x,dy=mouse.y-p.y,d=Math.hypot(dx,dy);
    if(d<260){const force=(1-d/260)*.018;p.vx+=dx/d*force;p.vy+=dy/d*force}
    p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;
    if(p.x<-30)p.x=W+30;if(p.x>W+30)p.x=-30;if(p.y<-30)p.y=H+30;if(p.y>H+30)p.y=-30;
    ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);
    ctx.strokeStyle=`rgba(0,200,150,${p.alpha})`;ctx.lineWidth=p.size;ctx.stroke();
  }
  requestAnimationFrame(flow);
}
requestAnimationFrame(flow);

addEventListener("load",()=>ScrollTrigger.refresh());
/* =========================================================
   ART VISTA — PROJECT MODAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("projectModal");
  const openBtn = document.getElementById("openProjectModal");
  const closeBtn = document.getElementById("closeProjectModal");
  const backdrop = document.getElementById("modalBackdrop");

  const form = document.getElementById("projectForm");
  const submitBtn = document.getElementById("modalSubmit");
  const status = document.getElementById("formStatus");


  /* -----------------------------------------
     OPEN MODAL
  ----------------------------------------- */

  function openModal() {

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    if (typeof lenis !== "undefined" && lenis) {
      lenis.stop();
    }

    setTimeout(() => {

      const firstInput =
        form.querySelector("input[name='name']");

      if (firstInput) {
        firstInput.focus();
      }

    }, 500);
  }


  /* -----------------------------------------
     CLOSE MODAL
  ----------------------------------------- */

  function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

    if (typeof lenis !== "undefined" && lenis) {
      lenis.start();
    }

    status.textContent = "";
    status.classList.remove("error");

  }


  /* -----------------------------------------
     BUTTONS
  ----------------------------------------- */

  if (openBtn) {
    openBtn.addEventListener("click", openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }


  /* -----------------------------------------
     ESCAPE KEY
  ----------------------------------------- */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" &&
        modal.classList.contains("active")) {

      closeModal();

    }

  });


  /* -----------------------------------------
     SEND FORM WITHOUT LEAVING WEBSITE
  ----------------------------------------- */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    submitBtn.classList.add("loading");

    submitBtn.disabled = true;

    status.textContent = "SENDING ENQUIRY...";
    status.classList.remove("error");


    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());


    try {

      const response = await fetch(
        "https://formsubmit.co/ajax/anid4157@gmail.com",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          body: JSON.stringify(data)
        }
      );


      const result = await response.json();


      if (!response.ok || !result.success) {
        throw new Error("Submission failed");
      }


      /* SUCCESS */

      form.classList.add("success");

      status.textContent =
        "ENQUIRY SENT ✓ — I'LL GET BACK TO YOU SOON.";


      form.reset();


      submitBtn.querySelector("span:first-child")
        .textContent = "ENQUIRY SENT";


      setTimeout(() => {

        closeModal();

        form.classList.remove("success");

        submitBtn.querySelector("span:first-child")
          .textContent = "SEND ENQUIRY";

      }, 2500);


    } catch (error) {

      console.error(error);

      status.textContent =
        "COULDN'T SEND. PLEASE TRY AGAIN.";

      status.classList.add("error");

    }


    submitBtn.classList.remove("loading");

    submitBtn.disabled = false;

  });

});