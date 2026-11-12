// Dados dos produtos (edite aqui nomes, preços e ingredientes)
const produtos = [
  { id: "sabonete", cat: "Banho", nome: "Sabonete Líquido Calmante", vol: "260 ml", preco: 60.00, img: "sabonete.jpg",
    desc: "Limpeza suave com camomila e aloe vera, para tomar banho sem agredir a pele.",
    ingredientes: [
      ["Água purificada", "Base da fórmula."],
      ["Base de sabonete neutro", "Tensoativos suaves que limpam sem ressecar."],
      ["Extrato de camomila", "Ação acalmante."],
      ["Aloe vera (babosa)", "Hidrata e ajuda a regenerar a pele."],
      ["Aveia em pó (coloidal)", "Alivia a coceira e deixa a pele macia."],
      ["Glicerina", "Umectante: mantém a umidade da pele."],
      ["Permanganato de potássio (baixa concentração)", "Ajuda a secar as bolhas e a aliviar a coceira, com ação antisséptica."]
    ] },
  { id: "bruma", cat: "Alívio da coceira", nome: "Bruma Refrescante Anti-Coceira", vol: "200 ml", preco: 40.00, img: "bruma.jpg",
    desc: "Alívio imediato da coceira em um spray leve, fácil de levar na bolsa ou deixar na cabeceira.",
    ingredientes: [
      ["Água purificada", "Base da fórmula."],
      ["Água de camomila", "Ação acalmante."],
      ["Extrato de aveia", "Alívio da coceira."],
      ["Hidratante leve", "Hidratação sem pesar na pele."],
      ["Glicerina (baixa concentração)", "Umectante."],
      ["Aloe vera ou mentol (muito baixa concentração)", "Dá a sensação refrescante."]
    ] },
  { id: "espuma", cat: "Alívio da coceira", nome: "Refrescante Anti-Coceira", vol: "250 ml", preco: 40.00, img: "espuma.jpg",
    desc: "Espuma que refresca e alivia a coceira, aplicada de forma prática com a válvula pump.",
    ingredientes: [
      ["Base líquida leve (sabonete diluído)", "Limpeza suave."],
      ["Aloe vera", "Hidrata e acalma."],
      ["Pantenol (vitamina B5)", "Ajuda na regeneração da pele."],
      ["Permanganato de potássio (baixa concentração)", "Ajuda a secar as bolhas e a aliviar a coceira, com ação antisséptica."]
    ] },
  { id: "saquinho", cat: "Banho", nome: "Saquinho para Banho", vol: "10 sachês de uso único", preco: 45.00, img: "saquinho.jpg",
    desc: "Sachês de tecido de algodão com ervas secas para um banho calmante, como um chá para a pele.",
    ingredientes: [
      ["Camomila seca", "Ação acalmante."],
      ["Aveia coloidal ou fina", "Alivia a coceira."],
      ["Calêndula seca", "Ação anti-inflamatória suave."],
      ["Saquinho de tecido de algodão", "Embalagem que mantém as ervas dentro do banho."]
    ] },
  { id: "spray", cat: "Ambiente", nome: "Spray Calmante Ambiente", vol: "120 ml", preco: 52.50, img: "spray.jpg",
    desc: "Spray para a cama e o ambiente, para descansar melhor durante a recuperação.",
    ingredientes: [
      ["Água purificada", "Base da fórmula."],
      ["Extrato de camomila", "Ação acalmante."],
      ["Aloe vera", "Toque suave e hidratante."],
      ["Permanganato de potássio (baixa concentração)", "Ação antisséptica."]
    ] }
];

const $ = id => document.getElementById(id);
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const grade = $("grade");
let sacola = {}; // { idProduto: quantidade }
let timer;

