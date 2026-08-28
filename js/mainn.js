document.getElementById('yr').textContent = new Date().getFullYear();

/* ---- acequia rail: nodes + fill ---- */
var rail = document.querySelector('.acequia');
var fill = document.getElementById('fill');
var ptop = document.getElementById('ptop');
var secciones = [
  {id:'firma', label:'La firma'},
  {id:'areas', label:'Áreas'},
  {id:'socios', label:'Socios'},
  {id:'clientes', label:'Clientes'},
  {id:'contacto', label:'Contacto'}
];
var nodes = [];

function buildNodes(){
  nodes.forEach(function(n){ n.el.remove(); });
  nodes = [];
  var docH = document.body.scrollHeight;
  secciones.forEach(function(s){
    var target = document.getElementById(s.id);
    if(!target) return;
    var el = document.createElement('button');
    el.className = 'acequia__node';
    el.setAttribute('aria-label', 'Ir a ' + s.label);
    el.innerHTML = '<span>' + s.label + '</span>';
    el.style.top = ((target.offsetTop / docH) * 100) + '%';
    el.addEventListener('click', function(){
      target.scrollIntoView({behavior:'smooth'});
    });
    rail.appendChild(el);
    nodes.push({el:el, target:target});
  });
}

function onScroll(){
  var y = window.scrollY;
  var max = document.body.scrollHeight - window.innerHeight;
  var pct = max > 0 ? (y / max) : 0;
  fill.style.height = (pct * 100) + '%';
  ptop.style.width = (pct * 100) + '%';

  var hdr = document.getElementById('hdr');
  if(y > window.innerHeight * 0.85){ hdr.classList.add('is-stuck'); }
  else { hdr.classList.remove('is-stuck'); }

  var mid = y + window.innerHeight * 0.4;
  nodes.forEach(function(n){
    var t = n.target.offsetTop;
    var b = t + n.target.offsetHeight;
    n.el.classList.toggle('is-active', mid >= t && mid < b);
  });
}

window.addEventListener('scroll', onScroll, {passive:true});
window.addEventListener('resize', function(){ buildNodes(); onScroll(); });

/* ---- reveal on scroll ---- */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

/* ---- filtro de clientes ---- */
document.getElementById('filtros').addEventListener('click', function(ev){
  var btn = ev.target.closest('.filtro');
  if(!btn) return;
  var s = btn.dataset.s;
  this.querySelectorAll('.filtro').forEach(function(b){ b.classList.toggle('is-on', b === btn); });
  document.querySelectorAll('.cliente').forEach(function(c){
    c.classList.toggle('is-hidden', s !== 'all' && c.dataset.s !== s);
  });
  setTimeout(function(){ buildNodes(); onScroll(); }, 50);
});

/* ---- si el video no carga, el fondo degradado queda igual ---- */
var v = document.querySelector('.hero__bg video');
if(v){ v.addEventListener('error', function(){ v.style.display = 'none'; }); }

buildNodes();
onScroll();

/* ---- formulario de contacto ---- */
(function(){
  var form = document.getElementById('formContacto');
  if(!form) return;
  var msg = document.getElementById('formMsg');
  var btn = form.querySelector('.form__submit');

  function setMsg(texto, esError){
    msg.textContent = texto;
    msg.classList.toggle('is-error', !!esError);
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();

    // trampa antispam: si viene completo, es un bot
    if(form.website.value) return;

    var faltan = [];
    ['nombre','email','mensaje'].forEach(function(n){
      var campo = form[n];
      var vacio = !campo.value.trim();
      campo.classList.toggle('is-error', vacio);
      if(vacio) faltan.push(n);
    });
    var email = form.email.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(email && !emailOk){ form.email.classList.add('is-error'); faltan.push('email'); }

    if(faltan.length){
      setMsg('Revise los campos marcados.', true);
      return;
    }

    var datos = {
      nombre:   form.nombre.value.trim(),
      empresa:  form.empresa.value.trim(),
      email:    email,
      telefono: form.telefono.value.trim(),
      area:     form.area.value,
      mensaje:  form.mensaje.value.trim()
    };

    var endpoint = form.dataset.endpoint;

    // Sin endpoint configurado, abrimos el cliente de correo con todo cargado.
    if(!endpoint){
      var cuerpo =
        'Nombre: '   + datos.nombre   + '\n' +
        'Empresa: '  + datos.empresa  + '\n' +
        'Email: '    + datos.email    + '\n' +
        'Teléfono: ' + datos.telefono + '\n' +
        'Área: '     + datos.area     + '\n\n' +
        datos.mensaje;
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent('Consulta web — ' + datos.nombre) +
        '&body='    + encodeURIComponent(cuerpo);
      setMsg('Abriendo su cliente de correo…');
      return;
    }

    btn.disabled = true;
    setMsg('Enviando…');

    fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type':'application/json', 'Accept':'application/json'},
      body: JSON.stringify(datos)
    })
    .then(function(r){
      if(!r.ok) throw new Error(r.status);
      form.reset();
      setMsg('Consulta enviada. Le respondemos dentro de las 24 horas hábiles.');
    })
    .catch(function(){
      setMsg('No pudimos enviar la consulta. Escríbanos por WhatsApp.', true);
    })
    .finally(function(){ btn.disabled = false; });
  });

  form.addEventListener('input', function(ev){
    if(ev.target.classList) ev.target.classList.remove('is-error');
  });
})();

/* ---- menú mobile ---- */
(function(){
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if(!btn || !nav) return;

  function abrir(estado){
    nav.classList.toggle('is-open', estado);
    document.body.classList.toggle('nav-abierto', estado);
    btn.setAttribute('aria-expanded', estado ? 'true' : 'false');
    btn.textContent = estado ? 'Cerrar' : 'Menú';
  }

  btn.addEventListener('click', function(){
    abrir(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', function(ev){
    if(ev.target.tagName === 'A') abrir(false);
  });
  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape' && nav.classList.contains('is-open')) { abrir(false); btn.focus(); }
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 999) abrir(false);
  });
})();

/* ---- enlace activo en el header ---- */
(function(){
  var links = Array.prototype.slice.call(document.querySelectorAll('#nav a[href^="#"]'));
  if(!links.length) return;
  window.addEventListener('scroll', function(){
    var mid = window.scrollY + window.innerHeight * 0.4;
    links.forEach(function(a){
      var s = document.querySelector(a.getAttribute('href'));
      if(!s) return;
      a.classList.toggle('is-current', mid >= s.offsetTop && mid < s.offsetTop + s.offsetHeight);
    });
  }, {passive:true});
})();

/* ---- conteo de clientes para lectores de pantalla ---- */
(function(){
  var salida = document.getElementById('conteoClientes');
  var filtros = document.getElementById('filtros');
  if(!salida || !filtros) return;
  filtros.addEventListener('click', function(ev){
    var btn = ev.target.closest('.filtro');
    if(!btn) return;
    filtros.querySelectorAll('.filtro').forEach(function(b){
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    var visibles = document.querySelectorAll('.cliente:not(.is-hidden)').length;
    salida.textContent = visibles + (visibles === 1 ? ' empresa' : ' empresas');
  });
})();

/* ---- el video no arranca si molesta o si el usuario ahorra datos ---- */
(function(){
  var v = document.querySelector('.hero__bg video');
  if(!v) return;
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ahorroDatos = navigator.connection && navigator.connection.saveData;
  if(sinMovimiento || ahorroDatos){
    v.removeAttribute('autoplay');
    v.pause();
    v.preload = 'none';
  }
})();
