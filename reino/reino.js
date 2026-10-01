/* Cliente del Reino de Ruma: apodo único, partidas y tablón mensual.
   Toda la lógica de monedas vive en el servidor (Supabase); aquí solo se pide y se muestra. */
(function(){
  var URL='https://lpgmjfyqthnnrafvwizy.supabase.co/rest/v1/rpc/', KEY='sb_publishable_iZkBySTVnV-SVE_dXBNMCQ_MBE-5SJV';
  function leer(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
  function guardar(k,v){try{localStorage.setItem(k,String(v))}catch(e){}}
  var llaveMem='';
  function llave(){
    var k=leer('rey-llave','');
    if(!/^[a-f0-9]{48}$/.test(k)){
      k=llaveMem;
      if(!k){var a=new Uint8Array(24);(window.crypto||window.msCrypto).getRandomValues(a);k=Array.prototype.map.call(a,function(b){return('0'+b.toString(16)).slice(-2)}).join('');llaveMem=k}
      guardar('rey-llave',k);
    }
    return k;
  }
  function post(fn,body){
    var c=window.AbortController?new AbortController():null,t=c?setTimeout(function(){c.abort()},9000):0;
    return fetch(URL+fn,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY},body:JSON.stringify(body),signal:c?c.signal:undefined})
      .then(function(r){return r.json()})
      .then(function(j){clearTimeout(t);return j},function(e){clearTimeout(t);throw e});
  }
  var CORONA='<svg viewBox="0 0 40 40" width="18" height="18" aria-hidden="true" fill="none" stroke="#131316" stroke-width="3" stroke-linejoin="round"><path d="M5 29L3 12l9 8 8-12 8 12 9-8-2 17z" fill="#FFB727"/><rect x="5" y="29" width="30" height="5" rx="1" fill="#FCD611"/></svg>';
  var st=document.createElement('style');
  st.textContent='.estado-apodo{font-size:.8rem;font-weight:700;min-height:1.2em;margin:4px 2px 0;color:#CDBFF0}.estado-apodo.mal{color:#FF8A8A}.estado-apodo.bien{color:#9FE6A0}'+
   '.tablon{background:var(--tinta);border:3px solid var(--marca);border-radius:20px;padding:14px 14px 10px}.tablon h2{font-family:var(--display);font-weight:400;font-size:1.3rem;margin:0 0 2px;color:var(--oro);letter-spacing:.02em}.tablon .nota{margin:0 0 8px;font-size:.8rem;color:#CDBFF0;font-weight:600;line-height:1.3}'+
   '.tablon ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.tablon li{display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:center;padding:8px 6px;border-top:1px dashed #3B2A6B;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.tablon li:first-child{border-top:0}'+
   '.tablon .pos{font-family:var(--display);color:var(--oro);display:flex;align-items:center}.tablon .yo{color:var(--oro)}.tablon .pts{font-family:var(--display)}.tablon li.top1{background:rgba(255,183,39,.14);border-radius:12px;border-top-color:transparent}.tablon li.mio{background:rgba(142,100,226,.22);border-radius:12px}'+
   '.visita{display:grid;grid-template-columns:86px 1fr;gap:12px;align-items:center;text-decoration:none;background:var(--crema);color:var(--tinta);border:3px solid var(--tinta);border-radius:22px;padding:12px 14px;box-shadow:6px 6px 0 var(--tinta);position:relative;overflow:hidden;transition:transform .1s,box-shadow .1s}.visita:hover{transform:translate(-1px,-1px);box-shadow:7px 7px 0 var(--tinta)}.visita:active{transform:translate(5px,5px);box-shadow:1px 1px 0 var(--tinta)}.visita:focus-visible{outline:4px solid var(--oro);outline-offset:3px}.visita img{width:86px;height:auto;display:block}.visita h2{font-family:var(--display);font-weight:400;font-size:1.3rem;line-height:1.05;margin:0;color:var(--marca)}.visita p{margin:3px 0 8px;font-size:.84rem;font-weight:700;line-height:1.25}.visita .ir{display:inline-block;font-family:var(--display);font-size:1rem;letter-spacing:.03em;background:var(--oro);color:var(--tinta);border:3px solid var(--tinta);border-radius:999px;padding:6px 16px;box-shadow:3px 3px 0 var(--tinta)}.visita-mini{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font-family:var(--display);font-size:1.05rem;letter-spacing:.03em;color:var(--tinta);background:var(--oro);border:3px solid var(--tinta);border-radius:999px;padding:10px 18px;box-shadow:4px 4px 0 var(--tinta)}.visita-mini:active{transform:translate(4px,4px);box-shadow:0 0 0 var(--tinta)}.visita-mini:focus-visible{outline:4px solid var(--crema);outline-offset:3px}'+
   '.tablon .vacio{display:block;padding:10px 4px;color:#CDBFF0;font-weight:600;border:0}';
  document.head.appendChild(st);
  var R={
    llave:llave,
    apodo:function(){return leer('rey-apodo','')},
    registrado:function(){return leer('rey-reg','')==='1'},
    saldo:function(){return parseInt(leer('rey-saldo','0'),10)||0},
    guardarSaldo:function(n){guardar('rey-saldo',n)},
    registrar:function(ap){return post('reino_registrar',{p_apodo:ap,p_llave:llave()}).then(function(j){if(j&&j.ok){guardar('rey-apodo',j.apodo);guardar('rey-reg','1')}return j||{ok:false}})},
    iniciar:function(g){return post('reino_iniciar',{p_llave:llave(),p_juego:g})},
    cerrar:function(id,p,f){return post('reino_cerrar',{p_llave:llave(),p_partida:id,p_puntaje:p,p_fichas:f})},
    tablon:function(){return post('reino_tablon',{p_llave:llave()}).then(function(j){if(j&&j.ok&&j.yo){guardar('rey-saldo',j.yo.saldo);guardar('rey-reg','1');if(j.yo.apodo)guardar('rey-apodo',j.yo.apodo)}if(!j||!j.ok)throw new Error('tablon');return j})},
    /* campo de apodo: se guarda al salir del campo o con Enter */
    ligarApodo:function(input,alOk){
      var est=document.createElement('div');est.className='estado-apodo';est.setAttribute('aria-live','polite');
      (input.parentNode.classList.contains('apodo')||input.parentNode.classList.contains('yo')?input.parentNode:input).insertAdjacentElement('afterend',est);
      input.value=R.apodo();
      function poner(t,c){est.textContent=t;est.className='estado-apodo '+(c||'')}
      var ocupado=false;
      function guardarApodo(){
        var v=(input.value||'').trim();
        if(!v||ocupado||(R.registrado()&&v===R.apodo()))return;
        ocupado=true;poner('Guardando…');
        R.registrar(v).then(function(j){
          ocupado=false;
          if(j&&j.ok){input.value=j.apodo;poner('Listo, '+j.apodo+'. Tus monedas ya cuentan en el tablón.','bien');if(alOk)alOk(j)}
          else poner((j&&j.error)||'No pudimos guardar tu apodo. Inténtalo otra vez.','mal');
        },function(){ocupado=false;poner('Sin conexión. Revisa tu internet e inténtalo de nuevo.','mal')});
      }
      input.addEventListener('change',guardarApodo);
      input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();guardarApodo();input.blur()}});
      if(!R.registrado()&&R.apodo())guardarApodo();
      else if(!R.registrado())poner('Elige un apodo para ganar monedas y aparecer en el tablón.');
      return est;
    },
    /* dibuja una lista del tablón */
    filas:function(ul,lista,campo,sufijo,yoApodo,vacio,desde){
      desde=desde||0;
      ul.textContent='';
      if(!lista||!lista.length){var li=document.createElement('li');li.className='vacio';li.textContent=vacio||'Aún no hay nadie. ¡Sé el primero del mes!';ul.appendChild(li);return}
      lista.forEach(function(f,i){
        var li=document.createElement('li'),a=document.createElement('span'),b=document.createElement('span'),c=document.createElement('span');
        if(i===0&&!desde)li.className='top1';
        if(yoApodo&&f.apodo===yoApodo){li.className+=' mio';b.className='yo'}
        a.className='pos';if(i===0&&!desde)a.innerHTML=CORONA;else a.textContent=i+1+desde;
        b.textContent=f.apodo;c.className='pts';c.textContent=f[campo]+(sufijo||'');
        li.appendChild(a);li.appendChild(b);li.appendChild(c);ul.appendChild(li);
      });
    }
  };
  window.Reino=R;
})();