function mostrarGrade(filtro = "todos") {
  const lista = produtos.filter(p => filtro === "todos" || p.cat === filtro);
  grade.classList.toggle("poucos", lista.length < 4 && filtro !== "todos");
  grade.innerHTML = lista.map(p => `
    <article class="produto">
      <div class="foto"><span class="tag">${p.cat}</span><img src="img/${p.img}" alt="${p.nome} Derma Care" loading="lazy"></div>
      <div class="corpo">
        <h3>${p.nome}</h3>
        <span class="vol">${p.vol}</span>
        <p class="desc">${p.desc}</p>
        <details>
          <summary>Ingredientes (${p.ingredientes.length})</summary>
          <ul class="ing">${p.ingredientes.map(([n, d]) => `<li><strong>${n}</strong>${d}</li>`).join("")}</ul>
        </details>
        <div class="compra"><span class="preco">${brl(p.preco)}</span><button type="button" data-id="${p.id}">Adicionar à sacola</button></div>
      </div>
    </article>`).join("");
  revelar(grade.querySelectorAll(".produto"));
}

function avisar(texto) {
  const a = $("aviso");
  a.textContent = texto;
  a.classList.add("ativo");
  clearTimeout(timer);
  timer = setTimeout(() => a.classList.remove("ativo"), 2200);
}

function desenharSacola() {
  const ids = Object.keys(sacola);
  let total = 0, qtd = 0;
  $("itens").innerHTML = ids.length ? ids.map(id => {
    const p = produtos.find(x => x.id === id), n = sacola[id];
    total += p.preco * n; qtd += n;
    return `<li><img src="img/${p.img}" alt=""><div>${p.nome}<small>${n} × ${brl(p.preco)}</small></div><button type="button" data-remover="${id}">Remover</button></li>`;
  }).join("") : `<li class="vazio">Sua sacola está vazia. Escolha um produto para começar.</li>`;
  $("total").textContent = brl(total);
  $("contador").textContent = qtd;
}

function adicionar(id) {
  sacola[id] = (sacola[id] || 0) + 1;
  desenharSacola();
  avisar(`${produtos.find(p => p.id === id).nome} adicionado à sacola`);
}

function gaveta(abrir) {
  $("gaveta").classList.toggle("aberta", abrir);
  $("gaveta").setAttribute("aria-hidden", !abrir);
  $("fundo").hidden = !abrir;
}

grade.addEventListener("click", e => {
  const b = e.target.closest("button[data-id]");
  if (b) adicionar(b.dataset.id);
});
document.querySelector(".filtros").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll(".filtros button").forEach(x => x.classList.toggle("ativo", x === b));
  mostrarGrade(b.dataset.f);
});
$("itens").addEventListener("click", e => {
  const b = e.target.closest("button[data-remover]");
  if (b) { delete sacola[b.dataset.remover]; desenharSacola(); }
});
$("abrir").addEventListener("click", () => gaveta(true));
$("fechar").addEventListener("click", () => gaveta(false));
$("fundo").addEventListener("click", () => gaveta(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") gaveta(false); });
$("finalizar").addEventListener("click", () => avisar("Este é um site de apresentação: não há pagamento."));

const totalKit = 232.50;
$("kit-valor").textContent = brl(totalKit);
$("kit-add").addEventListener("click", () => { produtos.forEach(p => sacola[p.id] = (sacola[p.id] || 0) + 1); desenharSacola(); avisar("Kit completo adicionado à sacola"); });

// Entrada dos textos e imagens conforme a rolagem
const seletoresRevelacao = [
  ".hero-texto > *", ".hero img", ".diferenciais > div",
  ".proposito-titulo > *", ".proposito-texto > *",
  ".rotina h2", ".rotina li", ".produtos-topo > *",
  ".kit > *", ".rodape > div", ".direitos"
];
const obs = "IntersectionObserver" in window ? new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    obs.unobserve(el);
    el.classList.add("visto");
    setTimeout(() => {
      el.classList.remove("rv", "visto");
      el.style.removeProperty("--d");
    }, 1500);
  });
}, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }) : null;

function revelar(lista) {
  lista.forEach(el => {
    if (!obs || el.classList.contains("rv")) return;
    const irmaos = [...el.parentElement.children];
    el.style.setProperty("--d", (irmaos.indexOf(el) % 4) * 0.08 + "s");
    el.classList.add("rv");
    obs.observe(el);
  });
}
seletoresRevelacao.forEach(sel => revelar(document.querySelectorAll(sel)));

mostrarGrade();
desenharSacola();
