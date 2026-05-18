# 🌐 Hoje Hub — Central de Landing Pages & Vendas da Vaga Limitada

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://hoje.vagalimitada.com)
[![Custom Domain](https://img.shields.io/badge/Domain-hoje.vagalimitada.com-coral?style=for-the-badge)](https://hoje.vagalimitada.com)
[![Analytics](https://img.shields.io/badge/Tracking-GTM%20&%20UTMify-green?style=for-the-badge&logo=google-analytics)](https://tagmanager.google.com)

Bem-vindo ao repositório **Hoje Hub** (`hoje.git`). Este repositório funciona como uma central de distribuição e hospedagem de **páginas de vendas (Landing Pages) estáticas de alta conversão** para infoprodutos e cursos digitais da empresa. 

A hospedagem é feita de forma ultra-otimizada e sem custos de servidor utilizando o **GitHub Pages**, centralizado sob o domínio customizado **`hoje.vagalimitada.com`**.

---

## 🛠️ Arquitetura e Roteamento Multicampanha

O projeto é estruturado de forma descentralizada. A raiz e cada subpasta correspondem a uma rota pública no domínio principal. Cada pasta contém um site estático completo (copiado e otimizado a partir de estruturas WordPress/Elementor) contendo os scripts de tracking, assets e botões de checkout específicos.

```
                    ┌────── [ hoje.vagalimitada.com ] ──────┐
                    │                                        │
     ┌──────────────┼──────────────┬──────────────┬──────────┴──────────────┐
     ▼              ▼              ▼              ▼                         ▼
  (Raiz)     /resinaartistica   /feltros2025   /bolsaslucrativas2025   /costura/...
[Redireciona/ [Curso de Resina] [Moldes Feltro][100 Bolsas de Crochê]  [Padrões de Costura]
  Encerrado]
```

---

## 📊 Catálogo de Rotas e Ofertas

Abaixo está o mapeamento completo das rotas disponíveis no repositório, seus respectivos infoprodutos, status de atividade e detalhes comerciais.

| Rota / Subdiretório | Infoproduto / Oferta | Status | Preço / Plano | Checkout (PerfectPay) | Observações |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`/` (Raiz)** | Página de Transição | ⛔ *Inativo* | - | - | Exibe o aviso **"Promoção Encerrada"** com GTM ativo. |
| **`/resinaartistica`** | Curso Resina Artística | 🟢 **Ativo** | **Master:** R$ 29,90 <br> **Básico:** R$ 10,00 | Master: [PPU38CPO858](https://go.perfectpay.com.br/PPU38CPO858) <br> Básico: [PPU38CPO85J](https://go.perfectpay.com.br/PPU38CPO85J) | Ensina a fabricar e vender joias, chaveiros, mesas e móveis de resina. Contém FAQ dinâmico e 4 bônus exclusivos. |
| **`/bolsaslucrativas2025`** | 100 Bolsas de Crochê Lucrativas | 🟢 **Ativo** | R$ 10,00 | [PPU38CPO8JL](https://go.perfectpay.com.br/PPU38CPO8JL) | Inclui receitas, certificado de conclusão, suporte individual por 90 dias e grupo de alunas. |
| **`/2500-modelos-de-croche`** | 2500 Modelos de Crochê | 🟢 **Ativo** | R$ 10,00 | Acessível via `/2500-modelos-de-croche/p/index.html` | Pacote massivo de receitas de crochê. |
| **`/croche2500modelos`** | Crochê 2500 Modelos (Alternativo) | 🟢 **Ativo** | R$ 10,00 | Acessível via `/croche2500modelos/croche/index.html` | Rota `/croche2500modelos/index.html` desativada (encerrada). Página ativa está sob `/croche`. |
| **`/costura`** | Moldes de Costura Premium | 🟢 **Ativo** | R$ 10,00 | Acessível via `/costura/moldes/index.htm` | Rota raiz `/costura/index.html` desativada (encerrada). Página ativa está sob `/moldes`. |
| **`/costuracreativa`** | Curso de Confecção de Bolsas Passo a Passo | 🟢 **Ativo** | R$ 10,00 | Acessível via `/costuracreativa/curso-de-confeccao-de-bolsas-passo-a-passo/index.htm` | Rota raiz `/costuracreativa/index.html` desativada (encerrada). Página ativa está sob subpasta de bolsas. |
| **`/feltros2025`** | Moldes Feltros Religiosos | 🟢 **Ativo** | R$ 10,00 | Acessível via `/feltros2025/feltros-religioso/index.htm` | Molde especializado para artesanato religioso. |
| **`/moldesparafeltro`** | Moldes para Feltro Geral | 🟢 **Ativo** | R$ 10,00 | Acessível na raiz da pasta `/index.html` | Apostilas e moldes prontos para impressão. |
| **`/criacao-de-camaroes`** | Curso de Criação de Camarões | 🟢 **Ativo** | R$ 10,00 | Acessível via `/criacao-de-camaroes/p/index.htm` | Guia prático de carcinicultura. |

---

## 📈 Stack de Conversão & Ferramentas de Marketing

Todas as páginas contam com scripts nativos injetados de forma a rastrear, aquecer e converter os leads da forma mais transparente e rápida possível.

### 1. Rastreamento e Pixel (GTM)
Cada ponto de entrada de HTML carrega um container global do **Google Tag Manager** no início do `<head>` e do `<body>`:
* **ID do GTM:** `GTM-WWX5XB9`
* Responsável por gerenciar pixels do Facebook, Google Ads, TikTok e disparar eventos de PageView e cliques no checkout automaticamente.

### 2. Preservação de UTMs (UTMify)
Nas páginas de vendas ativas, há o script UTMify importado dinamicamente:
```html
<script src="scripts/utms/latest.js" data-utmify-prevent-xcod-sck="" data-utmify-prevent-subids="" async defer></script>
```
* **Função:** Captura os parâmetros UTM da URL (`utm_source`, `utm_medium`, `utm_campaign`, `src`, etc.) e os propaga de forma transparente para todos os links de checkout (` परफेक्टपे ` / ` PerfectPay `) presentes nos botões, evitando perda de rastreamento no momento da compra.

### 3. Gatilhos de Prova Social Real-Time (Notiflix)
A rota `/bolsaslucrativas2025` e outras integram a biblioteca **Notiflix** para simular notificações de vendas em tempo real no canto superior direito:
```javascript
// Dispara popups simulando compras de alunas de forma orgânica
var names_fem = ['Maria', 'Ana', 'Francisca', 'Juliana', 'Patrícia', 'Camila', ...];
function show_notification() {
    msg_final = "<strong>" + names_fem[Math.floor(Math.random() * names_fem.length)] + "</strong>";
    msg_final += " acabou de comprar o produto";
    Notiflix.Notify.Success(msg_final, option);
}
```
* **Efeito:** Aumenta a escassez e constrói prova social instantânea no tráfego frio.

### 4. Data e Urgência Dinâmica
Gatilhos dinâmicos inserem a data atual atualizada via JavaScript nas ofertas de urgência ("*PROMOÇÃO VÁLIDA SOMENTE HOJE: DD/MM/AAAA*"), impedindo que a página pareça datada.

---

## 🔧 Guia de Manutenção e Operações

### Como reativar ou pausar uma oferta
Se um produto foi descontinuado ou a promoção terminou:
1. Copie a estrutura do arquivo `index.html` da raiz (o modelo de Promoção Encerrada).
2. Substitua o `index.html` do produto inativo por este template de redirecionamento.
3. Se quiser reativar, recupere a página de vendas original do histórico do Git ou renomeie arquivos como `index.htm` / `index_active.html`.

### Atualizar Links de Checkout
Os links de pagamento estão vinculados a botões que direcionam para a **PerfectPay**. Para alterar o recebedor ou mudar a oferta:
1. Abra o arquivo HTML de entrada da pasta desejada (ex: `/resinaartistica/index.htm`).
2. Procure por `perfectpay.com.br` ou pelo ID da oferta (ex: `PPU38CPO858`).
3. Substitua pelo novo link gerado na plataforma de afiliação.
4. O script UTMify anexará as informações de origem automaticamente ao novo link.

### Publicação (Deploy)
Toda alteração feita no branch principal (`main`) é sincronizada e publicada instantaneamente graças ao pipeline do **GitHub Pages**. Após dar o `git push`, as alterações estarão disponíveis em até 2 minutos no link correspondente.

---

## 💻 Requisitos para Visualização Local
Como as páginas são estáticas (HTML puro + CSS/JS hospedados localmente nas pastas `wp-content` ou remotamente em CDNs), você não precisa de nenhum compilador ou framework.

Para rodar localmente e testar alterações:
1. Abra a pasta do projeto no VS Code.
2. Inicie a extensão **Live Server** ou rode um servidor estático simples de sua preferência.
   * Exemplo via Python: `python -m http.server 8000`
   * Exemplo via Node.js: `npx serve .`
3. Acesse `http://localhost:8000` para navegar nas pastas e testar os checkouts.

---

⭐ **Desenvolvido e mantido pela equipe de marketing e tecnologia.** Todos os direitos de design e conteúdo são reservados.
